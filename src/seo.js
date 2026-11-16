// Search engine data built from src/content/business.json and home.json: JSON-LD (Person, TattooParlor,
// WebSite, FAQPage) and the head tags that need the absolute site URL. Used by the build-time prerender.
// Empty fields are left out: structured data must only state what is true.
import business from './content/business.json'
import home from './content/home.json'
import { findPage } from './content'

const { artist, salon, areaServed } = business
export const siteUrl = (business.siteUrl || '').replace(/\/$/, '')

/** "5 rue de la Libération, 81100 Castres" */
export const salonAddress = [salon.streetAddress, [salon.postalCode, salon.city].filter(Boolean).join(' ')]
  .filter(Boolean)
  .join(', ')

/** Drops empty values (null, '', [], {}) recursively. */
function clean(value) {
  if (Array.isArray(value)) {
    const out = value.map(clean).filter((v) => v !== undefined)
    return out.length ? out : undefined
  }
  if (value && typeof value === 'object') {
    const out = Object.fromEntries(
      Object.entries(value)
        .map(([k, v]) => [k, clean(v)])
        .filter(([, v]) => v !== undefined),
    )
    // An object left with only its @type says nothing; a { "@id" } reference is kept.
    return Object.keys(out).some((k) => k !== '@type') ? out : undefined
  }
  return value === '' || value === null || value === undefined ? undefined : value
}

const abs = (path) => (siteUrl ? `${siteUrl}${path}` : undefined)
const homeFaq = home.sections.find((s) => s.component === 'faq')

const faqPage = (items) =>
  items?.length && {
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  }

/** Title, description and path of a page of pages.json, or of the home page. */
export function pageMeta(path) {
  const page = findPage(path)
  if (!page) return { path: '/', page: null }
  return {
    path: `/${page.slug}/`,
    page,
    title: page.title,
    description: page.description,
    ogTitle: `${page.h1} — ${artist.name}, tatoueur à ${salon.city}`,
  }
}

/** schema.org graph: the artist and the salon on every page, plus the page itself, its breadcrumb and FAQ. */
export function jsonLd(path = '/') {
  const { path: url, page } = pageMeta(path)
  const salonId = abs('/#salon') || '#salon'
  const artistId = abs('/#loyck') || '#loyck'
  const websiteId = abs('/#website') || '#website'
  const graph = [
    {
      '@type': 'Person',
      '@id': artistId,
      name: artist.name,
      jobTitle: artist.jobTitle,
      description: artist.description,
      url: abs('/'),
      image: abs('/og-image.jpg'),
      sameAs: [artist.instagram],
      knowsAbout: ['Tatouage', ...artist.styles],
      worksFor: { '@id': salonId },
      workLocation: { '@id': salonId },
    },
    {
      '@type': 'TattooParlor',
      '@id': salonId,
      name: salon.name,
      telephone: salon.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: salon.streetAddress,
        postalCode: salon.postalCode,
        addressLocality: salon.city,
        addressRegion: salon.region,
        addressCountry: salon.country,
      },
      geo: salon.latitude && { '@type': 'GeoCoordinates', latitude: salon.latitude, longitude: salon.longitude },
      openingHours: salon.openingHours,
      areaServed: areaServed.map((name) => ({ '@type': 'City', name })),
      sameAs: [salon.instagram, salon.googleBusinessUrl],
      employee: { '@id': artistId },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: `${artist.name} — Tatoueur à ${salon.city}`,
      url: abs('/'),
      inLanguage: 'fr-FR',
      about: { '@id': artistId },
    },
  ]
  if (page) {
    graph.push(
      {
        '@type': 'WebPage',
        '@id': abs(`${url}#webpage`),
        url: abs(url),
        name: page.title,
        description: page.description,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': websiteId },
        about: { '@id': artistId },
        breadcrumb: { '@id': abs(`${url}#breadcrumb`) },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': abs(`${url}#breadcrumb`),
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: abs('/') },
          { '@type': 'ListItem', position: 2, name: page.h1, item: abs(url) },
        ],
      },
      faqPage(page.faq),
    )
  } else {
    graph.push(faqPage(homeFaq?.items))
  }
  return clean({ '@context': 'https://schema.org', '@graph': graph.filter(Boolean) })
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Tags injected before </head> by the prerender, for the page at `path`. */
export function headTags(path = '/') {
  const { path: url } = pageMeta(path)
  const tags = [`<script type="application/ld+json">${JSON.stringify(jsonLd(path)).replace(/</g, '\\u003c')}</script>`]
  if (siteUrl) {
    tags.push(
      `<link rel="canonical" href="${esc(abs(url))}" />`,
      `<meta property="og:url" content="${esc(abs(url))}" />`,
      `<meta property="og:image" content="${esc(abs('/og-image.jpg'))}" />`,
      `<meta name="twitter:image" content="${esc(abs('/og-image.jpg'))}" />`,
    )
  }
  return tags.join('\n    ')
}

/** Google Maps directions to the salon. */
export const salonMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${salon.name}, ${salonAddress}`)}`

/** Salon phone for display ("05 81 43 43 21") and for tel: links ("+33581434321"). */
export const salonPhone = salon.phone
  ? { display: salon.phone.replace(/^\+33\s?/, '0'), href: `tel:${salon.phone.replace(/\s/g, '')}` }
  : null
export { salon, artist }
