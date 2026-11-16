// Site content: src/content/home.json (home page sections) and pages.json (one URL per page: /<slug>/).
// README > « Contenu ».
import home from './content/home.json'
import pagesData from './content/pages.json'

export const sections = home.sections
export const pages = pagesData.pages

/** Page for a URL path ("/premier-tatouage/" or "/premier-tatouage"), or null for the home page. */
export function findPage(path) {
  const slug = (path || '/').replace(/^\/+|\/+$/g, '')
  return slug ? pages.find((p) => p.slug === slug) || null : null
}

export const pageUrl = (page) => `/${page.slug}/`

/** Work items of the home gallery, picked by file name ("crane.jpg"), in the given order. */
export function worksByFile(files) {
  const items = sections.find((s) => s.component === 'works')?.items || []
  return files.map((f) => items.find((it) => it.image?.filename.endsWith(`/${f}`))).filter(Boolean)
}

export const homeSection = (component) => sections.find((s) => s.component === component)

/** Image entry of home.json ({ filename, alt, width, height }) as { src, w, h, alt }, or null. */
export function image(asset) {
  if (!asset?.filename) return null
  return { src: asset.filename, w: asset.width, h: asset.height, alt: asset.alt || '' }
}
