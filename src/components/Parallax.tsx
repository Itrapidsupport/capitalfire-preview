import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '../motion/gsap'
import { prefersReduced } from '../lib/env'

/** GSAP ScrollTrigger parallax: the inner layer drifts while the clipped frame scrolls past. */
export default function Parallax({ children, amount = 12, className = '' }: { children: ReactNode; amount?: number; className?: string }) {
  const frame = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (prefersReduced() || !frame.current || !inner.current) return
    const tw = gsap.fromTo(inner.current, { yPercent: -amount / 2 }, { yPercent: amount / 2, ease: 'none', scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    return () => { tw.scrollTrigger?.kill(); tw.kill(); ScrollTrigger.refresh() }
  }, [amount])
  return (
    <div ref={frame} data-parallax className={`${/\babsolute\b/.test(className) ? '' : 'relative '}overflow-hidden ${className}`}>
      <div ref={inner} className="absolute inset-x-0" style={{ top: `-${amount / 2}%`, bottom: `-${amount / 2}%` }}>{children}</div>
    </div>
  )
}
