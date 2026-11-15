# Graph Report - LOYCK  (2026-11-15)

## Corpus Check
- 33 files · ~322,718 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 1, .conf 1)

## Summary
- 159 nodes · 241 edges · 12 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `07aed95e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.vue
- package.json
- split-logo.mjs
- vue
- BookingWidget.vue
- booking.js
- Prise de rendez-vous
- OrnDivider.vue
- WorksSection.vue
- check-booking.mjs
- WorkLightbox.vue
- sendRequest

## God Nodes (most connected - your core abstractions)
1. `vue` - 11 edges
2. `dayStatus()` - 8 edges
3. `image()` - 7 edges
4. `slotsFor()` - 6 edges
5. `todayYmd()` - 5 edges
6. `demoBusy()` - 5 edges
7. `splitLetters()` - 5 edges
8. `scripts` - 4 edges
9. `parisDate()` - 4 edges
10. `monthGrid()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `slots` --calls--> `slotsFor()`  [EXTRACTED]
  src/components/BookingWidget.vue → src/booking.js
- `days` --calls--> `dayStatus()`  [EXTRACTED]
  src/components/BookingWidget.vue → src/booking.js
- `portrait` --calls--> `image()`  [EXTRACTED]
  src/components/AboutSection.vue → src/content.js
- `flashes` --calls--> `image()`  [EXTRACTED]
  src/components/FlashSection.vue → src/content.js
- `works` --calls--> `image()`  [EXTRACTED]
  src/components/WorksSection.vue → src/content.js

## Import Cycles
- None detected.

## Communities (12 total, 0 thin omitted)

### Community 0 - "App.vue"
Cohesion: 0.13
Nodes (9): CONTACT_EMAIL, portrait, props, root, title, flashes, props, image() (+1 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (16): dependencies, gsap, vue, devDependencies, vite, @vitejs/plugin-vue, name, private (+8 more)

### Community 2 - "split-logo.mjs"
Cohesion: 0.18
Nodes (5): dropArg, letters, [maskD, lettersD, rootsD], src, vb

### Community 3 - "vue"
Cohesion: 0.12
Nodes (11): gsap, props, root, tags, root, vDraw, vReveal, vStagger (+3 more)

### Community 4 - "BookingWidget.vue"
Cohesion: 0.10
Nodes (17): busy, calendarError, canNext, canPrev, cursor, day, form, lastMonth (+9 more)

### Community 5 - "booking.js"
Cohesion: 0.27
Nodes (12): addDays(), addMonthsYmd(), CONFIG, dayStatus(), demoBusy(), fetchBusy(), FIELDS, parisDate() (+4 more)

### Community 6 - "Prise de rendez-vous"
Cohesion: 0.29
Nodes (6): Au quotidien, Contenu, Lancer, Loyck — site (version statique), Mise en place (une fois, gratuit), Prise de rendez-vous

### Community 7 - "OrnDivider.vue"
Cohesion: 0.50
Nodes (3): lashes, left, lid()

### Community 8 - "WorksSection.vue"
Cohesion: 0.13
Nodes (16): vue, events, props, STATUS, today, id, lit, props (+8 more)

### Community 9 - "check-booking.mjs"
Cohesion: 0.22
Nodes (7): allDay, busy, edge, grid, now, monthGrid(), days

### Community 10 - "WorkLightbox.vue"
Cohesion: 0.40
Nodes (5): dialog, index, onKey(), props, step()

### Community 11 - "sendRequest"
Cohesion: 0.67
Nodes (3): formatSlot(), sendRequest(), submit()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vue` connect `WorksSection.vue` to `App.vue`, `package.json`, `vue`, `BookingWidget.vue`, `WorkLightbox.vue`?**
  _High betweenness centrality (0.409) - this node is a cross-community bridge._
- **Should `App.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.12554112554112554 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `vue` be split into smaller, more focused modules?**
  _Cohesion score 0.1225296442687747 - nodes in this community are weakly interconnected._
- **Should `BookingWidget.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `WorksSection.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._