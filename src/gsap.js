import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin)

export { gsap, ScrollTrigger }

// Splits an element's text into letter spans so titles can be animated letter by letter.
export function splitLetters(el) {
  const text = el.textContent
  el.setAttribute('aria-label', text)
  // Letters are grouped per word so a title only wraps between words.
  el.innerHTML = text
    .split(' ')
    .map(
      (word) =>
        `<span aria-hidden="true" style="display:inline-block;white-space:nowrap">${[...word]
          .map((c) => `<span class="ch" style="display:inline-block">${c}</span>`)
          .join('')}</span>`,
    )
    .join(' ')
  return el.querySelectorAll('.ch')
}
