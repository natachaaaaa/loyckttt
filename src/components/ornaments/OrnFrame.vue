<!-- Wraps content with four thorned corners that draw themselves in on scroll. -->
<script setup>
import OrnCorner from './OrnCorner.vue'
</script>

<template>
  <div v-draw class="frame">
    <OrnCorner v-for="c in ['tl', 'tr', 'bl', 'br']" :key="c" :class="['frame__corner', c]" />
    <slot />
  </div>
</template>

<style scoped>
.frame {
  position: relative;
  padding: clamp(1.75rem, 3vw, 2.75rem);
}

.frame__corner {
  position: absolute;
  width: clamp(36px, 4vw, 56px);
  height: auto;
  color: var(--bone);
}

.tl { top: 0; left: 0; }
.tr { top: 0; right: 0; transform: scaleX(-1); }
.bl { bottom: 0; left: 0; transform: scaleY(-1); }
.br { bottom: 0; right: 0; transform: scale(-1); }
</style>
