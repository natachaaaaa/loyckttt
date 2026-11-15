<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import OrnSigil from './ornaments/OrnSigil.vue'
import {
  CONFIG,
  addMonthsYmd,
  dayStatus,
  fetchBusy,
  formatSlot,
  monthGrid,
  sendRequest,
  slotsFor,
  todayYmd,
} from '../booking'

// Address for direct contact and the mailto fallback (comes from the Storyblok contact section).
const props = defineProps({ email: { type: String, required: true } })

const today = todayYmd()
const [ty, tm] = today.split('-').map(Number)
const cursor = ref({ y: ty, m: tm - 1 })
const lastMonth = addMonthsYmd(today, CONFIG.horizonMonths).slice(0, 7)

const busy = ref([])
const loading = ref(true)
const calendarError = ref(false)
const day = ref(null)
const slot = ref(null)
const status = ref('idle') // idle | sending | sent | mail | error
const form = reactive({ name: '', email: '', idea: '', placement: '', size: '', refs: '', track: '', botcheck: false })

onMounted(async () => {
  try {
    busy.value = await fetchBusy(new Date(), new Date(Date.now() + (CONFIG.horizonMonths + 1) * 31 * 86400000))
  } catch {
    calendarError.value = true
  } finally {
    loading.value = false
  }
})

const monthLabel = computed(() =>
  new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(cursor.value.y, cursor.value.m, 1)),
  ),
)
const ym = computed(() => `${cursor.value.y}-${String(cursor.value.m + 1).padStart(2, '0')}`)
const canPrev = computed(() => ym.value > today.slice(0, 7))
const canNext = computed(() => ym.value < lastMonth)

const days = computed(() =>
  monthGrid(cursor.value.y, cursor.value.m).map((ymd) =>
    ymd && { ymd, n: Number(ymd.slice(8)), status: loading.value ? 'closed' : dayStatus(ymd, busy.value) },
  ),
)
const slots = computed(() => (day.value ? slotsFor(day.value, busy.value) : []))

const longDate = (ymd) =>
  new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    new Date(`${ymd}T00:00:00Z`),
  )
const statusLabel = { open: 'libre', full: 'complet', closed: 'fermé' }

function move(n) {
  const d = new Date(Date.UTC(cursor.value.y, cursor.value.m + n, 1))
  cursor.value = { y: d.getUTCFullYear(), m: d.getUTCMonth() }
}

function pickDay(ymd) {
  day.value = ymd
  slot.value = null
  status.value = 'idle'
}

