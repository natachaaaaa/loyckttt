<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap, splitLetters } from '../gsap'
import OrnCorner from './ornaments/OrnCorner.vue'
import WorkLightbox from './WorkLightbox.vue'
import { image } from '../content'
import { roman } from '../utils'

const props = defineProps({ blok: Object })

const works = computed(() =>
  (props.blok?.items || [])
    .map((it) => ({ blok: it, uid: it._uid, year: it.year, img: image(it.image, 1000), full: image(it.image, 1800) }))
    .filter((w) => w.img)
    .map((w, i) => ({ ...w, i, n: roman(i + 1) })),
)
// Three staggered columns, filled left to right.
const columns = computed(() => [0, 1, 2].map((c) => works.value.filter((w) => w.i % 3 === c)))
const open = ref(null)

const root = ref()
const title = ref()
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(splitLetters(title.value), {
        yPercent: 110,
        opacity: 0,
        stagger: 0.04,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: title.value, start: 'top 80%' },
      })

      // Each piece is unveiled from the bottom, the photo settling from a slight zoom.
      gsap.utils.toArray('.work').forEach((el) => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } })
          .from(el.querySelector('.work__img'), { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'expo.inOut' })
          .from(el.querySelector('img'), { scale: 1.3, duration: 1.6, ease: 'expo.out' }, 0.2)
          .from(el.querySelectorAll('.work__n, .work__year'), { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 }, 0.7)
      })
    })

    // Desktop: columns drift at different speeds while scrolling.
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const scrub = { trigger: '.works__cols', start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.fromTo('.works__col:nth-child(2)', { y: 140 }, { y: -140, ease: 'none', scrollTrigger: scrub })
      gsap.fromTo('.works__col:nth-child(3)', { y: 50 }, { y: -50, ease: 'none', scrollTrigger: { ...scrub } })
    })
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="works" aria-labelledby="works-title">
    <h2 id="works-title" :key="blok.title" ref="title" class="section-title works__title">{{ blok.title }}</h2>
    <div class="works__cols">
      <div v-for="(col, c) in columns" :key="c" class="works__col">
        <button
          v-for="w in col"
          :key="w.uid"
         
          class="work"
          :class="{ 'is-odd': w.i % 2 }"
          :style="{ order: w.i }"
          :aria-label="`Voir le tatouage ${w.n}, ${w.year}`"
          @click="open = w.i"
        >
          <span class="work__frame">
            <OrnCorner v-for="k in ['tl', 'tr', 'bl', 'br']" :key="k" hover :class="['work__corner', k]" />
            <span class="work__img">
              <img :src="w.img.src" :alt="w.img.alt" :width="w.img.w" :height="w.img.h" loading="lazy" decoding="async" />
            </span>
          </span>
          <span class="work__n" aria-hidden="true">{{ w.n }}</span>
          <span class="work__year">{{ w.year }}</span>
        </button>
      </div>
    </div>
    <WorkLightbox v-model="open" :works="works" />
  </section>
</template>

<style scoped>
.works {
  padding: clamp(4rem, 8vw, 9rem) var(--gutter) 0;
  max-width: 1920px;
  margin-inline: auto;
}

.works__title {
  overflow: hidden;
  padding-bottom: 0.1em;
  /* Mockup centers this title slightly left of the page middle. */
  margin-left: clamp(0px, 22vw, 470px);
}

.works__cols {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
  gap: clamp(2rem, 4vw, 5rem);
  margin-top: clamp(3rem, 6vw, 6rem);
}

.works__col {
  display: flex;
  flex-direction: column;
  gap: clamp(3.5rem, 7vw, 7rem);
}

/* Staggered start: the middle column sits lower, the right one a little. */
.works__col:nth-child(2) {
  padding-top: clamp(5rem, 13vw, 13rem);
}

.works__col:nth-child(3) {
  padding-top: clamp(2rem, 5vw, 5rem);
}

/* Card */
.work {
  position: relative;
  display: block;
  width: 100%;
  padding: 0 1.75rem 0 0; /* room for the vertical year */
  border: 0;
  background: none;
  color: inherit;
  text-align: left;
  cursor: zoom-in;
}

.work:focus-visible {
  outline: 1px solid var(--bone);
  outline-offset: 6px;
}

/* Passe-partout: the thorned corners draw in the margin around the photo. */
.work__frame {
  position: relative;
  display: block;
  padding: clamp(10px, 1.1vw, 16px);
}

.work__corner {
  position: absolute;
  width: clamp(34px, 3.2vw, 48px);
  height: auto;
  color: var(--bone);
}

.tl { top: 0; left: 0; }
.tr { top: 0; right: 0; transform: scaleX(-1); }
.bl { bottom: 0; left: 0; transform: scaleY(-1); }
.br { bottom: 0; right: 0; transform: scale(-1); }

.work__img {
  position: relative;
  display: block;
  overflow: hidden;
  background: #111;
}

.work__img img {
  width: 100%;
  height: auto;
  filter: grayscale(1) contrast(1.15) brightness(0.85);
  /* Hover uses the `scale` property: GSAP's reveal owns `transform`, the two compose. */
  transition: filter 0.7s, scale 1s cubic-bezier(0.2, 0.7, 0.2, 1);
}

/* Dark vignette that lifts on hover. */
.work__img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 50%, rgb(0 0 0 / 0.55));
  transition: opacity 0.7s;
  pointer-events: none;
}

/* Numeral overlapping the bottom-left edge. */
.work__n {
  position: absolute;
  left: -0.1em;
  bottom: -0.45em;
  z-index: 1;
  font-family: var(--font-metal);
  font-size: clamp(2.6rem, 4.2vw, 4.4rem);
  line-height: 1;
  color: var(--bone);
  text-shadow: 0 0 18px #000, 0 0 4px #000;
  transition: translate 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}

/* Year running down the right side. */
.work__year {
  position: absolute;
  top: clamp(10px, 1.1vw, 16px);
  right: 0;
  writing-mode: vertical-rl;
  font-family: var(--font-small);
  font-size: 0.95rem;
  letter-spacing: 0.3em;
  color: var(--muted);
  transition: color 0.4s;
}

.work:is(:hover, :focus-visible) :deep(.corner--hover path) {
  stroke-dashoffset: 0;
}

.work:is(:hover, :focus-visible) :deep(.corner--hover .dot) {
  opacity: 1;
}

.work:is(:hover, :focus-visible) .work__img img {
  filter: grayscale(0) contrast(1) brightness(1);
  scale: 1.04;
}

.work:is(:hover, :focus-visible) .work__img::after {
  opacity: 0;
}

.work:is(:hover, :focus-visible) .work__n {
  translate: 0 -6px;
}

.work:is(:hover, :focus-visible) .work__year {
  color: var(--bone);
}

/* Mobile: one column, pieces alternating left and right. */
@media (max-width: 720px) {
  .works__cols {
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }

  .works__col {
    display: contents;
  }

  .works__col:nth-child(n) {
    padding-top: 0;
  }

  .work {
    width: 86%;
  }

  .work.is-odd {
    margin-left: auto;
  }
}
</style>
