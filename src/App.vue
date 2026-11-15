<script setup>
import { onMounted } from 'vue'
import TheFooter from './components/TheFooter.vue'
import { story, connectBridge } from './storyblok'

onMounted(connectBridge)
</script>

<template>
  <a class="book" href="#contact">Rendez-vous</a>
  <main v-editable="story.content">
    <StoryblokComponent v-for="blok in story.content.body" :key="blok._uid" :blok="blok" />
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
