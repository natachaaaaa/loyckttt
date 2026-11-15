<script setup>
import TheFooter from './components/TheFooter.vue'
import { sections } from './content'
</script>

<template>
  <a class="book" href="#contact">Rendez-vous</a>
  <main>
    <!-- Each section of home.json renders the component registered under its "component" name (main.js). -->
    <component :is="blok.component" v-for="blok in sections" :key="blok._uid" :blok="blok" />
  </main>
  <TheFooter />
</template>

<style>
html {
  scroll-behavior: smooth;
}

/* Always-reachable booking link. */
.book {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 10;
  font-family: var(--font-metal);
  font-size: 1.15rem;
  letter-spacing: 0.06em;
  text-decoration: none;
  color: var(--bone);
  background: var(--ink);
  border: 1px solid var(--bone);
  padding: 0.35em 0.9em;
  transition: background 0.3s, color 0.3s;
}

.book:hover,
.book:focus-visible {
  background: var(--bone);
  color: var(--ink);
}
</style>
