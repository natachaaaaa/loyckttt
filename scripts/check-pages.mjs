// Checks the content pages after `npm run build`: node scripts/check-pages.mjs
// Catches what a typo in src/content/pages.json would break (related slugs, photos) and SEO basics per page.
import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const read = (p) => readFile(new URL(p, root), 'utf8')
const { pages } = JSON.parse(await read('src/content/pages.json'))
const { siteUrl } = JSON.parse(await read('src/content/business.json'))
const slugs = new Set(pages.map((p) => p.slug))

assert.equal(slugs.size, pages.length, 'slugs are unique')
for (const p of pages) {
  assert.match(p.slug, /^[a-z0-9-]+$/, `${p.slug}: slug is lowercase-dashed`)
  for (const r of p.related || []) assert.ok(slugs.has(r), `${p.slug}: related "${r}" exists`)
  for (const s of p.sections) {
    for (const f of s.works || []) await access(new URL(`public/works/${f}`, root)) // throws if missing
  }
  assert.ok(p.title.length <= 70, `${p.slug}: title ≤ 70 chars (${p.title.length})`)
  assert.ok(p.description.length >= 70 && p.description.length <= 170, `${p.slug}: description 70–170 chars (${p.description.length})`)
}

const titles = new Set()
const descriptions = new Set()
for (const path of ['/', ...pages.map((p) => `/${p.slug}/`)]) {
  const html = await read(`dist${path}index.html`)
  const title = html.match(/<title>([^<]*)<\/title>/)[1]
  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)[1]
  assert.ok(!titles.has(title), `${path}: unique title`)
  assert.ok(!descriptions.has(description), `${path}: unique description`)
  titles.add(title)
  descriptions.add(description)
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${path}: exactly one h1`)
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  assert.ok(ld['@graph'].some((n) => n['@type'] === 'TattooParlor'), `${path}: salon in JSON-LD`)
  if (path !== '/') assert.ok(ld['@graph'].some((n) => n['@type'] === 'BreadcrumbList'), `${path}: breadcrumb`)
  if (siteUrl) assert.ok(html.includes(`<link rel="canonical" href="${siteUrl.replace(/\/$/, '')}${path}"`), `${path}: canonical`)
}
console.log(`ok: ${pages.length} pages + home`)
