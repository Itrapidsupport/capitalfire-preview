import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Hero3D from '../hero3d/Hero3D'
import { LAYERS, type Layer } from '../hero3d/layers'
import Img from '../components/Img'
import { Arrow, LayerIcon } from '../components/Icons'
import { BrandMarquee, CtaBand, ProjectMarquee, SectionHead, PROJECTS } from '../components/ui'
import { ABOUT, SERVICES, SITE } from '../data/site'
import { prefersReduced } from '../motion/env'

const LAYER_COPY: Record<Layer, { t: string; b: string }> = {
  cctv: { t: 'CCTV', b: 'Complete camera surveillance to protect your property from theft and vandalism.' },
  access: { t: 'Access control', b: 'Only users with granted credentials get in, with a record of when and where.' },
  fire: { t: 'Fire life safety', b: 'Inspections, verifications and ULC fire alarm monitoring, floor by floor.' },
  intercom: { t: 'Enterphone and intercom', b: 'Positive identification and access at the entry door.' },
  smart: { t: 'Smart locks', b: 'Wire-free networked electronic locking for every suite.' },
  doors: { t: 'Door operators', b: 'Automatic door operators that meet accessibility standards.' },
  integrated: { t: 'Integrated security', b: 'Every layer joined into one robust, remotely accessible platform.' },
}

function HeroHud({ cur, setCur, paused }: { cur: number; setCur: (i: number) => void; paused: boolean }) {
  const l = LAYERS[cur]
  return (
    <div className="pointer-events-auto w-full max-w-[420px] rounded-lg border border-white/12 bg-night/75 p-4 backdrop-blur-md sm:p-5">
      <div className="flex items-center justify-between gap-3 text-[0.8rem] font-semibold text-mute">
        <span className="flex items-center gap-2"><span className={`live-dot ${l === 'fire' ? '' : 'blue'}`} />System layer {cur + 1} of {LAYERS.length}</span>
        <span>{paused ? 'Selected' : 'Cycling'}</span>
      </div>
      <div className="mt-3 flex items-start gap-3" aria-live="polite">
        <LayerIcon layer={l} className={`mt-0.5 h-7 w-7 shrink-0 ${l === 'fire' ? 'text-alarm' : 'text-signal'}`} />
        <div className="min-w-0">
          <p className="text-[1.15rem] font-bold leading-tight text-white font-display">{LAYER_COPY[l].t}</p>
          <p className="mt-1 text-[0.92rem] leading-snug text-ice/75">{LAYER_COPY[l].b}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5" role="group" aria-label="Show a system layer">
        {LAYERS.map((k, i) => (
          <button key={k} type="button" onClick={() => setCur(i)} aria-label={LAYER_COPY[k].t} aria-pressed={i === cur}
            className="group relative h-11 rounded-sm">
            <span className={`absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full ${i === cur ? 'bg-white/25' : 'bg-white/12 group-hover:bg-white/30'}`}>
              {i === cur ? <span key={cur + (paused ? 'p' : '')} className={`absolute inset-y-0 left-0 rounded-full ${k === 'fire' ? 'bg-alarm' : 'bg-signal'}`} style={{ width: paused ? '100%' : undefined, animation: paused ? undefined : 'cf-bar 3.2s linear both' }} /> : null}
            </span>
          </button>
        ))}
      </div>
      <style>{'@keyframes cf-bar{from{width:0}to{width:100%}}'}</style>
    </div>
  )
}

