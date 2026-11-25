import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NAV, SERVICES, SITE } from '../data/site'
import { LayerIcon } from './Icons'

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/** Full-screen opaque mobile menu: focus trap, Escape closes, html-only scroll lock, main/footer inert. */
export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const toggle = document.querySelector<HTMLButtonElement>('[aria-controls="mobile-menu"]')
    document.documentElement.style.overflow = 'hidden'
    window.__lenis?.stop()
    const outside = Array.from(document.querySelectorAll<HTMLElement>('main, footer'))
    outside.forEach((el) => el.setAttribute('inert', ''))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab' || !panel.current) return
      const items = [toggle, ...Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE))].filter(Boolean) as HTMLElement[]
      const i = items.indexOf(document.activeElement as HTMLElement)
      e.preventDefault()
      items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      outside.forEach((el) => el.removeAttribute('inert'))
      document.documentElement.style.overflow = ''
      window.__lenis?.start()
    }
  }, [open, onClose])

  return (
    <div id="mobile-menu" ref={panel} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}
      className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto overscroll-contain bg-night min-[1040px]:hidden" style={{ top: 'var(--cf-header-h)' }}>
      <nav aria-label="Mobile" className="wrap flex min-h-full flex-col pt-3 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <ul className="border-t border-white/10">
          {[{ to: '/', label: 'Home' }, ...NAV].map((n, i) => (
            <li key={n.to} className="border-b border-white/10" style={{ animation: open ? `cf-rise .55s ${60 + i * 45}ms var(--cf-ease) both` : undefined }}>
              <NavLink to={n.to} end={n.to === '/'} onClick={onClose}
                className={({ isActive }) => `flex items-center justify-between py-4 text-[1.65rem] font-bold tracking-[-0.02em] font-display ${isActive ? 'text-signal' : 'text-white'}`}>
                {n.label}<span aria-hidden className="text-base text-white/40">→</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <p className="mt-7 text-sm font-semibold text-mute">Services</p>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link to={`/services/${s.slug}`} onClick={onClose} className="flex h-full min-h-[64px] items-center gap-2.5 rounded-md border border-white/10 px-3 py-2.5 text-[0.92rem] font-medium leading-snug text-white">
                <LayerIcon layer={s.layer} className={`h-5 w-5 shrink-0 ${s.layer === 'fire' ? 'text-alarm' : 'text-signal'}`} />{s.short}
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/contact" onClick={onClose} className="btn btn-primary mt-7 w-full">Request an estimate</Link>
        <div className="mt-auto space-y-1 pt-10 text-ice/80">
          <a href={SITE.phoneHref} className="flex min-h-[44px] items-center gap-3 text-xl font-bold text-white"><span className="live-dot" />{SITE.phone}</a>
          <p className="text-sm text-mute">24 hour service line, 7 days a week</p>
          <a href={`mailto:${SITE.email}`} className="flex min-h-[44px] items-center underline underline-offset-4">{SITE.email}</a>
        </div>
      </nav>
    </div>
  )
}
