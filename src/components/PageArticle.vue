<script setup>
import SectionHead from './SectionHead.vue'
import WorksSection from './WorksSection.vue'
import FlashSection from './FlashSection.vue'
import FaqSection from './FaqSection.vue'
import GuideLinks from './GuideLinks.vue'
import OrnDivider from './ornaments/OrnDivider.vue'
import OrnSigil from './ornaments/OrnSigil.vue'
import { homeSection, worksByFile } from '../content'
import { salon, salonAddress, salonPhone, salonMapsUrl } from '../seo'

// One content page of src/content/pages.json. Gallery, flashes and FAQ reuse the home sections.
const props = defineProps({ page: { type: Object, required: true } })
const p = props.page
const flashes = homeSection('flashes')
const faq = p.faq?.length && {
  kicker: 'Questions',
  title: 'Questions fréquentes',
  items: p.faq.map((q, i) => ({ ...q, _uid: `${p.slug}-q${i}` })),
}
</script>

<template>
  <article class="page">
    <header class="section page__head">
      <nav class="crumbs" aria-label="Fil d'Ariane">
        <a href="/">Accueil</a>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{{ p.h1 }}</span>
      </nav>
      <p class="page__kicker"><OrnSigil /> {{ p.kicker }}</p>
      <h1 v-reveal class="section-title page__title">{{ p.h1 }}</h1>
      <p class="body-text page__intro">{{ p.intro }}</p>
    </header>

    <OrnDivider />

    <template v-for="(s, i) in p.sections" :key="i">
      <WorksSection
        v-if="s.works"
        :blok="{ title: s.heading, subtitle: s.paragraphs?.[0], items: worksByFile(s.works) }"
      />
      <FlashSection
        v-else-if="s.flashes && flashes"
        :blok="{ ...flashes, kicker: '', title: s.heading, intro: s.paragraphs?.[0] }"
      />
      <section v-else class="section page__block">
        <SectionHead :title="s.heading" />
        <div v-stagger class="page__body">
          <p v-for="(text, j) in s.paragraphs" :key="j" class="body-text">{{ text }}</p>
          <ul v-if="s.list" class="page__list body-text">
            <li v-for="item in s.list" :key="item">{{ item }}</li>
          </ul>
          <address v-if="s.salon" class="body-text page__salon">
            <strong>{{ salon.name }}</strong><br />
            {{ salonAddress }}<br />
            <a v-if="salonPhone" :href="salonPhone.href">{{ salonPhone.display }}</a>
            <template v-if="salonPhone"> · </template>
            <a :href="salonMapsUrl" target="_blank" rel="noopener">Itinéraire</a>
          </address>
        </div>
      </section>
    </template>

    <FaqSection v-if="faq" :blok="faq" />


    <GuideLinks v-if="p.related?.length" :blok="{ title: 'À lire aussi', slugs: p.related }" />
  </article>
</template>

<style scoped>
.page__head {
  padding-top: clamp(6rem, 12vw, 10rem);
}

.crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-family: var(--font-small);
  font-size: 0.95rem;
  color: var(--muted);
  margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
}

.crumbs a {
  color: var(--bone);
  text-underline-offset: 0.2em;
}

.page__kicker {
  display: flex;
  align-items: center;
  gap: 0.6em;
  font-family: var(--font-metal);
  font-size: clamp(1.1rem, 1.5vw, 1.5rem);
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 0.6rem;
}

.page__kicker .sigil {
  font-size: 1.6em;
  color: var(--bone);
}

.page__title {
  overflow: hidden;
  padding-bottom: 0.1em;
}

.page__intro {
  max-width: 62ch;
  margin-top: 1.5rem;
  font-size: clamp(1.15rem, 1.6vw, 1.6rem);
}

.page__body {
  max-width: 70ch;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
  display: grid;
  gap: 1rem;
}

/* Long reading: Cinzel has no lowercase, so body copy switches to the site's serif in normal case. */
.page__body .body-text {
  font-family: var(--font-small);
  font-variant: normal;
  font-size: clamp(1.05rem, 1.25vw, 1.25rem);
  line-height: 1.7;
  color: #c9c4bc;
}

/* Dotwork bullets, as in the practical infos. */
.page__list {
  list-style: none;
  padding: 0;
}

.page__list li {
  position: relative;
  padding-left: 1.2rem;
  margin-bottom: 0.45rem;
}

.page__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--bone);
  box-shadow: 0 -7px 0 -1px var(--bone), 0 7px 0 -1px var(--bone);
}

.page__salon {
  font-style: normal;
}

.page__salon strong {
  font-weight: 400;
  color: var(--bone);
}

.page__salon a {
  color: var(--bone);
  text-underline-offset: 0.2em;
}
</style>
