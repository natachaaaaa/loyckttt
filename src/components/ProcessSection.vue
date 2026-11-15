<script setup>
import SectionHead from './SectionHead.vue'
import { roman } from '../utils'

defineProps({ blok: Object })
</script>

<template>
  <section class="section process" aria-labelledby="process-title">
    <SectionHead id="process-title" :kicker="blok.kicker" :title="blok.title" />
    <ol v-stagger class="process__list">
      <li v-for="(s, i) in blok.steps" :key="s._uid" class="process__step">
        <span class="process__n" aria-hidden="true">{{ roman(i + 1) }}</span>
        <h3 class="process__title">{{ s.title }}</h3>
        <p class="body-text">{{ s.text }}</p>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.process__list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr));
  gap: clamp(2rem, 4vw, 4rem);
  margin-top: clamp(2.5rem, 5vw, 4.5rem);
}

/* Thin rule with a dotwork fade linking the steps. */
.process__step {
  position: relative;
  padding-top: 1.5rem;
  border-top: 1px solid #3a3a3a;
}

.process__step::before {
  content: '';
  position: absolute;
  top: -3px;
  left: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--bone);
}

.process__n {
  display: block;
  font-family: var(--font-metal);
  font-size: clamp(3rem, 5vw, 4.5rem);
  line-height: 1;
  color: var(--bone);
}

.process__title {
  font-variant: small-caps;
  font-size: clamp(1.4rem, 2vw, 1.9rem);
  margin: 0.75rem 0 0.5rem;
}

.process__step .body-text {
  color: var(--muted);
}
</style>
