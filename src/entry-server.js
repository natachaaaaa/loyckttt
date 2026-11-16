// Build-time render of the page to HTML (scripts/prerender.mjs), so search engines get the full content.
import { renderToString } from 'vue/server-renderer'
import { createApp } from './app'

export { headTags, pageMeta } from './seo'
export { pages, pageUrl } from './content'

export function render(path) {
  return renderToString(createApp(true, path))
}
