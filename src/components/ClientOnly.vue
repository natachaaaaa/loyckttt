<!-- Renders its slot only in the browser: for content that depends on "now" (calendar), which a
     build-time prerender would freeze at the build date. -->
<script setup>
import { onMounted, ref } from 'vue'

const mounted = ref(false)
onMounted(() => (mounted.value = true))
</script>

<template>
  <slot v-if="mounted" />
  <slot v-else name="fallback" />
</template>
