// Content from Storyblok, with the bundled src/content/home.json as fallback (no token, offline, API down).
import { ref, nextTick } from 'vue'
import { useStoryblokApi, useStoryblokBridge } from '@storyblok/vue'
import { ScrollTrigger } from './gsap'
import fallback from './content/home.json'

export const TOKEN = import.meta.env.VITE_STORYBLOK_TOKEN
export const REGION = import.meta.env.VITE_STORYBLOK_REGION || 'eu'
// Storyblok opens the preview with ?_storyblok=<id> in the URL.
export const inEditor = typeof location !== 'undefined' && new URLSearchParams(location.search).has('_storyblok')

export const story = ref(fallback)

const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))])

/** Loads the home story before the app mounts, so animations bind to the final content. */
export async function loadStory() {
  if (!TOKEN) return
  try {
    const { data } = await withTimeout(
      useStoryblokApi().get('cdn/stories/home', {
        version: inEditor || import.meta.env.DEV ? 'draft' : 'published',
        cv: inEditor ? Date.now() : undefined,
      }),
      5000,
    )
    story.value = data.story
  } catch (e) {
    console.warn('Storyblok unavailable, using bundled content.', e)
  }
}

/** Live preview: re-render on every edit in the visual editor, then re-measure scroll animations. */
export function connectBridge() {
  if (!inEditor || !story.value.id) return
  useStoryblokBridge(story.value.id, async (s) => {
    story.value = s
    await nextTick()
    ScrollTrigger.refresh()
  })
}

/**
 * Image from a Storyblok asset field (or a bundled one): src resized by Storyblok's image service,
 * plus intrinsic size (read from the Storyblok URL, or width/height on bundled assets) to avoid layout shift.
 */
export function image(asset, width = 1000) {
  const f = asset?.filename
  if (!f) return null
  const dims = f.match(/\/(\d+)x(\d+)\//)
  const w = dims ? Number(dims[1]) : asset.width
  const h = dims ? Number(dims[2]) : asset.height
  const remote = f.includes('a.storyblok.com')
  const target = w ? Math.min(width, w) : width // never upscale
  return {
    src: remote ? `${f}/m/${target}x0/filters:quality(78)` : f,
    w: remote && w ? target : w,
    h: remote && w ? Math.round((h / w) * target) : h,
    alt: asset.alt || '',
  }
}
