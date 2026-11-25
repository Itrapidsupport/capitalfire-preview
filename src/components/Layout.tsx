import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, useAnimationControls } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import Seo from '../lib/Seo'
import { SmoothScroll } from '../motion/SmoothScroll'
import { useMotionScan } from '../motion/scan'
import { ScrollProgress } from '../motion/Chrome'
import { prefersReduced } from '../motion/env'
import { asset } from '../lib/env'

const EASE = [0.76, 0, 0.24, 1] as const
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/**
 * Two-stage route transition: on an internal link click the navy curtain (logo + signal line) rises over the page,
 * the route swaps underneath while covered, then the curtain lifts away. Reduced motion = plain navigation.
 */
export default function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const first = useRef(true)
  const busy = useRef(false)
  const curtain = useAnimationControls()
  const [shown, setShown] = useState(false)
  useMotionScan(pathname)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null
      if (!a || a.target || a.hasAttribute('download') || !a.href) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || !url.pathname.startsWith(BASE + '/')) return
      const to = url.pathname.slice(BASE.length) || '/'
      const cur = location.pathname.slice(BASE.length) || '/'
      if (to.replace(/\/$/, '') === cur.replace(/\/$/, '')) return
      if (prefersReduced() || busy.current) return
      e.preventDefault()
      busy.current = true
      setShown(true)
      curtain.set({ y: '100%' })
      curtain.start({ y: '0%', transition: { duration: 0.55, ease: EASE } }).then(() => navigate(to + url.search + url.hash))
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [curtain, navigate])

  useEffect(() => {
    if (first.current) { first.current = false; return }
    const l = window.__lenis
    if (l) l.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
    document.getElementById('main')?.focus({ preventScroll: true })
    if (busy.current) {
      const t = window.setTimeout(() => {
        curtain.start({ y: '-100%', transition: { duration: 0.75, ease: EASE } }).then(() => { busy.current = false; setShown(false) })
      }, 120)
      return () => window.clearTimeout(t)
    }
  }, [pathname, curtain])

  return (
    <SmoothScroll anchorOffset={-96}>
      <a href="#main" className="skip">Skip to content</a>
      <Seo />
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <div key={pathname}><Outlet /></div>
      </main>
      <Footer />
      <motion.div aria-hidden className="ax-curtain" initial={{ y: '100%' }} animate={curtain} style={{ visibility: shown ? 'visible' : 'hidden' }}>
        <div className="absolute inset-0 grid place-items-center">
          <img src={asset('brand/capital-logo-white.svg')} alt="" width={940} height={919} className="h-24 w-auto opacity-90 sm:h-32" />
        </div>
        <span className="ax-curtain-line" />
      </motion.div>
    </SmoothScroll>
  )
}
