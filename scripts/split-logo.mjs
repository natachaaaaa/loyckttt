// Turns the exported logo SVG (letters + roots merged into big paths) into two assets for the hero:
// one path per letter (animated individually) and the roots alone.
// Usage: node scripts/split-logo.mjs <source.svg> [--drop-letter=N]
//   --drop-letter=N removes the Nth letter (0-based, left to right) with its roots and closes the gap.
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync(process.argv[2], 'utf8')
const dropArg = process.argv.find((a) => a.startsWith('--drop-letter='))
let viewBox = src.match(/viewBox="([^"]+)"/)[1]
let [maskD, lettersD, rootsD] = [...src.matchAll(/ d="([^"]*)"/g)].map((m) => m[1])

const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(n * 10) / 10))

// Each subpath with its bbox and points.
function subpaths(d) {
  return d.match(/M[^M]*/g).map((sp) => {
    const n = sp.match(/-?\d+\.?\d*/g).map(Number)
    const pts = []
    for (let i = 0; i < n.length; i += 2) pts.push([n[i], n[i + 1]])
    const xs = pts.map((p) => p[0])
    const ys = pts.map((p) => p[1])
    return { d: sp.trim(), pts, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] }
  })
}

// A subpath inside another's bbox is a counter (hole of an O, loop in a root): keep it in the same path,
// otherwise it would be filled on its own.
function group(subs) {
  const inside = (a, b) => a.box[0] >= b.box[0] && a.box[1] >= b.box[1] && a.box[2] <= b.box[2] && a.box[3] <= b.box[3]
  const area = (s) => (s.box[2] - s.box[0]) * (s.box[3] - s.box[1])
  const sorted = [...subs].sort((a, b) => area(b) - area(a))
  const groups = []
  for (const s of sorted) {
    const parent = groups.find((g) => g[0] !== s && inside(s, g[0]))
    parent ? parent.push(s) : groups.push([s])
  }
  return groups
}

const byX = (a, b) => a[0].box[0] - b[0].box[0]

if (dropArg) {
  // Paths only use absolute M/C/Z commands, so shifting a subpath = shifting every even number (x).
  const ls = group(subpaths(lettersD)).sort(byX)
  const i = Number(dropArg.split('=')[1])
  const [drop, prev, next] = [ls[i], ls[i - 1], ls[i + 1]].map((g) => g?.[0].box)
  const cut0 = prev ? (prev[2] + drop[0]) / 2 : -Infinity
  const cut1 = next ? (drop[2] + next[0]) / 2 : Infinity
  const shift = next ? next[0] - drop[0] : 0
  const edit = (d) =>
    subpaths(d)
      .map((s) => {
        const cx = (s.box[0] + s.box[2]) / 2
        if (cx >= cut0 && cx <= cut1) return '' // belongs to the dropped letter
        if (cx < cut0) return s.d
        let k = 0
        return s.d.replace(/-?\d+\.?\d*/g, (n) => (k++ % 2 ? n : (Number(n) - shift).toFixed(2)))
      })
      .join(' ')
  ;[maskD, lettersD, rootsD] = [maskD, lettersD, rootsD].map(edit)
  const vb = viewBox.split(' ').map(Number)
  viewBox = [vb[0], vb[1], vb[2] - shift, vb[3]].join(' ')
}

const letters = group(subpaths(lettersD)).sort(byX)
const midY = letters.reduce((s, g) => s + (g[0].box[1] + g[0].box[3]) / 2, 0) / letters.length

// Letters stay inline (animated one by one). Roots go to a separate SVG shown as an <img>: the browser
// rasterizes it once, so revealing it with a mask is cheap (animating 1.5 MB of inline paths ran at ~2 fps).
const vb = viewBox.split(' ').map(Number)
const midPct = Math.round(((midY - vb[1]) / vb[3]) * 1000) / 10

const letterSvg = `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="logo" aria-hidden="true"><defs><mask id="logo-decay" maskUnits="userSpaceOnUse" x="0" y="0" width="1400" height="760"><rect width="1400" height="760" fill="#fff"/><path d="${round(maskD)}" fill="#000"/></mask></defs><g fill="currentColor" mask="url(#logo-decay)">${letters
  .map((g) => `<path class="logo__letter" d="${round(g.map((s) => s.d).join(' '))}"/>`)
  .join('')}</g></svg>\n`
const rootsSvg = `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg"><path fill="#f0ebe3" d="${round(rootsD)}"/></svg>\n`

writeFileSync(new URL('../src/assets/logo-letters.svg', import.meta.url), letterSvg)
writeFileSync(new URL('../src/assets/logo-roots.svg', import.meta.url), rootsSvg)
console.log(`letters: ${letters.length}, letters centerline at ${midPct}% of the height (TheHero.vue --mid)`)
