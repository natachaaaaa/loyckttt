<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap, splitLetters } from '../gsap'
import OrnFrame from './ornaments/OrnFrame.vue'
import { image } from '../storyblok'

const props = defineProps({ blok: Object })
const portrait = computed(() => image(props.blok?.portrait, 700))

const root = ref()
const title = ref()
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top 70%' } })
      tl.from(splitLetters(title.value), {
        yPercent: 110,
        opacity: 0,
        rotate: () => gsap.utils.random(-12, 12),
        stagger: 0.04,
        duration: 0.9,
        ease: 'power3.out',
      })
        .from('.about__portrait', { clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: 'expo.inOut' }, '-=0.5')
        .from('.about__text', { opacity: 0, y: 30, filter: 'blur(6px)', duration: 1.2, ease: 'power2.out' }, '<0.3')
    })
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" v-editable="blok" class="about" aria-labelledby="about-title">
    <!-- key: a title edited in Storyblok re-creates the (letter-split) heading -->
    <h2 id="about-title" :key="blok.title" ref="title" class="section-title">{{ blok.title }}</h2>
    <div class="about__grid">
      <OrnFrame class="about__frame">
        <img
          v-if="portrait"
          class="about__portrait"
          :src="portrait.src"
          :alt="portrait.alt || 'Portrait de Loyck'"
          :width="portrait.w"
          :height="portrait.h"
          loading="lazy"
        />
        <div v-else class="about__portrait" role="img" aria-label="Portrait de Loyck (à venir)"></div>
      </OrnFrame>
      <p class="about__text">{{ blok.text }}</p>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding: clamp(4rem, 10vw, 11rem) var(--gutter) 0;
  max-width: 1920px;
  margin-inline: auto;
}

.about .section-title {
  overflow: hidden;
  padding-bottom: 0.1em;
}

.about__grid {
  display: grid;
  grid-template-columns: minmax(0, 420px) minmax(0, 820px);
  align-items: start;
  justify-content: center;
  gap: clamp(2rem, 8vw, 150px);
  margin-top: clamp(2rem, 5vw, 5.5rem);
}

.about__portrait {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background: var(--placeholder);
}

.about__text {
  font-variant: small-caps;
  font-size: clamp(1.15rem, 1.9vw, 2.25rem);
  line-height: 1.1;
  white-space: pre-line; /* keep the line breaks typed in Storyblok */
}

/* Illuminated initial, in the marquee's metal face. */
.about__text::first-letter {
  float: left;
  font-family: var(--font-metal);
  font-size: 3.6em;
  line-height: 0.8;
  margin: 0.05em 0.12em 0 0;
  color: var(--bone);
}

@media (max-width: 720px) {
  .about__grid {
    grid-template-columns: 1fr;
  }
  .about__frame {
    max-width: 340px;
  }
}
</style>
