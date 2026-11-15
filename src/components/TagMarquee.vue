<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap, ScrollTrigger } from '../gsap'

const props = defineProps({ blok: Object })
// "tags" in home.json: comma-separated words.
const tags = computed(() => (props.blok?.tags || '').split(',').map((t) => t.trim()).filter(Boolean))

const root = ref()
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Track holds the list twice, so sliding by -50% loops seamlessly.
      const loop = gsap.to('.marquee__track', { xPercent: -50, duration: 30, ease: 'none', repeat: -1 })

      // Scrolling speeds the band up (and reverses it when scrolling up), then it settles back.
      ScrollTrigger.create({
        onUpdate(self) {
          const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 300)
          gsap.timeline()
            .to(loop, { timeScale: boost || 1, duration: 0.2, overwrite: true })
            .to(loop, { timeScale: self.direction, duration: 1.2 })
        },
      })
    })
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <div ref="root" class="marquee" :aria-label="tags.join(', ')">
    <div class="marquee__track" aria-hidden="true">
      <span v-for="(tag, i) in [...tags, ...tags]" :key="i">{{ tag }}</span>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  padding-block: 0.5rem;
}

.marquee__track {
  display: flex;
  width: max-content;
  font-family: var(--font-metal);
  font-size: clamp(2.25rem, 4.5vw, 5.25rem);
  line-height: 1;
  text-transform: uppercase;
  color: var(--white);
}

.marquee__track span {
  padding-right: 0.6em;
}
</style>
