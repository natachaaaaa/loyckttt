<script setup>
import OrnSigil from './ornaments/OrnSigil.vue'

defineProps({ title: { type: String, default: '' }, kicker: String, id: String })
</script>

<template>
  <div class="head">
    <p v-if="kicker" class="head__kicker"><OrnSigil /> {{ kicker }}</p>
    <!-- key: a changed title re-creates the (letter-split) heading -->
    <h2 :id="id" :key="title" v-reveal class="section-title head__title">{{ title }}</h2>
  </div>
</template>

<style scoped>
.head__kicker {
  display: flex;
  align-items: center;
  gap: 0.6em;
  font-family: var(--font-metal);
  font-size: clamp(1.1rem, 1.5vw, 1.5rem);
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 0.6rem;
}

.head__kicker .sigil {
  font-size: 1.6em;
  color: var(--bone);
}

.head__title {
  overflow: hidden;
  padding-bottom: 0.1em;
}
</style>
