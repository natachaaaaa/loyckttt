# Graph Report - LOYCK  (2026-11-15)

## Corpus Check
- 35 files · ~324,605 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 1, .conf 1)

## Summary
- 186 nodes · 290 edges · 9 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- App.vue
- package.json
- split-logo.mjs
- vue
- BookingWidget.vue
- Prise de rendez-vous
- OrnDivider.vue
- WorksSection.vue
- storyblok-setup.mjs

## God Nodes (most connected - your core abstractions)
1. `vue` - 13 edges
2. `dayStatus()` - 8 edges
3. `image()` - 7 edges
4. `scripts` - 6 edges
5. `api()` - 6 edges
6. `slotsFor()` - 6 edges
7. `prepare()` - 5 edges
8. `todayYmd()` - 5 edges
9. `demoBusy()` - 5 edges
10. `splitLetters()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `slots` --calls--> `slotsFor()`  [EXTRACTED]
  src/components/BookingWidget.vue → src/booking.js
- `portrait` --calls--> `image()`  [EXTRACTED]
  src/components/AboutSection.vue → src/storyblok.js
- `flashes` --calls--> `image()`  [EXTRACTED]
  src/components/FlashSection.vue → src/storyblok.js
- `works` --calls--> `image()`  [EXTRACTED]
  src/components/WorksSection.vue → src/storyblok.js
- `days` --calls--> `dayStatus()`  [EXTRACTED]
  src/components/BookingWidget.vue → src/booking.js

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "App.vue"
Cohesion: 0.15
Nodes (8): CONTACT_EMAIL, portrait, props, root, title, flashes, props, image()

### Community 1 - "package.json"
Cohesion: 0.09
Nodes (21): dependencies, gsap, @storyblok/vue, vue, devDependencies, vite, @vitejs/plugin-basic-ssl, @vitejs/plugin-vue (+13 more)

### Community 2 - "split-logo.mjs"
Cohesion: 0.20
Nodes (5): dropArg, letters, [maskD, lettersD, rootsD], src, vb

### Community 3 - "vue"
Cohesion: 0.09
Nodes (19): gsap, @storyblok/vue, props, root, tags, root, vDraw, vReveal (+11 more)

### Community 4 - "BookingWidget.vue"
Cohesion: 0.07
Nodes (39): allDay, busy, edge, grid, now, addDays(), addMonthsYmd(), CONFIG (+31 more)

### Community 6 - "Prise de rendez-vous"
Cohesion: 0.22
Nodes (8): Au quotidien, Au quotidien, Contenu : Storyblok, Lancer, Loyck — site, Mise en place (une fois), Mise en place (une fois, gratuit), Prise de rendez-vous

### Community 7 - "OrnDivider.vue"
Cohesion: 0.50
Nodes (3): lashes, left, lid()

### Community 8 - "WorksSection.vue"
Cohesion: 0.10
Nodes (21): vue, events, props, STATUS, today, id, lit, props (+13 more)

### Community 9 - "storyblok-setup.mjs"
Cohesion: 0.22
Nodes (10): api(), HOSTS, prepare(), RESET, root, setPreviewUrl(), sleep(), syncComponents() (+2 more)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vue` connect `WorksSection.vue` to `App.vue`, `package.json`, `vue`, `BookingWidget.vue`?**
  _High betweenness centrality (0.505) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09486166007905138 - nodes in this community are weakly interconnected._
- **Should `vue` be split into smaller, more focused modules?**
  _Cohesion score 0.08907563025210084 - nodes in this community are weakly interconnected._
- **Should `BookingWidget.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.07149758454106281 - nodes in this community are weakly interconnected._
- **Should `WorksSection.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.09971509971509972 - nodes in this community are weakly interconnected._