// Search engine data built from src/content/business.json and home.json: JSON-LD (Person, TattooParlor,
// WebSite, FAQPage) and the head tags that need the absolute site URL. Used by the build-time prerender.
// Empty fields are left out: structured data must only state what is true.
import business from './content/business.json'
import home from './content/home.json'

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
const faq = home.sections.find((s) => s.component === 'faq')

export function jsonLd() {
  const salonId = abs('/#salon') || '#salon'
  const artistId = abs('/#loyck') || '#loyck'
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
      '@id': abs('/#website'),
      name: `${artist.name} — Tatoueur à ${salon.city}`,
      url: abs('/'),
      inLanguage: 'fr-FR',
      about: { '@id': artistId },
    },
    faq && {
      '@type': 'FAQPage',
      mainEntity: faq.items.map((it) => ({
        '@type': 'Question',
        name: it.question,
        acceptedAnswer: { '@type': 'Answer', text: it.answer },
      })),
    },
  ]
  return clean({ '@context': 'https://schema.org', '@graph': graph.filter(Boolean) })
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Tags injected before </head> by the prerender. */
export function headTags() {
  const tags = [`<script type="application/ld+json">${JSON.stringify(jsonLd()).replace(/</g, '\\u003c')}</script>`]
  if (siteUrl) {
    tags.push(
      `<link rel="canonical" href="${esc(abs('/'))}" />`,
      `<meta property="og:url" content="${esc(abs('/'))}" />`,
      `<meta property="og:image" content="${esc(abs('/og-image.jpg'))}" />`,
      `<meta name="twitter:image" content="${esc(abs('/og-image.jpg'))}" />`,
    )
  }
  return tags.join('\n    ')
}

/** Salon phone for display ("05 81 43 43 21") and for tel: links ("+33581434321"). */
export const salonPhone = salon.phone
  ? { display: salon.phone.replace(/^\+33\s?/, '0'), href: `tel:${salon.phone.replace(/\s/g, '')}` }
  : null
export { salon, artist }
