<!-- One thorned corner (top-left; mirror it with CSS transforms).
     hover: strokes are normalized (pathLength=1) and hidden; the parent draws them by setting
     stroke-dashoffset: 0 on .corner--hover path (and opacity: 1 on .dot). -->
<script setup>
defineProps({ hover: Boolean })
</script>

<template>
  <svg
    class="corner"
    :class="{ 'corner--hover': hover }"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M2 62 V10 Q2 2 10 2 H62" stroke-width="1.4" :pathLength="hover ? 1 : undefined" />
    <path
      d="M2 26 L-5 20 L2 21 M2 44 L-5 38 L2 39 M26 2 L20 -5 L21 2 M44 2 L38 -5 L39 2"
      stroke-width="1"
      :pathLength="hover ? 1 : undefined"
    />
    <path d="M10 2 C22 4 24 16 15 16 C10 16 10 10 14 10" stroke-width="1" :pathLength="hover ? 1 : undefined" />
    <circle class="dot" cx="2" cy="62" r="1.8" fill="currentColor" stroke="none" />
    <circle class="dot" cx="62" cy="2" r="1.8" fill="currentColor" stroke="none" />
  </svg>
</template>

<style scoped>
.corner {
  overflow: visible;
}

.corner--hover path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 0.7s cubic-bezier(0.6, 0, 0.2, 1);
}

.corner--hover .dot {
  opacity: 0;
  transition: opacity 0.3s 0.4s;
}
</style>
