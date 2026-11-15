<script setup>
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import OrnSigil from './ornaments/OrnSigil.vue'
import { image } from '../content'

const props = defineProps({ blok: Object })
const flashes = computed(() => (props.blok?.items || []).map((f) => ({ ...f, img: image(f.image, 600) })))
</script>

<template>
  <section class="section flash" aria-labelledby="flash-title">
    <SectionHead id="flash-title" :kicker="blok.kicker" :title="blok.title" />
    <p v-if="blok.intro" class="body-text flash__intro">{{ blok.intro }}</p>
    <ul v-stagger class="flash__grid">
      <li v-for="f in flashes" :key="f._uid" class="flash__card" :class="{ 'is-taken': f.taken }">
        <div class="flash__img">
          <img v-if="f.img" :src="f.img.src" :alt="f.img.alt || f.name" :width="f.img.w" :height="f.img.h" loading="lazy" />
          <OrnSigil v-else />
        </div>
        <p class="flash__meta">
          <span>{{ f.name }}</span>
          <span>{{ f.size }}</span>
        </p>
        <p class="flash__status">{{ f.taken ? 'Réservé' : 'Disponible' }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.flash__intro {
  max-width: 46ch;
  margin-top: 1.5rem;
  color: var(--muted);
}

.flash__grid {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
  gap: clamp(1.5rem, 3vw, 3rem);
  margin-top: clamp(2.5rem, 5vw, 4.5rem);
}

/* Flash sheet look: dotted border, seal in the middle until the real drawing is in. */
.flash__img {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border: 2px dotted var(--bone);
  color: var(--bone);
  font-size: clamp(3rem, 6vw, 5rem);
  transition: border-style 0.3s, background 0.3s;
}

.flash__img img {
  width: 82%;
  height: 82%;
  object-fit: contain;
}

.flash__card:not(.is-taken):hover .flash__img {
  border-style: solid;
  background: #0d0d0d;
}

.flash__meta {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-variant: small-caps;
  font-size: 1.15rem;
}

.flash__status {
  font-family: var(--font-metal);
  letter-spacing: 0.06em;
  color: var(--bone);
}

.is-taken {
  opacity: 0.4;
}

.is-taken .flash__status {
  text-decoration: line-through;
}
</style>
