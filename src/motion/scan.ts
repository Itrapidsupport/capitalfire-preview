import { useEffect } from 'react'
import { gsap, ScrollTrigger } from './gsap'
import { prefersReduced } from './env'

/** Wrap every word of a heading in .ax-w > .ax-wi (mask + rising inner). Text stays in the DOM for SR/SEO. */
function splitWords(h: HTMLElement, cls = 'ax-w', inner = 'ax-wi') {
  if (h.dataset.split) return
  h.dataset.split = '1'
  let i = 0
  const walk = (n: Node) => {
    Array.from(n.childNodes).forEach((c) => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment()
        ;(c.textContent || '').split(/(\s+)/).forEach((p) => {
          if (!p) return
          if (/^\s+$/.test(p)) { frag.append(p); return }
          const o = document.createElement('span'); o.className = cls
          if (inner) {
            const inn = document.createElement('span'); inn.className = inner; inn.style.setProperty('--i', String(i++)); inn.textContent = p
            o.append(inn)
          } else { o.textContent = p; o.style.setProperty('--i', String(i++)) }
          frag.append(o)
        })
        c.replaceWith(frag)
      } else if (c.nodeType === 1 && !(c as HTMLElement).classList.contains(cls)) walk(c)
    })
  }
  walk(h)
  if (inner) h.classList.add('ax-split')
}

/**
 * Page motion pass, re-run on every route change (after hydration only, so SSR HTML is never hidden):
 * word reveals on headings, image mask wipes + parallax, scroll-lit statements, card lift, magnetic buttons.
 */
export function useMotionScan(key: string) {
  useEffect(() => {
    const main = document.getElementById('main')
    if (!main) return
    const reduced = prefersReduced()
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const off: (() => void)[] = []
    const tweens: (gsap.core.Tween | gsap.core.Timeline)[] = []

    if (!reduced) main.querySelectorAll<HTMLElement>('h1, h2:not([data-nosplit])').forEach((h) => splitWords(h))
    main.querySelectorAll<HTMLElement>('[data-card]').forEach((c) => c.classList.add('ax-card'))

    const els = Array.from(document.querySelectorAll<HTMLElement>('.rv:not(.in), .draw:not(.in), .ax-split:not(.in), .ax-img:not(.in), .ax-card:not(.in)'))
    if (!('IntersectionObserver' in window)) els.forEach((e) => e.classList.add('in'))
    else {
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('in'); io.unobserve(e.target) }
      }), { rootMargin: '0px 0px -8% 0px' })
      els.forEach((e) => io.observe(e))
      off.push(() => io.disconnect())
    }

    if (!reduced) {
      // scroll-lit statements: each word brightens as the line crosses the middle of the viewport
      main.querySelectorAll<HTMLElement>('[data-lit]').forEach((el) => {
        splitWords(el, 'lit-w', '')
        const words = Array.from(el.querySelectorAll<HTMLElement>('.lit-w'))
        words.forEach((w) => w.style.setProperty('--lit', '0'))
        const st = ScrollTrigger.create({
          trigger: el, start: 'top 85%', end: 'bottom 45%', scrub: true,
          onUpdate: (s) => { const n = s.progress * words.length; words.forEach((w, i) => w.style.setProperty('--lit', String(Math.max(0, Math.min(1, n - i))))) },
        })
        off.push(() => st.kill())
      })
      // photo parallax
      main.querySelectorAll<HTMLElement>('.ax-img').forEach((w) => {
        if (w.closest('[data-parallax]')) return
        const img = w.querySelector('img'); if (!img) return
        const hero = w.classList.contains('ax-img-hero')
        tweens.push(gsap.fromTo(img, { yPercent: hero ? 0 : -6, scale: hero ? 1.04 : 1.14 }, {
          yPercent: hero ? 12 : 6, scale: hero ? 1.12 : 1.14, ease: 'none',
          scrollTrigger: { trigger: w, start: hero ? 'top top' : 'top bottom', end: 'bottom top', scrub: true },
        }))
      })
      // bands open from an inset card to full bleed
      main.querySelectorAll<HTMLElement>('[data-open]').forEach((s) => {
        tweens.push(gsap.fromTo(s, { clipPath: 'inset(5% 4% 0% 4% round 18px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
          scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 25%', scrub: true },
        }))
      })
      // marquees speed up with scroll velocity
      const mq = document.querySelectorAll<HTMLElement>('.mq-track')
      if (mq.length) {
        let raf = 0
        const tick = () => {
          const v = Math.abs(window.__lenis?.velocity ?? 0)
          mq.forEach((t) => t.getAnimations().forEach((a) => { a.playbackRate += (1 + Math.min(v, 60) / 10 - a.playbackRate) * 0.08 }))
          raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        off.push(() => cancelAnimationFrame(raf))
      }
    }

    if (fine && !reduced) {
      document.querySelectorAll<HTMLElement>('.btn').forEach((b) => {
        const mv = (e: PointerEvent) => {
          const r = b.getBoundingClientRect()
          b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.22}px ${(e.clientY - r.top - r.height / 2) * 0.3}px`
        }
        const lv = () => { b.style.translate = '' }
        b.addEventListener('pointermove', mv); b.addEventListener('pointerleave', lv)
        off.push(() => { b.removeEventListener('pointermove', mv); b.removeEventListener('pointerleave', lv); lv() })
      })
    }

    const id = window.setTimeout(() => ScrollTrigger.refresh(), 80)
    return () => {
      window.clearTimeout(id)
      off.forEach((f) => f())
      tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill() })
    }
  }, [key])
}
