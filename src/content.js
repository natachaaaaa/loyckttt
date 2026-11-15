// Site content: src/content/home.json, one entry per section in page order (README > « Contenu »).
import home from './content/home.json'

export const sections = home.sections

/** Image entry of home.json ({ filename, alt, width, height }) as { src, w, h, alt }, or null. */
export function image(asset) {
  if (!asset?.filename) return null
  return { src: asset.filename, w: asset.width, h: asset.height, alt: asset.alt || '' }
}
