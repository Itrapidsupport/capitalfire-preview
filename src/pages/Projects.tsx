import { useMemo, useState } from 'react'
import { CtaBand, PageHero, PROJECTS } from '../components/ui'
import { SECTORS } from '../data/site'
import { asset } from '../lib/env'

export default function Projects() {
  const devs = useMemo(() => {
    const c = new Map<string, number>()
    PROJECTS.forEach((p) => c.set(p.dev, (c.get(p.dev) ?? 0) + 1))
    return [...c.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]).map(([d]) => d)
  }, [])
  const [dev, setDev] = useState<string | null>(null)
  const list = dev ? PROJECTS.filter((p) => p.dev === dev) : PROJECTS
  return (
    <>
      <PageHero kicker="Portfolio" title="Some of the best names in development." img="construction" position="50% 55%"
        lede="Capital Fire & Security Inc. is proud to work with some of the best names in development and property management. We pride ourselves in continuing to build relationships and perform with high quality standards of work." />
      <section className="bg-night py-20 sm:py-28" aria-labelledby="pl-h">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 id="pl-h" className="d-md text-[clamp(1.9rem,4vw,3.2rem)]">High-rise residential and new development.</h2>
            <p className="text-sm font-semibold text-mute" aria-live="polite">{list.length} of {PROJECTS.length} projects</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by developer">
            {[null, ...devs].map((d) => (
              <button key={d ?? 'all'} type="button" aria-pressed={dev === d} onClick={() => setDev(d)}
                className={`min-h-[40px] rounded-full border px-4 text-[0.9rem] font-medium transition-colors ${dev === d ? 'border-signal bg-signal text-night' : 'border-white/20 text-ice/80 hover:border-white/50'}`}>
                {d ?? 'All developers'}
              </button>
            ))}
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {list.map((p) => (
              <li key={p.img} className="group relative aspect-[4/5] overflow-hidden rounded-md bg-panel">
                <img src={asset('projects/' + p.img)} alt={`${p.name}, ${p.dev}`} width={p.w} height={p.h} loading="lazy" decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night via-night/75 to-transparent p-3 pt-14 sm:p-4 sm:pt-16">
                  <p className="text-[0.92rem] font-bold leading-tight text-white font-display sm:text-[1.02rem]">{p.name}</p>
                  <p className="mt-1 text-[0.78rem] leading-tight text-ice/70 sm:text-[0.85rem]">{p.dev}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="on-light bg-paper py-24 text-ink sm:py-32" data-open aria-labelledby="sec-h">
        <div className="wrap">
          <p className="kicker rv">Industries</p>
          <h2 id="sec-h" className="d-md mt-4 max-w-[22ch] text-[clamp(2rem,4vw,3.2rem)] text-ink">High-rise residential, new development, commercial, institutional, retail, government, educational, industrial and hospitality.</h2>
          <div className="mt-16 grid gap-px overflow-hidden rounded-lg bg-ink/12 md:grid-cols-2">
            {SECTORS.map((s, i) => (
              <article key={s.t} className="rv bg-paper p-7 sm:p-10" style={{ ['--d' as string]: `${(i % 2) * 90}ms` }}>
                <h3 className="text-[1.45rem] font-bold leading-tight tracking-[-0.015em] text-ink font-display">{s.t}</h3>
                <p className="body mt-4">{s.b}</p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {s.items.map((it) => <li key={it} className="tick-li body text-[0.96rem]">{it}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
