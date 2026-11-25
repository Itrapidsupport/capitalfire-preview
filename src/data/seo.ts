/** Per-route SEO, used at runtime (lib/Seo.tsx) and at build time (scripts/postbuild.mjs). Preview = noindex. */
import { SERVICES, SITE } from './site'

export type SeoEntry = { path: string; title: string; description: string; jsonld?: unknown }

// Canonical points at the preview URL (this is not capitalfireandsecurity.ca and must never claim to be).
export const ORIGIN = 'https://itrapidsupport.github.io/capitalfire-preview'
export const canonical = (path: string) => ORIGIN + (path === '/' ? '/' : path.replace(/\/+$/, '') + '/')

const ORG = {
  '@type': 'LocalBusiness',
  '@id': ORIGIN + '/#org',
  name: SITE.legal,
  url: 'https://www.capitalfireandsecurity.ca/',
  email: SITE.email,
  telephone: '+1-905-660-0007',
  faxNumber: '+1-905-660-4197',
  slogan: 'Doing what we do best, protecting your building',
  address: { '@type': 'PostalAddress', streetAddress: SITE.street, addressLocality: SITE.city, addressRegion: SITE.regionShort, postalCode: SITE.postal, addressCountry: 'CA' },
}
const graph = (...nodes: unknown[]) => ({ '@context': 'https://schema.org', '@graph': [ORG, ...nodes] })
const T = (t: string) => `${t} | Capital Fire & Security`

export const SEO: SeoEntry[] = [
  { path: '/', title: 'Capital Fire & Security | Fire Life Safety and Building Security Systems', description: 'Capital Fire & Security Inc. specializes in fire life safety and building security systems: CCTV, access control, fire alarm, enterphone, smart locks and 24/7 service. Concord, Ontario.', jsonld: graph() },
  { path: '/about', title: T('Our Company'), description: 'Members of the Canadian Fire Alarm Association and the Canadian Security Association, with 90 years of combined experience and thousands of completed projects.' },
  { path: '/services', title: T('Products and Services'), description: 'CCTV, access control, fire life safety, enterphone and intercom, smart buildings, integrated security, automatic door operators and 24/7 service.' },
  ...SERVICES.map((s) => ({ path: `/services/${s.slug}`, title: T(s.title.charAt(0).toUpperCase() + s.title.slice(1)), description: s.lead.slice(0, 158) })),
  { path: '/projects', title: T('Portfolio'), description: 'High-rise residential, new development, commercial, institutional, retail, government, educational, industrial and hospitality projects.' },
  { path: '/careers', title: T('Careers'), description: 'Security systems technician and fire alarm technician roles at Capital Fire & Security Inc. Full-time, permanent.' },
  { path: '/contact', title: T('Contact and Estimates'), description: `Call ${SITE.phone} (24 hour service line, 7 days a week) or request a project estimate. ${SITE.street}, ${SITE.city}, ${SITE.region}.` },
]
const NF: SeoEntry = { path: '/404', title: T('Page not found'), description: 'This page could not be found.' }

export function seoFor(pathname: string): SeoEntry {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const p = (pathname.startsWith(base) ? pathname.slice(base.length) : pathname).replace(/\/+$/, '') || '/'
  return SEO.find((e) => e.path === p) ?? NF
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
export function headHtml(path: string): string {
  const e = seoFor(path)
  const out = [`<title>${esc(e.title)}</title>`, `<meta name="description" content="${esc(e.description)}" />`, `<meta property="og:title" content="${esc(e.title)}" />`, `<meta property="og:description" content="${esc(e.description)}" />`]
  if (e.path !== '/404') out.push(`<link rel="canonical" href="${canonical(e.path)}" />`)
  if (e.jsonld) out.push(`<script type="application/ld+json">${JSON.stringify(e.jsonld).replace(/</g, '\\u003c')}</script>`)
  return out.join('\n    ')
}
