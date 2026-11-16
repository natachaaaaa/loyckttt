// App factory shared by the browser (main.js) and the build-time prerender (entry-server.js).
import { createApp as createClientApp, createSSRApp } from 'vue'
import App from './App.vue'
import { vDraw, vReveal, vStagger } from './directives'
import TheHero from './components/TheHero.vue'
import TagMarquee from './components/TagMarquee.vue'
import AboutSection from './components/AboutSection.vue'
import OrnDivider from './components/ornaments/OrnDivider.vue'
import WorksSection from './components/WorksSection.vue'
import FlashSection from './components/FlashSection.vue'
import ProcessSection from './components/ProcessSection.vue'
import AgendaSection from './components/AgendaSection.vue'
import InfosSection from './components/InfosSection.vue'
import FaqSection from './components/FaqSection.vue'
import ContactSection from './components/ContactSection.vue'
import GuideLinks from './components/GuideLinks.vue'

// Section types: the "component" value of each entry in src/content/home.json.
const sections = {
  hero: TheHero,
  marquee: TagMarquee,
  about: AboutSection,
  divider: OrnDivider,
  works: WorksSection,
  flashes: FlashSection,
  process: ProcessSection,
  agenda: AgendaSection,
  infos: InfosSection,
  faq: FaqSection,
  guides: GuideLinks,
  contact: ContactSection,
}

/** ssr: true when rendering on the server or hydrating prerendered HTML. path: URL path of the page. */
export function createApp(ssr, path) {
  const app = (ssr ? createSSRApp : createClientApp)(App, { path })
    .directive('draw', vDraw)
    .directive('reveal', vReveal)
    .directive('stagger', vStagger)
  for (const [name, component] of Object.entries(sections)) app.component(name, component)
  return app
}
