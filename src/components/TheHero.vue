<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap } from '../gsap'
// Letters: inline SVG from scripts/split-logo.mjs. Roots: the same artwork rasterized to WebP on black
// (scripts/render-logo.swift), 3x lighter than the SVG; it sits under the letters, same box.
import letters from '../assets/logo-letters.svg?raw'
import roots1216 from '../assets/logo-roots-1216.webp'
import roots2432 from '../assets/logo-roots-2432.webp'

defineProps({ blok: Object })

const root = ref()
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap
        .timeline()
        // fromTo: the start state is already set by CSS (html.js, style.css) to avoid a flash of the
        // prerendered logo before the intro starts.
        .fromTo('.logo__letter', { opacity: 0, y: 20 }, {
          opacity: 1,
          y: 0,
          duration: 1.4,
          stagger: { each: 0.08, from: 'random' },
          ease: 'power2.out',
        })
        // Roots sprout from the letters outward: a band centered on the letters opens up and down.
        .fromTo('.hero__roots', { '--reveal': '0%' }, { '--reveal': '60%', duration: 2.6, ease: 'power2.out' }, 0.5)

      gsap.to('.hero__inner', {
        yPercent: 25,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
      })
    })
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <header ref="root" class="hero">
    <h1 class="hero__inner">
      <span class="sr-only">Loyck, </span>
      <span class="hero__art">
        <span class="hero__letters" v-html="letters"></span>
        <img
          class="hero__roots"
          :src="roots2432"
          :srcset="`${roots1216} 1216w, ${roots2432} 2432w`"
          sizes="110vw"
          width="2432"
          height="1071"
          alt=""
          fetchpriority="high"
        />
      </span>
      <span class="hero__place">Tatoueur à Castres</span>
    </h1>
  </header>
</template>

<style scoped>
.hero {
  overflow: hidden;
}

/* Mockup scale: the lockup is wider than the viewport and cropped by the edges. */
.hero__art {
  position: relative;
  display: block;
  width: 110vw;
  margin: -5.4vw 0 0 -5vw;
  color: var(--bone);
}

/* Letters above the roots bitmap (which has a black background). */
.hero__letters {
  position: relative;
  z-index: 1;
  display: block;
}

.hero__letters :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}

.hero__roots {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  /* --mid: letters' centerline (printed by split-logo.mjs). --reveal: half-height of the visible band. */
  --mid: 51.6%;
  --reveal: 60%;
  --edge: 6%;
  mask-image: linear-gradient(
    to bottom,
    transparent calc(var(--mid) - var(--reveal) - var(--edge)),
    #000 calc(var(--mid) - var(--reveal)),
    #000 calc(var(--mid) + var(--reveal)),
    transparent calc(var(--mid) + var(--reveal) + var(--edge))
  );
}

/* Visible part of the h1: says what and where, for visitors and search engines alike. */
.hero__place {
  display: block;
  margin-top: clamp(0.5rem, 1.5vw, 1.25rem);
  text-align: center;
  font-family: var(--font-title);
  font-variant: small-caps;
  font-size: clamp(1rem, 1.6vw, 1.5rem);
  letter-spacing: 0.35em;
  color: var(--muted);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