function Hero() {
  const [cur, setCurRaw] = useState(0)
  const [paused, setPaused] = useState(false)
  const layer = useRef<Layer>('cctv')
  const resume = useRef(0)
  layer.current = LAYERS[cur]
  const setCur = (i: number) => {
    setCurRaw(i); setPaused(true)
    window.clearTimeout(resume.current)
    resume.current = window.setTimeout(() => setPaused(false), 9000)
  }
  useEffect(() => {
    if (paused || prefersReduced()) return
    const id = window.setInterval(() => setCurRaw((c) => (c + 1) % LAYERS.length), 3200)
    return () => window.clearInterval(id)
  }, [paused])
  useEffect(() => () => window.clearTimeout(resume.current), [])
  // scroll choreography: copy drifts up and dims, the model pushes in as the hero leaves
  useEffect(() => {
    if (prefersReduced()) return
    let tl: { kill: () => void } | null = null
    import('../motion/gsap').then(({ gsap }) => {
      const sec = document.querySelector('[data-hero]')
      if (!sec) return
      const t = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: 0.6 } })
      t.to('[data-hero-copy]', { yPercent: -18, opacity: 0.15, ease: 'none' }, 0)
      t.to('[data-hero-model]', { yPercent: 10, ease: 'none' }, 0)
      tl = t
    })
    return () => { tl?.kill() }
  }, [])

  return (
    <section data-hero className="relative isolate flex flex-col overflow-hidden bg-night min-[900px]:grid min-[900px]:min-h-[max(100svh,780px)] min-[900px]:grid-rows-[1fr_auto_auto_1fr]" aria-labelledby="hero-h">
      <div aria-hidden className="grid-bg absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(90%_70%_at_30%_40%,#000,transparent)]" />
      <div data-hero-copy className="wrap pointer-events-none relative z-10 min-[900px]:row-start-2">
        <div className="pointer-events-auto pt-[calc(var(--cf-header-h)+2rem)] min-[900px]:w-[54%] min-[900px]:pt-[calc(var(--cf-header-h)+2rem)]">
          <p className="kicker"><span className="live-dot" />24/7 service, {SITE.phone}</p>
          <h1 id="hero-h" className="hero-h d-xl mt-6 text-[clamp(3.5rem,9.6vw,9.5rem)]">Protecting your building.</h1>
          <p className="mt-5 text-[clamp(1.3rem,2.4vw,2rem)] font-semibold leading-tight text-ice/90 font-display">Doing what we do best.</p>
        </div>
      </div>
      {/* one live model: between headline and copy on phones, filling the right side on desktop */}
      <div data-hero-model className="relative mt-2 min-[900px]:absolute min-[900px]:inset-y-0 min-[900px]:right-0 min-[900px]:mt-0 min-[900px]:w-[60%]">
        <div className="relative h-[min(118vw,68svh)] min-[900px]:absolute min-[900px]:inset-0 min-[900px]:h-auto">
          <Hero3D layer={layer} className="absolute inset-0" sizes="(max-width: 899px) 100vw, 60vw" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-night to-transparent min-[900px]:h-32" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-night to-transparent min-[900px]:block" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-night to-transparent" />
        </div>
        <div className="relative z-10 -mt-16 px-[clamp(20px,4.2vw,48px)] min-[900px]:absolute min-[900px]:bottom-10 min-[900px]:right-[max(48px,calc((100vw-1320px)/2+48px))] min-[900px]:mt-0 min-[900px]:p-0">
          <HeroHud cur={cur} setCur={setCur} paused={paused} />
        </div>
      </div>
      <div className="wrap pointer-events-none relative z-10 min-[900px]:row-start-3">
        <div className="pointer-events-auto pb-20 pt-10 min-[900px]:w-[54%] min-[900px]:pb-24 min-[900px]:pt-0">
          <p className="lede max-w-[46ch] min-[900px]:mt-6">Industry leading integration, products and services. Fire life safety and building security systems for low-rise to multi-building, high-rise complexes.</p>
          <div className="mt-9 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
            <Link to="/contact" className="btn btn-primary">Request an estimate <Arrow /></Link>
            <Link to="/services" className="btn btn-line">Explore services</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceList() {
  const [hover, setHover] = useState<string | null>(null)
  const prev = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = prev.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0
    const mv = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY }
    const tick = () => { x += (tx - x) * 0.14; y += (ty - y) * 0.14; el.style.transform = `translate3d(${x + 28}px, ${y - 120}px, 0)`; raf = requestAnimationFrame(tick) }
    window.addEventListener('pointermove', mv, { passive: true }); raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('pointermove', mv); cancelAnimationFrame(raf) }
  }, [])
  return (
    <section className="relative bg-night py-28 sm:py-40" aria-labelledby="svc-h">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead kicker="Products and services" title={<span id="svc-h">Every system a building runs on, from one contractor.</span>} />
          <p className="body rv max-w-[42ch]">Complete, state-of-the-art fire life safety and security system solutions including design, installation, maintenance, training and software support.</p>
        </div>
        <ul className="mt-16 border-t border-white/12" onMouseLeave={() => setHover(null)}>
          {SERVICES.map((s, i) => (
            <li key={s.slug} className="rv border-b border-white/12" style={{ ['--d' as string]: `${(i % 4) * 60}ms` }} onMouseEnter={() => setHover(s.img)}>
              <Link to={`/services/${s.slug}`} className="svc-row group grid gap-5 py-7 sm:py-9 md:grid-cols-[minmax(0,5fr)_minmax(0,5fr)_auto] md:items-center md:gap-10">
                <Img id={s.img} alt="" sizes="(max-width: 767px) 92vw, 1px" reveal={false} className="aspect-[16/9] rounded-md md:hidden" />
                <span className="flex items-center gap-4">
                  <LayerIcon layer={s.layer} className={`h-7 w-7 shrink-0 ${s.layer === 'fire' ? 'text-alarm' : 'text-signal'}`} />
                  <span className="font-display text-[clamp(1.8rem,3.6vw,3.2rem)] font-semibold leading-[1] tracking-[-0.025em] text-white transition-colors group-hover:text-signal">{s.short}</span>
                </span>
                <span className="body max-w-[52ch] text-[0.98rem]">{s.card}</span>
                <span aria-hidden className="hidden h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-signal group-hover:bg-signal group-hover:text-night md:grid">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* cursor-follow preview (desktop pointer only) */}
      <div ref={prev} aria-hidden className="pointer-events-none fixed left-0 top-0 z-30 hidden w-[340px] md:block" style={{ transform: 'translate3d(-999px,-999px,0)' }}>
        {SERVICES.map((s) => (
          <div key={s.img} className={`absolute inset-x-0 top-0 aspect-[4/3] overflow-hidden rounded-md transition-[opacity,scale] duration-500 ${hover === s.img ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
            <Img id={s.img} alt="" sizes="340px" reveal={false} className="h-full w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}

function Why() {
  const facts = [
    { k: '90 years', v: 'of combined experience, supported by exceptional service.' },
    { k: 'Thousands', v: 'of security and fire alarm projects, from low-rise to multi-building, high-rise complexes.' },
    { k: '25+ years', v: 'as a listed ULC authorized monitoring provider.' },
    { k: '24/7', v: 'emergency security and fire alarm service, 7 days a week.' },
  ]
  return (
    <section className="on-light relative bg-paper py-28 text-ink sm:py-40" aria-labelledby="why-h">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="kicker rv">Why choose Capital Fire & Security Inc.</p>
            <h2 id="why-h" className="d-md mt-4 text-[clamp(2rem,4.2vw,3.4rem)] text-ink">Highly-trained professionals with a proven track record.</h2>
            <p className="body rv mt-7 max-w-[52ch]">{ABOUT.p3}</p>
            <Link to="/about" className="btn btn-line rv mt-9">About our company <Arrow /></Link>
          </div>
        </div>
        <div className="lg:col-span-7">
          <Img id="construction" alt="High-rise tower under construction at dusk with a tower crane" sizes="(max-width: 1023px) 92vw, 56vw" className="aspect-[16/10] rounded-lg" />
          <dl className="mt-12 border-t border-ink/15">
            {facts.map((f, i) => (
              <div key={f.k} className="rv grid gap-2 border-b border-ink/15 py-7 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-baseline sm:gap-8" style={{ ['--d' as string]: `${i * 70}ms` }}>
                <dt className="text-[clamp(2.1rem,3.6vw,3.2rem)] font-semibold leading-none tracking-[-0.035em] text-blue font-display">{f.k}</dt>
                <dd className="text-[1.05rem] leading-relaxed text-ink-mute">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="relative overflow-hidden bg-night py-28 sm:py-40" aria-labelledby="proc-h">
      <div className="wrap">
        <SectionHead kicker="Our process" title={<span id="proc-h">In the best hands from start to finish.</span>} />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          <span aria-hidden className="draw absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-signal via-signal/60 to-alarm md:block" />
          {ABOUT.process.map((s, i) => (
            <li key={s.t} className="rv relative pl-16 md:pl-0" style={{ ['--d' as string]: `${i * 120}ms` }}>
              <span className="absolute left-0 top-0 grid h-11 w-11 place-items-center rounded-full border border-signal/60 bg-night text-sm font-bold text-signal md:relative">{String(i + 1).padStart(2, '0')}</span>
              {i < 3 ? <span aria-hidden className="absolute bottom-[-2.5rem] left-[21px] top-12 w-px bg-white/15 md:hidden" /> : null}
              <h3 className="text-[1.5rem] font-bold tracking-[-0.015em] text-white font-display md:mt-7">{s.t}</h3>
              <p className="body mt-3 max-w-[34ch]">{s.b}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Band() {
  return (
    <section data-open className="grain relative isolate flex min-h-[92svh] items-end overflow-hidden bg-night" aria-label="Your needs don't rest">
      <Img id="hero-tower" alt="Condominium tower at dusk with a dome security camera under the entrance canopy" sizes="(max-width: 899px) 220vw, 112vw" className="absolute inset-0 -z-20" position="50% 60%" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,12,23,.25)_0%,rgba(5,12,23,.1)_40%,rgba(5,12,23,.92)_100%)]" />
      <div className="wrap pb-16 sm:pb-24">
        <p className="kicker rv"><span className="live-dot" />24/7 service</p>
        <h2 className="d-xl mt-6 max-w-[14ch] text-[clamp(3rem,8.6vw,8.6rem)]">Your needs don’t rest. Neither do we.</h2>
        <div className="rv mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="body max-w-[46ch] text-[1.08rem]">The experience and industry expertise necessary to offer 24/7 security solutions for any kind of building and business.</p>
          <a href={SITE.phoneHref} className="btn btn-primary self-start sm:self-auto">Call {SITE.phone}</a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <section className="relative bg-night py-28 sm:py-44" aria-label="Who we are">
        <div className="wrap">
          <p className="kicker rv">Capital Fire & Security Inc.</p>
          <p data-lit className="mt-10 max-w-[22ch] font-display text-[clamp(2.1rem,5.4vw,5.2rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            We specialize in all aspects related to fire life safety and building security systems, with complete, comprehensive solutions for all your integrated security needs.
          </p>
          <p className="body rv mt-10 max-w-[60ch]">We are a registered member of the Canadian Fire Alarm Association and the Canadian Security Association, and we work collaboratively with developers, owners, property managers, general contractors and engineers.</p>
        </div>
      </section>
      <ServiceList />
      <Band />
      <Why />
      <Process />
      <section className="relative bg-night pb-24 pt-8 sm:pb-32" aria-labelledby="proj-h">
        <div className="wrap mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead kicker="Portfolio" title={<span id="proj-h">Proud to work with some of the best names in development.</span>} />
          <Link to="/projects" className="btn btn-line rv self-start lg:self-auto">See all {PROJECTS.length} projects <Arrow /></Link>
        </div>
        <ProjectMarquee />
      </section>
      <section className="bg-night pb-24 sm:pb-28" aria-labelledby="brands-h">
        <div className="wrap mb-10">
          <p className="kicker rv">Our brands</p>
          <h2 id="brands-h" className="d-md mt-4 max-w-[30ch] text-[clamp(1.6rem,3vw,2.4rem)]">We only install products from industry-leading manufacturers.</h2>
          <p className="body rv mt-5 max-w-[60ch]">Our relationships with these manufacturers allow us to design a system that meets your specific requirements and budget.</p>
        </div>
        <BrandMarquee />
      </section>
      <CtaBand />
    </>
  )
}
