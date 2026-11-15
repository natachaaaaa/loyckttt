# Graph Report - LOYCK  (2026-11-15)

## Corpus Check
- 41 files · ~337,883 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 1, .conf 1)

## Summary
- 194 nodes · 295 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fb2789b3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- WorksSection.vue
- package.json
- split-logo.mjs
- vue
- BookingWidget.vue
- seo.js
- Prise de rendez-vous
- OrnDivider.vue
- WorksSection.vue
- ContactSection.vue
- AppKit

## God Nodes (most connected - your core abstractions)
1. `vue` - 13 edges
2. `dayStatus()` - 8 edges
3. `image()` - 7 edges
4. `slotsFor()` - 6 edges
5. `todayYmd()` - 5 edges
6. `demoBusy()` - 5 edges
7. `splitLetters()` - 5 edges
8. `Loyck — site (version statique)` - 5 edges
9. `scripts` - 4 edges
10. `createApp()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `portrait` --calls--> `image()`  [EXTRACTED]
  src/components/AboutSection.vue → src/content.js
- `slots` --calls--> `slotsFor()`  [EXTRACTED]
  src/components/BookingWidget.vue → src/booking.js
- `flashes` --calls--> `image()`  [EXTRACTED]
  src/components/FlashSection.vue → src/content.js
- `render()` --calls--> `createApp()`  [EXTRACTED]
  src/entry-server.js → src/app.js
- `days` --calls--> `dayStatus()`  [EXTRACTED]
  src/components/BookingWidget.vue → src/booking.js

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "WorksSection.vue"
Cohesion: 0.15
Nodes (11): flashes, props, columns, open, props, root, title, works (+3 more)

### Community 1 - "package.json"
Cohesion: 0.11
Nodes (17): dependencies, gsap, vue, devDependencies, vite, @vitejs/plugin-vue, name, private (+9 more)

### Community 2 - "split-logo.mjs"
Cohesion: 0.11
Nodes (11): business, dist, html, site, ssrDir, today, dropArg, letters (+3 more)

### Community 3 - "vue"
Cohesion: 0.11
Nodes (13): sections, portrait, props, root, title, props, root, tags (+5 more)

### Community 4 - "BookingWidget.vue"
Cohesion: 0.07
Nodes (39): allDay, busy, edge, grid, now, addDays(), addMonthsYmd(), CONFIG (+31 more)

### Community 5 - "seo.js"
Cohesion: 0.13
Nodes (11): createApp(), render(), root, clean(), esc(), faq, headTags(), jsonLd() (+3 more)

### Community 6 - "Prise de rendez-vous"
Cohesion: 0.17
Nodes (11): Au quotidien, Ce que fait le site, Contenu, Hors du site : ce qui pèse le plus pour la 1re place, Lancer, Logo, Loyck — site (version statique), Mise en place (une fois, gratuit) (+3 more)

### Community 7 - "OrnDivider.vue"
Cohesion: 0.50
Nodes (3): lashes, left, lid()

### Community 8 - "WorksSection.vue"
Cohesion: 0.12
Nodes (15): vue, events, props, STATUS, today, mounted, id, lit (+7 more)

## Knowledge Gaps
- **1 isolated node(s):** `AppKit`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 103 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vue` connect `WorksSection.vue` to `WorksSection.vue`, `package.json`, `vue`, `BookingWidget.vue`, `seo.js`?**
  _High betweenness centrality (0.351) - this node is a cross-community bridge._
- **What connects `AppKit` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WorksSection.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `split-logo.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `vue` be split into smaller, more focused modules?**
  _Cohesion score 0.11384615384615385 - nodes in this community are weakly interconnected._
- **Should `BookingWidget.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.07149758454106281 - nodes in this community are weakly interconnected._