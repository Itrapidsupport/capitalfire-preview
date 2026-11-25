import { Link } from 'react-router-dom'
import { NAV, SERVICES, SITE } from '../data/site'
import { Logo } from './Logo'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-night text-ice/80">
      <div className="wrap grid gap-12 py-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo className="h-28" />
          <p className="mt-7 max-w-xs text-[1.05rem] font-semibold leading-snug text-white font-display">Doing what we do best, protecting your building.</p>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-sm font-semibold text-mute">Services</h2>
          <ul className="mt-4 space-y-2.5">
            {SERVICES.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`} className="link-u">{s.short}</Link></li>)}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-sm font-semibold text-mute">Company</h2>
          <ul className="mt-4 space-y-2.5">
            {[{ to: '/', label: 'Home' }, ...NAV].map((n) => <li key={n.to}><Link to={n.to} className="link-u">{n.label}</Link></li>)}
          </ul>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-sm font-semibold text-mute">Contact</h2>
          <address className="mt-4 space-y-1.5 not-italic">
            <p className="text-white">{SITE.legal}</p>
            <p>{SITE.street}<br />{SITE.city}, {SITE.region} {SITE.postal}</p>
            <p className="pt-2">Tel <a href={SITE.phoneHref} className="link-u font-semibold text-white">{SITE.phone}</a></p>
            <p>Fax {SITE.fax}</p>
            <p><a href={`mailto:${SITE.email}`} className="link-u break-all text-white">{SITE.email}</a></p>
          </address>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none select-none whitespace-nowrap px-4 text-center text-[16.5vw] font-semibold leading-[0.8] tracking-[-0.05em] text-white/[0.04] font-display">CAPITAL</div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-6 text-xs text-mute sm:flex-row sm:justify-between">
          <p>© 2026 {SITE.legal} All rights reserved.</p>
          <p>Design preview. Not the official website.</p>
        </div>
      </div>
    </footer>
  )
}
