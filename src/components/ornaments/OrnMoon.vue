<script setup>
import { computed, useId } from 'vue'

// Moon with its lit part in dotwork. phase: 0 new, 0.25 first quarter, 0.5 full, 0.75 last quarter.
const props = defineProps({ phase: { type: Number, required: true } })
const id = useId()
const R = 10

const lit = computed(() => {
  const p = ((props.phase % 1) + 1) % 1
  const rx = (R * Math.abs(Math.cos(2 * Math.PI * p))).toFixed(2)
  // Half disk on the lit side, then back along the terminator (an ellipse arc).
  if (p < 0.5) return `M12 2 A${R} ${R} 0 0 1 12 22 A${rx} ${R} 0 0 ${p < 0.25 ? 0 : 1} 12 2`
  return `M12 2 A${R} ${R} 0 0 0 12 22 A${rx} ${R} 0 0 ${p < 0.75 ? 0 : 1} 12 2`
})
</script>

<template>
  <svg class="moon" viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <pattern :id="id" width="2.2" height="2.2" patternUnits="userSpaceOnUse">
        <circle cx="1.1" cy="1.1" r="0.65" fill="currentColor" />
      </pattern>
    </defs>
    <path class="fill" :d="lit" :fill="`url(#${id})`" />
    <circle cx="12" cy="12" :r="R" fill="none" stroke="currentColor" stroke-width="1" />
  </svg>
</template>

<style scoped>
.moon {
  width: 1em;
  height: 1em;
  flex: none;
}
</style>
