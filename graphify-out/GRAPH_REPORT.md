# Graph Report - LOYCK  (2026-11-16)

## Corpus Check
- 45 files · ~342,893 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 1, .conf 1)

## Summary
- 220 nodes · 357 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `153cdbb7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PageArticle.vue
- package.json
- split-logo.mjs
- vue
- BookingWidget.vue
- seo.js
- Prise de rendez-vous
- OrnDivider.vue
- WorksSection.vue
- check-pages.mjs
- AppKit
- WorkLightbox.vue

## God Nodes (most connected - your core abstractions)
1. `vue` - 14 edges
2. `dayStatus()` - 8 edges
3. `image()` - 7 edges
4. `slotsFor()` - 6 edges
5. `todayYmd()` - 5 edges
6. `demoBusy()` - 5 edges
7. `splitLetters()` - 5 edges
8. `pageMeta()` - 5 edges
9. `jsonLd()` - 5 edges
10. `headTags()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `portrait` --calls--> `image()`  [EXTRACTED]
  src/components/AboutSection.vue → src/content.js
- `slots` --calls--> `slotsFor()`  [EXTRACTED]
  src/components/BookingWidget.vue → src/booking.js
- `flashes` --calls--> `image()`  [EXTRACTED]
  src/components/FlashSection.vue → src/content.js
- `works` --calls--> `image()`  [EXTRACTED]
  src/components/WorksSection.vue → src/content.js
- `render()` --calls--> `createApp()`  [EXTRACTED]
  src/entry-server.js → src/app.js

## Import Cycles
- 1-file cycle: `src/content.js -> src/content.js`

## Communities (12 total, 1 thin omitted)

### Community 0 - "PageArticle.vue"
Cohesion: 0.11
Nodes (16): page, props, flashes, props, list, props, flashes, props (+8 more)

### Community 1 - "package.json"
Cohesion: 0.11
Nodes (17): dependencies, gsap, vue, devDependencies, vite, @vitejs/plugin-vue, name, private (+9 more)

### Community 2 - "split-logo.mjs"
Cohesion: 0.20
Nodes (5): dropArg, letters, [maskD, lettersD, rootsD], src, vb

### Community 3 - "vue"
Cohesion: 0.11
Nodes (15): vue, sections, portrait, props, root, title, mounted, props (+7 more)

### Community 4 - "BookingWidget.vue"
Cohesion: 0.07
Nodes (40): allDay, busy, edge, grid, now, addDays(), addMonthsYmd(), CONFIG (+32 more)

### Community 5 - "seo.js"
Cohesion: 0.18
Nodes (12): createApp(), findPage(), render(), root, clean(), esc(), faqPage(), headTags() (+4 more)

### Community 6 - "Prise de rendez-vous"
Cohesion: 0.15
Nodes (12): Au quotidien, Ce que fait le site, Contenu, Hors du site : ce qui pèse le plus pour la 1re place, Lancer, Logo, Loyck — site (version statique), Mise en place (une fois, gratuit) (+4 more)

### Community 7 - "OrnDivider.vue"
Cohesion: 0.50
Nodes (3): lashes, left, lid()

### Community 8 - "WorksSection.vue"
Cohesion: 0.13
Nodes (15): events, props, STATUS, today, id, lit, props, columns (+7 more)

### Community 9 - "check-pages.mjs"
Cohesion: 0.11
Nodes (14): descriptions, { pages }, root, { siteUrl }, slugs, titles, business, dist (+6 more)

### Community 11 - "WorkLightbox.vue"
Cohesion: 0.40
Nodes (5): dialog, index, onKey(), props, step()

## Knowledge Gaps
- **1 isolated node(s):** `AppKit`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 115 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vue` connect `vue` to `PageArticle.vue`, `package.json`, `BookingWidget.vue`, `seo.js`, `WorksSection.vue`, `WorkLightbox.vue`?**
  _High betweenness centrality (0.372) - this node is a cross-community bridge._
- **What connects `AppKit` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PageArticle.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.11491935483870967 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `vue` be split into smaller, more focused modules?**
  _Cohesion score 0.10591133004926108 - nodes in this community are weakly interconnected._
- **Should `BookingWidget.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.07123034227567067 - nodes in this community are weakly interconnected._
- **Should `WorksSection.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.12631578947368421 - nodes in this community are weakly interconnected._