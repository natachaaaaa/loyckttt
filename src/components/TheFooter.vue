<script setup>
import { artist, salon, salonAddress, salonPhone } from '../seo'
import { pages, pageUrl } from '../content'
</script>

<template>
  <footer class="footer">
    <!-- Name, address, phone: identical to the salon's Google listing (business.json). -->
    <address class="footer__nap">
      {{ artist.name }}, tatoueur à {{ salon.city }} · {{ salon.name }}<br />
      {{ salonAddress }}<template v-if="salonPhone"> · <a :href="salonPhone.href">{{ salonPhone.display }}</a></template>
    </address>
    <!-- Internal links to every content page, on every page. -->
    <nav class="footer__pages" aria-label="Styles et conseils">
      <a href="/">Accueil</a>
      <a v-for="p in pages" :key="p.slug" :href="pageUrl(p)">{{ p.h1 }}</a>
    </nav>
    <p class="footer__logo">0x<span>Studios</span></p>
    <p>Copyright 0xStudio, 2019-{{ new Date().getFullYear() }}</p>
    <p class="footer__links"><a href="#">CGU</a> - <a href="#">Legal Notice</a></p>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 2px solid #bdbdbd;
  padding: 2.5rem 1rem 3rem;
  text-align: center;
  font-family: var(--font-small);
  font-size: 1.05rem;
}

.footer__nap {
  font-style: normal;
  color: var(--muted);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.footer__nap a {
  color: var(--bone);
}

.footer__pages {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.5rem;
  max-width: 1000px;
  margin: 0 auto 2.5rem;
  font-family: var(--font-title);
  font-variant: small-caps;
  font-size: 1rem;
}

.footer__pages a {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.3s;
}

.footer__pages a:hover,
.footer__pages a:focus-visible {
  color: var(--bone);
}

.footer__logo {
  font-family: var(--font-pixel);
  font-size: 2.6rem;
  line-height: 0.85;
  margin-bottom: 0.9rem;
}

.footer__logo span {
  display: block;
  font-size: 1.15rem;
  line-height: 1;
}

.footer__links {
  color: var(--muted);
}
</style>
