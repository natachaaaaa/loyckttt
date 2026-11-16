<script setup>
import OrnDivider from './ornaments/OrnDivider.vue'
import OrnSigil from './ornaments/OrnSigil.vue'
import { artist, salon, salonAddress, salonPhone, salonMapsUrl } from '../seo'
import { pages, pageUrl } from '../content'

// Footer columns follow the pages' kicker in pages.json: "Style" pages vs. everything else.
const styles = pages.filter((p) => p.kicker === 'Style')
const guides = pages.filter((p) => p.kicker !== 'Style')
// "Tatouage blackwork à Castres" -> "Blackwork à Castres": the column title already says it's a style.
const styleName = (p) => p.h1.replace(/^Tatouage /, '').replace(/^./, (c) => c.toUpperCase())
const year = new Date().getFullYear()

// cta: false on the home page, where the booking form sits right above.
defineProps({ cta: { type: Boolean, default: true } })
</script>

<template>
  <footer class="footer">
    <OrnDivider />

    <div v-if="cta" class="footer__cta">
      <p class="footer__claim">Un projet de tatouage ?</p>
      <a class="footer__btn" href="/#contact">Prendre rendez-vous</a>
    </div>

    <div v-stagger class="footer__grid">
      <div class="footer__col footer__brand">
        <p class="footer__name"><OrnSigil /> {{ artist.name }}</p>
        <p class="footer__text">
          Tatoueur et illustrateur à {{ salon.city }} ({{ salon.department }}). Blackwork, dotwork, biomécanique et
          cybersigilism, à l'encre noire.
        </p>
        <p class="footer__social">
          <a :href="artist.instagram" target="_blank" rel="noopener">Instagram de Loyck</a>
          <a v-if="salon.instagram" :href="salon.instagram" target="_blank" rel="noopener">Instagram du salon</a>
        </p>
      </div>

      <!-- Name, address, phone: identical to the salon's Google listing (business.json). -->
      <div class="footer__col">
        <h2 class="footer__heading">Le salon</h2>
        <address class="footer__text footer__address">
          <strong>{{ salon.name }}</strong><br />
          {{ salonAddress }}<br />
          <a v-if="salonPhone" :href="salonPhone.href">{{ salonPhone.display }}</a>
        </address>
        <p class="footer__text">Sur rendez-vous uniquement.</p>
        <a class="footer__link" :href="salonMapsUrl" target="_blank" rel="noopener">Itinéraire</a>
      </div>

      <!-- Internal links to every content page, on every page. -->
      <nav class="footer__col" aria-labelledby="footer-styles">
        <h2 id="footer-styles" class="footer__heading">Styles</h2>
        <ul class="footer__list">
          <li v-for="p in styles" :key="p.slug">
            <a class="footer__link" :href="pageUrl(p)">{{ styleName(p) }}</a>
          </li>
        </ul>
      </nav>

      <nav class="footer__col" aria-labelledby="footer-guides">
        <h2 id="footer-guides" class="footer__heading">Tatouer avec Loyck</h2>
        <ul class="footer__list">
          <li v-for="p in guides" :key="p.slug">
            <a class="footer__link" :href="pageUrl(p)">{{ p.h1 }}</a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="footer__bottom">
      <p>© {{ year }} {{ artist.name }} · Tatoueur à {{ salon.city }}</p>
      <a class="footer__top" href="#">Retour en haut <span aria-hidden="true">↑</span></a>
      <p class="footer__credit">Site : <span>0x Studios</span></p>
    </div>

    <!-- Closing wordmark, cropped by the bottom edge like the hero logo by the sides. -->
    <p class="footer__wordmark" aria-hidden="true">Loyck</p>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
  padding-top: clamp(2rem, 5vw, 4rem);
  font-family: var(--font-small);
}

/* Call to action */
.footer__cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 0 var(--gutter) clamp(4rem, 8vw, 7rem);
  text-align: center;
}

.footer__claim {
  font-family: var(--font-title);
  font-weight: 700;
  font-variant: small-caps;
  font-size: clamp(2rem, 4.5vw, 4.5rem);
  line-height: 1;
}

.footer__btn {
  font-family: var(--font-metal);
  font-size: clamp(1.4rem, 2.4vw, 2rem);
  text-decoration: none;
  color: var(--ink);
  background: var(--bone);
  padding: 0.3em 0.9em;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
}

.footer__btn:hover,
.footer__btn:focus-visible {
  background: var(--ink);
  color: var(--bone);
  box-shadow: inset 0 0 0 1px var(--bone);
}

/* Columns */
.footer__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: clamp(2rem, 4vw, 4rem);
  max-width: 1920px;
  margin-inline: auto;
  padding: clamp(2.5rem, 5vw, 4rem) var(--gutter);
  border-top: 1px solid #2a2a2a;
}

@media (max-width: 960px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }
}

.footer__heading {
  font-family: var(--font-metal);
  font-weight: 400;
  font-size: 1.35rem;
  letter-spacing: 0.08em;
  color: var(--bone);
  margin-bottom: 1rem;
}

.footer__name {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-family: var(--font-metal);
  font-size: 2rem;
  color: var(--bone);
  margin-bottom: 1rem;
}

.footer__name .sigil {
  font-size: 1.2em;
}

.footer__text {
  font-size: 1rem;
  line-height: 1.65;
  color: var(--muted);
  max-width: 38ch;
}

.footer__address {
  font-style: normal;
  margin-bottom: 0.5rem;
}

.footer__address strong {
  font-weight: 400;
  color: var(--bone);
}

.footer__address a,
.footer__social a {
  color: var(--bone);
  text-underline-offset: 0.2em;
}

.footer__social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin-top: 1.25rem;
}

.footer__list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}

/* Links reveal a dotted underline, like the flash cards' dotted frame. */
.footer__link {
  display: inline-block;
  margin-top: 0.25rem;
  font-family: var(--font-title);
  font-variant: small-caps;
  font-size: 1.05rem;
  color: var(--muted);
  text-decoration: none;
  border-bottom: 1px dotted transparent;
  transition: color 0.3s, border-color 0.3s;
}

.footer__link:hover,
.footer__link:focus-visible {
  color: var(--bone);
  border-bottom-color: var(--bone);
  outline: none;
}

/* Bottom bar */
.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem 2rem;
  max-width: 1920px;
  margin-inline: auto;
  padding: 1.5rem var(--gutter);
  border-top: 1px solid #2a2a2a;
  font-size: 0.95rem;
  color: var(--muted);
}

.footer__top {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.3s;
}

.footer__top:hover,
.footer__top:focus-visible {
  color: var(--bone);
}

.footer__credit span {
  font-family: var(--font-pixel);
  color: var(--bone);
}

.footer__wordmark {
  font-family: var(--font-metal);
  font-size: clamp(6rem, 30vw, 32rem);
  line-height: 0.75;
  text-align: center;
  text-transform: uppercase;
  color: var(--bone);
  opacity: 0.08;
  margin-bottom: -0.12em;
  pointer-events: none;
  user-select: none;
}
</style>
