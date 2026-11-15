<script setup>
import SectionHead from './SectionHead.vue'
import OrnFrame from './ornaments/OrnFrame.vue'
import BookingWidget from './BookingWidget.vue'
import { CONTACT_EMAIL } from '../booking'

defineProps({ blok: Object })
</script>

<template>
  <section id="contact" class="section contact" aria-labelledby="contact-title">
    <OrnFrame class="contact__frame">
      <SectionHead id="contact-title" :kicker="blok.kicker" :title="blok.title" />
      <p v-if="blok.text" class="body-text contact__text">{{ blok.text }}</p>
      <BookingWidget :email="blok.email || CONTACT_EMAIL" />
      <p class="contact__alt">
        Autre question ?
        <a :href="`mailto:${blok.email || CONTACT_EMAIL}`">{{ blok.email || CONTACT_EMAIL }}</a>
        <template v-if="blok.instagram">
          · <a :href="blok.instagram" target="_blank" rel="noopener">Instagram</a>
        </template>
      </p>
    </OrnFrame>
  </section>
</template>

<style scoped>
.contact {
  padding-bottom: clamp(4rem, 10vw, 10rem);
}

.contact__frame {
  max-width: 1200px;
  margin-inline: auto;
  padding: clamp(1.25rem, 6vw, 5rem);
}

.contact__text {
  max-width: 44ch;
  margin-top: 1.5rem;
  color: var(--muted);
}

.contact__alt {
  margin-top: clamp(2.5rem, 5vw, 4rem);
  font-family: var(--font-small);
  color: var(--muted);
}

.contact__alt a {
  color: var(--bone);
  text-underline-offset: 0.25em;
}
</style>