async function submit() {
  status.value = 'sending'
  try {
    const res = await sendRequest(slot.value, form, props.email)
    if (res.mailto) {
      location.href = res.mailto
      status.value = 'mail'
    } else status.value = 'sent'
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <div class="booking">
    <!-- Calendar -->
    <div class="cal">
      <div class="cal__head">
        <button class="cal__nav" :disabled="!canPrev" aria-label="Mois précédent" @click="move(-1)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 L7 12 L15 20 M11 8 L8 5 M11 16 L8 19" /></svg>
        </button>
        <p class="cal__month" aria-live="polite">{{ monthLabel }}</p>
        <button class="cal__nav" :disabled="!canNext" aria-label="Mois suivant" @click="move(1)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 L17 12 L9 20 M13 8 L16 5 M13 16 L16 19" /></svg>
        </button>
      </div>
      <div class="cal__grid" role="group" :aria-label="`Jours de ${monthLabel}`">
        <span v-for="(w, i) in ['L', 'M', 'M', 'J', 'V', 'S', 'D']" :key="i" class="cal__wd" aria-hidden="true">{{ w }}</span>
        <template v-for="(d, i) in days" :key="d?.ymd ?? `blank-${i}`">
          <span v-if="!d" />
          <button
            v-else
            class="cal__day"
            :class="[`is-${d.status}`, { 'is-selected': d.ymd === day, 'is-today': d.ymd === today }]"
            :disabled="d.status !== 'open'"
            :aria-pressed="d.ymd === day"
            :aria-label="`${longDate(d.ymd)} : ${statusLabel[d.status]}`"
            @click="pickDay(d.ymd)"
          >
            {{ d.n }}
          </button>
        </template>
      </div>
      <p class="cal__legend">
        <span><i class="dot is-open" /> libre</span>
        <span><i class="dot is-full" /> complet</span>
        <span><i class="dot is-closed" /> fermé</span>
      </p>
      <p v-if="loading" class="cal__info">Lecture de l'agenda…</p>
      <p v-else-if="calendarError" class="cal__info">
        L'agenda ne répond pas. Écris directement à <a :href="`mailto:${email}`">{{ email }}</a>.
      </p>
    </div>

    <!-- Slots, then the request form -->
    <div class="panel" aria-live="polite">
      <div v-if="status === 'sent' || status === 'mail'" class="panel__done">
        <OrnSigil class="panel__seal" />
        <p class="panel__title">{{ status === 'sent' ? 'Demande envoyée' : 'Demande prête' }}</p>
        <p class="body-text">
          {{
            status === 'sent'
              ? 'Réponse sous quelques jours. Le créneau est confirmé à réception de l’acompte.'
              : 'Ton application mail s’ouvre avec la demande pré-remplie : il ne reste qu’à l’envoyer.'
          }}
        </p>
      </div>

      <p v-else-if="!day" class="panel__hint"><OrnSigil /> Choisis un jour libre dans le calendrier.</p>

      <template v-else>
        <p class="panel__title">{{ longDate(day) }}</p>
        <div class="slots">
          <button
            v-for="s in slots"
            :key="s.id"
            class="slot"
            :class="{ 'is-selected': slot?.id === s.id }"
            :disabled="s.taken"
            :aria-pressed="slot?.id === s.id"
            @click="slot = s"
          >
            <span class="slot__label">{{ s.label }}</span>
            <span class="slot__hours">{{ s.taken ? 'Pris' : `${s.from} – ${s.to}`.replace(/:00/g, 'h') }}</span>
          </button>
        </div>

        <form v-if="slot" class="form" @submit.prevent="submit">
          <p class="form__when">{{ formatSlot(slot) }}</p>
          <div class="form__row">
            <label>Nom <input v-model="form.name" required autocomplete="name" /></label>
            <label>Email <input v-model="form.email" type="email" required autocomplete="email" /></label>
          </div>
          <label>Ton idée <textarea v-model="form.idea" rows="3" required></textarea></label>
          <div class="form__row">
            <label>Emplacement <input v-model="form.placement" placeholder="avant-bras, mollet…" /></label>
            <label>Taille approx. <input v-model="form.size" placeholder="~ 15 cm" /></label>
          </div>
          <label>Références <input v-model="form.refs" placeholder="liens, comptes, images…" /></label>
          <label>Le morceau qui va avec <input v-model="form.track" placeholder="artiste — titre" /></label>
          <!-- Honeypot: bots fill it, humans never see it. -->
          <input v-model="form.botcheck" type="checkbox" class="form__trap" tabindex="-1" aria-hidden="true" />
          <button class="form__send" :disabled="status === 'sending'">
            {{ status === 'sending' ? 'Envoi…' : 'Envoyer la demande' }}
          </button>
          <p v-if="status === 'error'" class="form__error" role="alert">
            L'envoi a échoué. Réessaie, ou écris à <a :href="`mailto:${email}`">{{ email }}</a>.
          </p>
          <p class="form__note">Une demande n'est pas une réservation : le créneau est confirmé à réception de l'acompte.</p>
        </form>
      </template>
    </div>
  </div>
</template>

<style scoped>
.booking {
  display: grid;
  grid-template-columns: minmax(0, 380px) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  margin-top: clamp(2rem, 4vw, 3rem);
  text-align: left;
}

@media (max-width: 820px) {
  .booking {
    grid-template-columns: 1fr;
  }
}

button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
}

button:disabled {
  cursor: default;
}

button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 1px solid var(--bone);
  outline-offset: 3px;
}

/* Calendar */
.cal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.cal__month {
  font-family: var(--font-metal);
  font-size: 1.6rem;
  color: var(--bone);
}

/* French dates: only the first letter is capitalized ("Mercredi 18 novembre"). */
.cal__month::first-letter,
.panel__title::first-letter {
  text-transform: uppercase;
}

.cal__nav {
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
}

.cal__nav svg {
  width: 1.4rem;
  fill: none;
  stroke: var(--bone);
  stroke-width: 1.4;
  stroke-linecap: round;
}

.cal__nav:disabled {
  opacity: 0.2;
}

