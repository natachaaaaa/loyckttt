<script setup>
import { ref, watch, nextTick } from 'vue'

// Full-size viewer for a work. v-model is the open index (null = closed).
// works: [{ uid, n (numeral), year, img, full: { src, alt } }]
const props = defineProps({ works: { type: Array, required: true } })
const index = defineModel({ type: Number, default: null })
const dialog = ref()

watch(index, async (i, prev) => {
  await nextTick()
  if (i != null && prev == null) dialog.value.showModal()
  if (i == null && dialog.value?.open) dialog.value.close()
})

const step = (n) => (index.value = (index.value + n + props.works.length) % props.works.length)

function onKey(e) {
  if (e.key === 'ArrowRight') step(1)
  if (e.key === 'ArrowLeft') step(-1)
}
</script>

<template>
  <dialog
    ref="dialog"
    class="lightbox"
    aria-label="Tatouage en grand"
    @close="index = null"
    @keydown="onKey"
    @click.self="index = null"
  >
    <template v-if="index != null">
      <figure class="lightbox__figure">
        <img :key="works[index].uid" :src="works[index].full.src" :alt="works[index].img.alt" class="lightbox__img" />
        <figcaption class="lightbox__cap">
          <span class="lightbox__n">{{ works[index].n }}</span>
          <span class="lightbox__year">{{ works[index].year }}</span>
        </figcaption>
      </figure>
      <button class="lightbox__btn lightbox__prev" aria-label="Tatouage précédent" @click="step(-1)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 L7 12 L15 20 M11 8 L8 5 M11 16 L8 19" /></svg>
      </button>
      <button class="lightbox__btn lightbox__next" aria-label="Tatouage suivant" @click="step(1)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 L17 12 L9 20 M13 8 L16 5 M13 16 L16 19" /></svg>
      </button>
      <button class="lightbox__btn lightbox__close" aria-label="Fermer" autofocus @click="index = null">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5 L19 19 M19 5 L5 19 M9 5 L7 7 M17 19 L15 17" /></svg>
      </button>
    </template>
  </dialog>
</template>

<style scoped>
.lightbox {
  width: 100vw;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--bone);
  overflow: hidden;
}

.lightbox::backdrop {
  background: var(--ink);
}

.lightbox__figure {
  height: 100%;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 1rem;
  padding: 3.5rem 4.5rem;
  pointer-events: none; /* clicks around the image reach the dialog and close it */
}

.lightbox__img {
  max-width: 100%;
  max-height: calc(100dvh - 9rem);
  object-fit: contain;
  pointer-events: auto;
  animation: reveal 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: scale(0.97);
    filter: grayscale(1);
  }
}

.lightbox__cap {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.lightbox__n {
  font-family: var(--font-metal);
  font-size: 2rem;
}

.lightbox__year {
  font-family: var(--font-small);
  color: var(--muted);
}

.lightbox__btn {
  position: fixed;
  width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  background: none;
  border: 0;
  cursor: pointer;
  color: inherit;
}

.lightbox__btn svg {
  width: 1.8rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
}

.lightbox__btn:focus-visible {
  outline: 1px solid var(--bone);
}

.lightbox__prev { left: 0.75rem; top: 50%; translate: 0 -50%; }
.lightbox__next { right: 0.75rem; top: 50%; translate: 0 -50%; }
.lightbox__close { right: 0.75rem; top: 0.75rem; }

@media (prefers-reduced-motion: reduce) {
  .lightbox__img {
    animation: none;
  }
}
</style>

<style>
/* No page scroll behind the open viewer. */
html:has(dialog.lightbox[open]) {
  overflow: hidden;
}
</style>
