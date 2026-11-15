// Pre-configures a Storyblok space for the site, through the Management API:
//   1. creates / updates every blok type from storyblok/components.json,
//   2. uploads the bundled photos and fills the "home" story with src/content/home.json, then publishes it,
//   3. optionally sets the visual editor preview URL.
// Safe to re-run: step 2 is skipped when "home" already holds the site's content, unless --reset is passed
// (which overwrites what the artist edited).
//
// Env: STORYBLOK_SPACE_ID, STORYBLOK_PAT (personal access token: My account > Personal access tokens),
//      STORYBLOK_REGION (eu | us | ap | ca, default eu), SITE_URL (optional, preview URL of the site).
// Usage: node scripts/storyblok-setup.mjs [--reset]
import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { randomUUID } from 'node:crypto'

const { STORYBLOK_SPACE_ID: SPACE, STORYBLOK_PAT: PAT, STORYBLOK_REGION = 'eu', SITE_URL } = process.env
const RESET = process.argv.includes('--reset')
if (!SPACE || !PAT) {
  console.error('Missing STORYBLOK_SPACE_ID or STORYBLOK_PAT (see README, "Contenu : Storyblok").')
  process.exit(1)
}

const HOSTS = { eu: 'mapi.storyblok.com', us: 'api-us.storyblok.com', ap: 'api-ap.storyblok.com', ca: 'api-ca.storyblok.com' }
if (!HOSTS[STORYBLOK_REGION]) throw new Error(`Unknown STORYBLOK_REGION "${STORYBLOK_REGION}"`)
const API = `https://${HOSTS[STORYBLOK_REGION]}/v1/spaces/${SPACE}`
const root = new URL('..', import.meta.url)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Management API call, retried when rate limited (free plans allow a few requests per second). */
async function api(method, path, body) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: { Authorization: PAT, 'Content-Type': 'application/json' },
      body: body && JSON.stringify(body),
    })
    if (res.status === 429 && attempt < 5) {
      await sleep(1000 * (attempt + 1))
      continue
    }
    const text = await res.text()
    if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text}`)
    return text ? JSON.parse(text) : {}
  }
}

// 1. Blok types
async function syncComponents() {
  const wanted = JSON.parse(await readFile(new URL('storyblok/components.json', root), 'utf8'))
  const { components: existing } = await api('GET', '/components/')
  for (const c of wanted) {
    // Storyblok orders fields by `pos`.
    const schema = Object.fromEntries(Object.entries(c.schema).map(([k, f], pos) => [k, { pos, ...f }]))
    const component = { is_root: false, ...c, schema }
    const found = existing.find((e) => e.name === c.name)
    if (found) await api('PUT', `/components/${found.id}`, { component })
    else await api('POST', '/components/', { component })
    console.log(`${found ? 'updated' : 'created'} blok: ${c.name}`)
  }
}

// 2. Assets
async function uploadAsset(local) {
  const name = basename(local.filename)
  const { assets } = await api('GET', `/assets/?search=${encodeURIComponent(name)}`)
  let asset = assets.find((a) => a.filename.endsWith(`/${name}`))
  if (!asset) {
    const file = await readFile(new URL(`public${local.filename}`, root))
    const signed = await api('POST', '/assets/', { filename: name, size: `${local.width}x${local.height}`, validate_upload: 1 })
    const form = new FormData()
    for (const [k, v] of Object.entries(signed.fields)) form.append(k, v)
    form.append('file', new Blob([file], { type: 'image/jpeg' }), name)
    const up = await fetch(signed.post_url, { method: 'POST', body: form })
    if (!up.ok) throw new Error(`upload ${name} -> ${up.status} ${await up.text()}`)
    asset = await api('GET', `/assets/${signed.id}/finish_upload`)
    asset.filename ??= signed.pretty_url
    console.log(`uploaded: ${name}`)
  }
  const filename = asset.filename.startsWith('//') ? `https:${asset.filename}` : asset.filename
  return { id: asset.id, filename, alt: local.alt || '', name: '', title: '', focus: '', copyright: '', fieldtype: 'asset' }
}

/** Deep copy of the bundled content with fresh uids and local images replaced by uploaded assets. */
// Sequential on purpose: one upload at a time keeps us under the API rate limit.
async function prepare(node) {
  if (Array.isArray(node)) {
    const out = []
    for (const item of node) out.push(await prepare(item))
    return out
  }
  if (!node || typeof node !== 'object') return node
  if (typeof node.filename === 'string' && node.filename.startsWith('/')) return uploadAsset(node)
  const out = {}
  for (const [k, v] of Object.entries(node)) out[k] = k === '_uid' ? randomUUID() : await prepare(v)
  return out
}

async function syncHome() {
  const local = JSON.parse(await readFile(new URL('src/content/home.json', root), 'utf8'))
  const { stories } = await api('GET', '/stories/?with_slug=home')
  let story = stories[0] && (await api('GET', `/stories/${stories[0].id}`)).story
  const filled = story?.content?.body?.some((b) => b.component === 'works')
  if (filled && !RESET) {
    console.log('home already has the site content: kept as is (use --reset to overwrite it).')
    return
  }
  const content = { component: 'page', _uid: randomUUID(), body: await prepare(local.content.body) }
  // path "/": the visual editor previews the site root, not SITE_URL + "home".
  const payload = { story: { name: local.name, slug: local.slug, path: '/', content }, publish: 1 }
  if (story) await api('PUT', `/stories/${story.id}`, payload)
  else story = (await api('POST', '/stories/', payload)).story
  console.log('home: content written and published.')
}

// 3. Visual editor preview URL
async function setPreviewUrl() {
  if (!SITE_URL) return
  await api('PUT', '', { space: { domain: SITE_URL.endsWith('/') ? SITE_URL : `${SITE_URL}/` } })
  console.log(`visual editor preview URL: ${SITE_URL}`)
}

await syncComponents()
await syncHome()
await setPreviewUrl()
console.log('Storyblok space ready.')
