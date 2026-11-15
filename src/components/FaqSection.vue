<script setup>
import SectionHead from './SectionHead.vue'
import OrnSigil from './ornaments/OrnSigil.vue'

// The same items feed the FAQPage structured data (src/seo.js).
defineProps({ blok: Object })
</script>

<template>
  <section class="section faq" aria-labelledby="faq-title">
    <SectionHead id="faq-title" :kicker="blok.kicker" :title="blok.title" />
    <div v-stagger class="faq__list">
      <details v-for="(it, i) in blok.items" :key="it._uid" class="faq__item" :open="i === 0">
        <summary class="faq__q">
          <span>{{ it.question }}</span>
          <OrnSigil class="faq__mark" />
        </summary>
        <p class="body-text faq__a">{{ it.answer }}</p>
      </details>
    </div>
  </section>
</template>

<style scoped>
.faq__list {
  max-width: 980px;
  margin-top: clamp(2rem, 4vw, 3.5rem);
}

.faq__item {
  border-bottom: 1px solid #2a2a2a;
}

.faq__q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.25rem 0;
  font-variant: small-caps;
  font-size: clamp(1.2rem, 1.8vw, 1.7rem);
  cursor: pointer;
  list-style: none;
}

.faq__q::-webkit-details-marker {
  display: none;
}

.faq__q:focus-visible {
  outline: 1px solid var(--bone);
  outline-offset: 4px;
}

.faq__mark {
  font-size: 1.5em;
  color: var(--bone);
  flex: none;
  transition: rotate 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.faq__item[open] .faq__mark {
  rotate: 90deg;
}

.faq__a {
  max-width: 62ch;
  padding-bottom: 1.5rem;
  color: var(--muted);
}

@media (prefers-reduced-motion: reduce) {
  .faq__mark {
    transition: none;
  }
}
</style>
