<script setup>
import SectionHead from './SectionHead.vue'
import OrnFrame from './ornaments/OrnFrame.vue'

defineProps({ blok: Object })
// Storyblok textarea: one line per bullet.
const lines = (text) => (text || '').split('\n').map((l) => l.trim()).filter(Boolean)
</script>

<template>
  <section v-editable="blok" class="section infos" aria-labelledby="infos-title">
    <SectionHead id="infos-title" :kicker="blok.kicker" :title="blok.title" />
    <div v-stagger class="infos__grid">
      <OrnFrame v-for="b in blok.blocks" :key="b._uid" v-editable="b" class="infos__block">
        <h3 class="infos__title">{{ b.title }}</h3>
        <ul class="infos__lines body-text">
          <li v-for="l in lines(b.lines)" :key="l">{{ l }}</li>
        </ul>
        <p v-if="b.note" class="infos__note">{{ b.note }}</p>
      </OrnFrame>
    </div>
  </section>
</template>

<style scoped>
.infos__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: clamp(1.5rem, 3vw, 3rem);
  margin-top: clamp(2.5rem, 5vw, 4.5rem);
}

.infos__title {
  font-family: var(--font-metal);
  font-weight: 400;
  font-size: clamp(1.8rem, 2.6vw, 2.5rem);
  color: var(--bone);
  margin-bottom: 1rem;
}

.infos__lines {
  list-style: none;
  padding: 0;
}

/* Dotwork bullets. */
.infos__lines li {
  position: relative;
  padding-left: 1.2rem;
  margin-bottom: 0.45rem;
}

.infos__lines li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--bone);
  box-shadow: 0 -7px 0 -1px var(--bone), 0 7px 0 -1px var(--bone);
}

.infos__note {
  margin-top: 1.25rem;
  font-family: var(--font-small);
  font-style: italic;
  color: var(--muted);
}
</style>