.cal__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.cal__wd {
  text-align: center;
  font-size: 0.85rem;
  color: var(--muted);
  padding-bottom: 0.4rem;
}

.cal__day {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  font-family: var(--font-title);
  font-size: 1rem;
  border: 1px solid transparent;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.cal__day.is-open {
  border: 1px dotted var(--bone);
  color: var(--bone);
}

.cal__day.is-open:hover {
  border-style: solid;
}

.cal__day.is-full {
  color: #555;
  text-decoration: line-through;
}

.cal__day.is-closed {
  color: #333;
}

.cal__day.is-today {
  box-shadow: inset 0 -2px 0 #555;
}

.cal__day.is-selected {
  background: var(--bone);
  color: var(--ink);
  border-style: solid;
}

.cal__legend {
  display: flex;
  gap: 1.25rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  font-variant: small-caps;
  color: var(--muted);
}

.dot {
  display: inline-block;
  width: 0.7em;
  height: 0.7em;
  margin-right: 0.3em;
  vertical-align: -0.05em;
}

.dot.is-open {
  border: 1px dotted var(--bone);
}

.dot.is-full {
  background: linear-gradient(to top right, transparent 45%, #555 45% 55%, transparent 55%);
  border: 1px solid #555;
}

.dot.is-closed {
  border: 1px solid #333;
}

.cal__info {
  margin-top: 1rem;
  font-family: var(--font-small);
  font-style: italic;
  color: var(--muted);
}

/* Right panel */
.panel__hint {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 6rem;
  font-variant: small-caps;
  font-size: 1.2rem;
  color: var(--muted);
}

.panel__hint .sigil {
  font-size: 2rem;
  color: var(--bone);
}

.panel__title {
  font-family: var(--font-metal);
  font-size: clamp(1.6rem, 2.4vw, 2.2rem);
  color: var(--bone);
}

.panel__done .body-text {
  margin-top: 0.75rem;
  color: var(--muted);
}

.panel__seal {
  font-size: 3rem;
  color: var(--bone);
  margin-bottom: 0.75rem;
}

.slots {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.slot {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.8rem 1rem;
  border: 1px dotted var(--bone);
  text-align: left;
  transition: background 0.2s, color 0.2s;
}

.slot:not(:disabled):hover {
  border-style: solid;
}

.slot.is-selected {
  background: var(--bone);
  color: var(--ink);
}

.slot:disabled {
  border-color: #333;
  color: #555;
}

.slot__label {
  font-variant: small-caps;
  font-size: 1.25rem;
}

.slot__hours {
  font-family: var(--font-small);
  font-size: 0.95rem;
  opacity: 0.8;
}

/* Form: underline-only fields, small-caps labels */
.form {
  display: grid;
  gap: 1.1rem;
  margin-top: 1.75rem;
}

.form__when {
  font-family: var(--font-small);
  font-style: italic;
  color: var(--muted);
}

.form__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.1rem;
}

.form label {
  display: grid;
  gap: 0.3rem;
  font-variant: small-caps;
  font-size: 1.05rem;
  color: var(--muted);
}

.form input,
.form textarea {
  font: 1.05rem var(--font-small);
  color: var(--white);
  background: transparent;
  border: 0;
  border-bottom: 1px solid #444;
  padding: 0.35rem 0;
  resize: vertical;
  transition: border-color 0.2s;
}

.form input::placeholder,
.form textarea::placeholder {
  color: #555;
}

.form input:focus,
.form textarea:focus {
  border-color: var(--bone);
}

.form__trap {
  display: none;
}

.form__send {
  justify-self: start;
  margin-top: 0.5rem;
  font-family: var(--font-metal);
  font-size: clamp(1.4rem, 2.4vw, 2rem);
  color: var(--ink);
  background: var(--bone);
  padding: 0.3em 0.9em;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
}

.form__send:hover:not(:disabled) {
  background: var(--ink);
  color: var(--bone);
  box-shadow: inset 0 0 0 1px var(--bone);
}

.form__send:disabled {
  opacity: 0.6;
}

.form__error {
  color: var(--bone);
  font-family: var(--font-small);
}

.form__note {
  font-family: var(--font-small);
  font-style: italic;
  font-size: 0.95rem;
  color: var(--muted);
}
</style>
