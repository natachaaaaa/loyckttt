import { createApp } from 'vue'
import { StoryblokVue, apiPlugin } from '@storyblok/vue'
import './style.css'
import App from './App.vue'
import { vDraw, vReveal, vStagger } from './directives'
import { TOKEN, REGION, loadStory } from './storyblok'
import TheHero from './components/TheHero.vue'
import TagMarquee from './components/TagMarquee.vue'
import AboutSection from './components/AboutSection.vue'
import OrnDivider from './components/ornaments/OrnDivider.vue'
import WorksSection from './components/WorksSection.vue'
import FlashSection from './components/FlashSection.vue'
import ProcessSection from './components/ProcessSection.vue'
import AgendaSection from './components/AgendaSection.vue'
import InfosSection from './components/InfosSection.vue'
import ContactSection from './components/ContactSection.vue'

const app = createApp(App)
  .directive('draw', vDraw)
  .directive('reveal', vReveal)
  .directive('stagger', vStagger)
  .use(StoryblokVue, {
    accessToken: TOKEN,
    // The SDK only loads the visual editor bridge inside the Storyblok editor (URL has _storyblok_tk).
    use: TOKEN ? [apiPlugin] : [],
    apiOptions: { region: REGION },
  })

// Storyblok bloks (technical name -> section). Names match storyblok/components.json.
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
  contact: ContactSection,
}
for (const [name, component] of Object.entries(sections)) app.component(name, component)

await loadStory()
app.mount('#app')
