// Build-time render of the page to HTML (scripts/prerender.mjs), so search engines get the full content.
import { renderToString } from 'vue/server-renderer'
import { createApp } from './app'

export { headTags } from './seo'

export function render() {
  return renderToString(createApp(true))
}
