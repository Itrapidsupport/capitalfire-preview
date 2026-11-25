import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV, SERVICES, SITE } from '../data/site'
import { Logo } from './Logo'
import { LayerIcon } from './Icons'
import MobileMenu from './MobileMenu'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false); setMega(false) }, [pathname])
  useEffect(() => {
    let last = window.scrollY
    const h = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      if (y > 400 && y > last + 6) { setHidden(true); setMega(false) }
      else if (y < last - 6 || y <= 400) setHidden(false)
      last = y
    }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${hidden && !open ? '-translate-y-full' : ''} ${scrolled || open || mega ? 'border-b border-white/10 bg-night' : 'border-b border-transparent bg-night/0'}`}
        style={{ height: 'var(--cf-header-h)' }}
        onMouseLeave={() => setMega(false)}
      >
        <div className="wrap flex h-full items-center justify-between gap-6">
          <Link to="/" aria-label="Capital Fire & Security Inc., home" className="flex shrink-0 items-center gap-3">
            <Logo className="h-[50px] min-[960px]:h-[60px]" />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 min-[1040px]:flex">
            {NAV.filter((n) => n.to !== '/contact').map((n) => (
              <NavLink key={n.to} to={n.to} onMouseEnter={() => setMega(n.to === '/services')} onFocus={() => setMega(n.to === '/services')}
                className={({ isActive }) => `relative px-3.5 py-2 text-[0.98rem] font-medium transition-colors ${isActive ? 'text-white' : 'text-ice/70 hover:text-white'}`}>
                {({ isActive }) => (<>{n.label}<span aria-hidden className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-signal transition-transform duration-500 ${isActive ? 'scale-x-100' : 'scale-x-0'}`} /></>)}
              </NavLink>
            ))}
            <a href={SITE.phoneHref} className="ml-4 flex items-center gap-2.5 px-2 text-[0.95rem] font-semibold text-white"><span className="live-dot" />24/7 {SITE.phone}</a>
            <Link to="/contact" className="btn btn-primary ml-3 !min-h-[44px] !px-5 !py-2 text-[0.95rem]">Request an estimate</Link>
          </nav>
          <div className="flex items-center gap-1 min-[1040px]:hidden">
            <a href={SITE.phoneHref} aria-label={`Call 24/7 service line ${SITE.phone}`} className="grid h-12 w-12 place-items-center rounded-full text-white">
              <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11 11 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3 5.5a2 2 0 0 1 2-2z" /></svg>
            </a>
            <button type="button" aria-controls="mobile-menu" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}
              className="relative -mr-2 grid h-12 w-12 place-items-center rounded-full">
              <span aria-hidden className={`absolute h-[2px] w-6 bg-white transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-[4px]'}`} />
              <span aria-hidden className={`absolute h-[2px] w-6 bg-white transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-[4px]'}`} />
            </button>
          </div>
        </div>
        {/* services mega panel (desktop) */}
        <div className={`absolute inset-x-0 top-full hidden border-b border-white/10 bg-night min-[1040px]:block transition-[opacity,transform] duration-400 ${mega ? 'pointer-events-auto opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`} onMouseEnter={() => setMega(true)}>
          <ul className="wrap grid grid-cols-4 gap-px py-6">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} tabIndex={mega ? 0 : -1} className="group flex items-start gap-3 rounded-md p-4 transition-colors hover:bg-white/5">
                  <LayerIcon layer={s.layer} className={`mt-0.5 h-6 w-6 shrink-0 ${s.layer === 'fire' ? 'text-alarm' : 'text-signal'}`} />
                  <span>
                    <span className="block font-semibold text-white">{s.short}</span>
                    <span className="mt-1 line-clamp-2 block text-sm text-mute">{s.card}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
