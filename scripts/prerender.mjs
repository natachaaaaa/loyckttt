// Last build step (npm run build): renders every page to static HTML (dist/index.html and
// dist/<slug>/index.html), so search engines read the full content without running JavaScript. Each page
// gets its own title, description, Open Graph, canonical and JSON-LD; plus robots.txt and sitemap.xml.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'

const dist = new URL('../dist/', import.meta.url)
const ssrDir = new URL('../dist-ssr/', import.meta.url)
const { render, headTags, pageMeta, pages, pageUrl } = await import(new URL('entry-server.js', ssrDir))
const business = JSON.parse(await readFile(new URL('../src/content/business.json', import.meta.url), 'utf8'))
const site = (business.siteUrl || '').replace(/\/$/, '')

const template = await readFile(new URL('index.html', dist), 'utf8')
if (!template.includes('<div id="app"></div>')) throw new Error('dist/index.html: empty #app not found')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
// Replaces the content="…" of the meta tag matching `attr` (e.g. name="description").
const setMeta = (html, attr, value) => {
  const re = new RegExp(`(<meta\\s+${attr}\\s+content=")[^"]*(")`)
  if (!re.test(html)) throw new Error(`index.html: <meta ${attr}> not found`)
  return html.replace(re, `$1${esc(value)}$2`)
}

const paths = ['/', ...pages.map(pageUrl)]
for (const path of paths) {
  const meta = pageMeta(path)
  let html = template
    .replace('<div id="app"></div>', `<div id="app">${await render(path)}</div>`)
    .replace('</head>', `  ${headTags(path)}\n  </head>`)
  if (meta.page) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`)
    html = setMeta(html, 'name="description"', meta.description)
    html = setMeta(html, 'property="og:title"', meta.ogTitle)
    html = setMeta(html, 'property="og:description"', meta.description)
  }
  const dir = new URL(`.${meta.path}`, dist)
  await mkdir(dir, { recursive: true })
  await writeFile(new URL('index.html', dir), html)
  console.log(`prerendered ${meta.path} (${Math.round(html.length / 1024)} KB)`)
}

// robots.txt always; sitemap only with the real site address (it needs absolute URLs).
const today = new Date().toISOString().slice(0, 10)
await writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`)
if (site) {
  const urls = paths.map((p) => `  <url><loc>${site}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')
  await writeFile(
    new URL('sitemap.xml', dist),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )
} else {
  console.warn('\n⚠ business.json "siteUrl" is empty: no canonical URL, Open Graph URL/image or sitemap.xml.\n')
}

await rm(ssrDir, { recursive: true, force: true })
