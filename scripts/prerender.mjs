// Last build step (npm run build): renders the page to HTML inside dist/index.html, so search engines read
// the full content without running JavaScript, adds the JSON-LD / canonical tags, robots.txt and sitemap.xml.
import { readFile, writeFile, rm } from 'node:fs/promises'

const dist = new URL('../dist/', import.meta.url)
const ssrDir = new URL('../dist-ssr/', import.meta.url)
const { render, headTags } = await import(new URL('entry-server.js', ssrDir))
const business = JSON.parse(await readFile(new URL('../src/content/business.json', import.meta.url), 'utf8'))
const site = (business.siteUrl || '').replace(/\/$/, '')

const template = await readFile(new URL('index.html', dist), 'utf8')
if (!template.includes('<div id="app"></div>')) throw new Error('dist/index.html: empty #app not found')

const html = template
  .replace('<div id="app"></div>', `<div id="app">${await render()}</div>`)
  .replace('</head>', `  ${headTags()}\n  </head>`)
await writeFile(new URL('index.html', dist), html)

// robots.txt always; sitemap only with the real site address (it needs absolute URLs).
const today = new Date().toISOString().slice(0, 10)
await writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`)
if (site) {
  await writeFile(
    new URL('sitemap.xml', dist),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
  )
} else {
  console.warn('\n⚠ business.json "siteUrl" is empty: no canonical URL, Open Graph URL/image or sitemap.xml.\n')
}

await rm(ssrDir, { recursive: true, force: true })
console.log(`prerendered dist/index.html (${Math.round(html.length / 1024)} KB)`)
