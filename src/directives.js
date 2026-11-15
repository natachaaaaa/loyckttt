import { gsap, splitLetters } from './gsap'

// Scroll-triggered animations as directives, so sections and ornaments share them without boilerplate.
// Each runs only when the visitor hasn't asked for reduced motion; everything is reverted on unmount.
function scrollAnim(build) {
  return {
    mounted(el, binding) {
      el._mm = gsap.matchMedia()
      el._mm.add('(prefers-reduced-motion: no-preference)', () => build(el, binding))
    },
    unmounted(el) {
      el._mm?.revert()
    },
  }
}

// Strokes draw themselves in, filled dots (.dot) pop in after.
export const vDraw = scrollAnim((el) => {
  const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } })
  tl.from(el.querySelectorAll(':is(path, line, circle, ellipse, polyline):not(.dot, .fill)'), {
    drawSVG: 0,
    duration: 1.6,
    stagger: 0.02,
    ease: 'power2.inOut',
  }).from(el.querySelectorAll('.dot'), { scale: 0, transformOrigin: '50% 50%', stagger: 0.03, duration: 0.4 }, '-=0.8')
})

// Title letters rise one by one.
export const vReveal = scrollAnim((el) => {
  gsap.from(splitLetters(el), {
    yPercent: 110,
    opacity: 0,
    stagger: 0.035,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
  })
})

// Direct children fade up in sequence.
export const vStagger = scrollAnim((el) => {
  gsap.from(el.children, {
    y: 40,
    opacity: 0,
    stagger: 0.12,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
  })
})
