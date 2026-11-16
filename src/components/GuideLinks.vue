<script setup>
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import { pages, pageUrl } from '../content'

// Internal links to the content pages: all of them (home "guides" section) or blok.slugs (related pages).
const props = defineProps({ blok: Object })
const list = computed(() =>
  props.blok?.slugs ? props.blok.slugs.map((s) => pages.find((p) => p.slug === s)).filter(Boolean) : pages,
)
</script>

<template>
  <section class="section guides" aria-labelledby="guides-title">
    <SectionHead id="guides-title" :kicker="blok?.kicker" :title="blok?.title || 'À lire aussi'" />
    <ul v-stagger class="guides__grid">
      <li v-for="p in list" :key="p.slug" class="guides__card">
        <a :href="pageUrl(p)" class="guides__link">
          <span class="guides__kicker">{{ p.kicker }}</span>
          <span class="guides__title">{{ p.h1 }}</span>
          <span class="guides__desc">{{ p.description }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.guides__grid {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: clamp(1rem, 2vw, 1.75rem);
  margin-top: clamp(2rem, 4vw, 3.5rem);
}

/* Flash-sheet look, like the flash cards: dotted until hovered. */
.guides__link {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  height: 100%;
  padding: 1.5rem;
  border: 1px dotted var(--bone);
  color: inherit;
  text-decoration: none;
  transition: border-style 0.3s, background 0.3s;
}

.guides__link:hover,
.guides__link:focus-visible {
  border-style: solid;
  background: #0d0d0d;
  outline: none;
}

.guides__kicker {
  font-family: var(--font-metal);
  letter-spacing: 0.08em;
  color: var(--muted);
}

.guides__title {
  font-variant: small-caps;
  font-size: clamp(1.3rem, 1.8vw, 1.7rem);
  line-height: 1.1;
  color: var(--bone);
}

.guides__desc {
  font-family: var(--font-small);
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--muted);
}
</style>
