<script setup>
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import OrnMoon from './ornaments/OrnMoon.vue'
import { moonPhase } from '../utils'

const props = defineProps({ blok: Object })
const STATUS = { open: 'Places ouvertes', full: 'Complet', soon: 'À venir' }
const today = new Date().toISOString().slice(0, 10)

// Storyblok dates look like "2026-12-05 00:00". Past dates hide themselves; the rest are sorted.
const events = computed(() =>
  (props.blok?.events || [])
    .map((e, i) => {
      const ymd = e.date?.slice(0, 10)
      const date = ymd ? new Date(`${ymd}T12:00:00Z`) : null
      return {
        ...e,
        ymd,
        label: ymd ? `${ymd.slice(8, 10)}.${ymd.slice(5, 7)}` : 'JJ.MM',
        // The real moon of that night; undated placeholders get an arbitrary one.
        phase: date ? moonPhase(date) : (0.12 + i * 0.23) % 1,
        statusLabel: STATUS[e.status] || '',
      }
    })
    .filter((e) => !e.ymd || e.ymd >= today)
    .sort((a, b) => (a.ymd || '9999').localeCompare(b.ymd || '9999')),
)
</script>

<template>
  <section v-editable="blok" class="section agenda" aria-labelledby="agenda-title">
    <SectionHead id="agenda-title" :kicker="blok.kicker" :title="blok.title" />
    <ul v-stagger class="agenda__list">
      <li
        v-for="d in events"
        :key="d._uid"
        v-editable="d"
        class="agenda__row"
        :class="{ 'is-full': d.status === 'full' }"
      >
        <OrnMoon :phase="d.phase" class="agenda__moon" />
        <time class="agenda__date" :datetime="d.ymd">{{ d.label }}</time>
        <span class="agenda__city">{{ d.city }}</span>
        <span class="agenda__place">{{ d.place }}</span>
        <span class="agenda__status">{{ d.statusLabel }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.agenda__list {
  list-style: none;
  padding: 0;
  margin-top: clamp(2rem, 4vw, 3.5rem);
}

.agenda__row {
  display: grid;
  grid-template-columns: auto 7rem 1fr 1fr auto;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 2.5rem);
  padding: 1.1rem 0;
  border-bottom: 1px solid #2a2a2a;
  font-variant: small-caps;
  font-size: clamp(1.1rem, 1.6vw, 1.6rem);
  transition: padding 0.3s, color 0.3s;
}

.agenda__row:hover {
  padding-left: 0.75rem;
}

.agenda__moon {
  font-size: 1.6em;
  color: var(--bone);
}

.agenda__date {
  font-family: var(--font-metal);
  color: var(--bone);
}

.agenda__place,
.agenda__status {
  color: var(--muted);
}

.is-full {
  opacity: 0.45;
}

@media (max-width: 720px) {
  .agenda__row {
    grid-template-columns: auto 1fr auto;
  }
  .agenda__place {
    display: none;
  }
  .agenda__city {
    grid-column: 2;
  }
  .agenda__date {
    grid-row: 1;
    grid-column: 2;
  }
  .agenda__status {
    grid-row: 1 / span 2;
    grid-column: 3;
  }
  .agenda__moon {
    grid-row: 1 / span 2;
  }
}
</style>
