import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Img from './Img'
import { Arrow, LayerIcon } from './Icons'
import { ABOUT, BRANDS, SITE } from '../data/site'
import projects from '../data/projects.json'
import { asset } from '../lib/env'

/** Inner-page hero: cinematic photo under a navy scrim, blueprint grid, big wide headline. */
export function PageHero({ kicker, title, lede, img, position, layer, children }: { kicker: string; title: ReactNode; lede?: string; img: string; position?: string; layer?: string; children?: ReactNode }) {
  return (
    <section className="grain relative isolate overflow-hidden bg-night">
      <Img id={img} alt="" priority sizes="(max-width: 899px) 190vw, 108vw" position={position} className="absolute inset-0 -z-20" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,12,23,.96)_0%,rgba(5,12,23,.82)_45%,rgba(5,12,23,.35)_100%)] max-[899px]:bg-[linear-gradient(180deg,rgba(5,12,23,.55)_0%,rgba(5,12,23,.92)_70%)]" />
      <div aria-hidden className="grid-bg absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(90deg,#000,transparent_70%)]" />
      <div className="wrap flex min-h-[86svh] flex-col justify-end pb-16 pt-36 sm:min-h-[100svh] sm:pb-28">
        <p className="kicker">{layer ? <LayerIcon layer={layer} className="h-5 w-5" /> : <span className="live-dot blue" />}{kicker}</p>
        <h1 className="d-xl mt-6 max-w-[15ch] text-[clamp(2.9rem,8vw,8rem)]">{title}</h1>
        {lede ? <p className="lede mt-7 max-w-[58ch]">{lede}</p> : null}
        {children}
      </div>
    </section>
  )
}

export function SectionHead({ kicker, title, lede, className = '', light = false }: { kicker: string; title: ReactNode; lede?: ReactNode; className?: string; light?: boolean }) {
  return (
    <div className={`max-w-3xl ${light ? 'on-light' : ''} ${className}`}>
      <p className="kicker rv">{kicker}</p>
      <h2 className={`d-lg mt-5 text-[clamp(2.4rem,5.4vw,4.8rem)] ${light ? 'text-ink' : ''}`}>{title}</h2>
      {lede ? <p className="lede rv mt-6">{lede}</p> : null}
    </div>
  )
}

/** Big closing band: 24/7 line + estimate. */
export function CtaBand() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 bg-deep" aria-labelledby="cta-h">
      <div aria-hidden className="grid-bg absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(70%_80%_at_70%_40%,#000,transparent)]" />
      <div aria-hidden className="absolute -right-40 top-1/2 -z-10 h-[620px] w-[620px] -translate-y-1/2 rounded-full bg-blue/40 blur-[120px]" />
      <div className="wrap grid gap-12 py-28 sm:py-40 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="kicker rv"><span className="live-dot" />Your needs don’t rest, and neither do we</p>
          <h2 id="cta-h" className="d-xl mt-6 text-[clamp(2.8rem,7.4vw,7rem)]">Protecting your building, around the clock.</h2>
        </div>
        <div className="rv lg:col-span-5">
          <p className="body max-w-[44ch]">24 hour service line, 7 days a week. For estimates, tell us about your building and one of our team members will contact you.</p>
          <div className="mt-8 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
            <a href={SITE.phoneHref} className="btn btn-primary">Call {SITE.phone}</a>
            <Link to="/contact" className="btn btn-line">Request an estimate <Arrow /></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Memberships({ className = '' }: { className?: string }) {
  return (
    <ul className={`grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-ink/10 sm:grid-cols-4 ${className}`}>
      {ABOUT.memberships.map((m) => (
        <li key={m.f} className="flex h-32 items-center justify-center bg-white p-6">
          <img src={asset('brand/' + m.f)} alt={m.a} width={m.w} height={m.h} loading="lazy" className="max-h-16 w-auto max-w-[140px] object-contain" />
        </li>
      ))}
    </ul>
  )
}

/** Manufacturers they install (names from their brand wall), as an endless typographic marquee. */
export function BrandMarquee({ list = BRANDS, speed = 70 }: { list?: string[]; speed?: number }) {
  return (
    <div className="mq border-y border-white/10 py-7" style={{ ['--mq-s' as string]: `${speed}s` }}>
      <p className="sr-only">Brands we install: {list.join(', ')}.</p>
      <div className="mq-track" aria-hidden>
        {[0, 1].map((k) => (
          <ul key={k} className="mq-row">
            {list.map((b) => (
              <li key={b} className="flex items-center whitespace-nowrap px-8 font-display text-[clamp(1.6rem,3.4vw,2.8rem)] font-medium tracking-[-0.02em] text-ice/55">
                {b}<span className="ml-14 h-1.5 w-1.5 rotate-45 bg-signal/70" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

type P = { name: string; dev: string; img: string; w: number; h: number }
export const PROJECTS = projects as P[]

/** Two counter-scrolling rows of project renderings from their portfolio. */
export function ProjectMarquee() {
  const half = Math.ceil(PROJECTS.length / 2)
  const rows = [PROJECTS.slice(0, half), PROJECTS.slice(half)]
  return (
    <div className="space-y-4" aria-hidden>
      {rows.map((r, i) => (
        <div key={i} className="mq" style={{ ['--mq-s' as string]: `${r.length * 4.2}s` }}>
          <div className={`mq-track ${i ? 'rev' : ''}`}>
            {[0, 1].map((k) => (
              <ul key={k} className="mq-row gap-4 pr-4">
                {r.map((p) => (
                  <li key={p.img} className="relative h-[220px] w-[180px] shrink-0 overflow-hidden rounded-md bg-panel sm:h-[300px] sm:w-[240px]">
                    <img src={asset('projects/' + p.img)} alt="" width={p.w} height={p.h} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/95 via-night/60 to-transparent p-3 pt-10">
                      <p className="text-[0.86rem] font-semibold leading-tight text-white">{p.name}</p>
                      <p className="mt-0.5 text-[0.74rem] leading-tight text-ice/70">{p.dev}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
