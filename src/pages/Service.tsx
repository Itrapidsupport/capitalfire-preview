import { Link, useParams } from 'react-router-dom'
import Img from '../components/Img'
import { Arrow, LayerIcon } from '../components/Icons'
import { BrandMarquee, CtaBand, PageHero } from '../components/ui'
import { SERVICES, SITE } from '../data/site'
import NotFound from './NotFound'

const BAND: Record<string, string> = { cctv: 'hero-tower', 'access-control': 'lobby', 'fire-life-safety': 'construction', 'enterphone-intercom': 'lobby', 'smart-buildings': 'elevator', 'integrated-security': 'service', 'automatic-door-operators': 'lobby', '24-7-service': 'hero-tower' }

export default function Service() {
  const { slug } = useParams()
  const i = SERVICES.findIndex((s) => s.slug === slug)
  if (i < 0) return <NotFound />
  const s = SERVICES[i]
  const next = SERVICES[(i + 1) % SERVICES.length]
  return (
    <>
      <PageHero kicker={s.short} layer={s.layer} title={s.title} img={s.img} lede={s.lead}>
        <div className="mt-9 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
          <Link to="/contact" className="btn btn-primary">Request an estimate <Arrow /></Link>
          <a href={SITE.phoneHref} className="btn btn-line">24/7 line {SITE.phone}</a>
        </div>
      </PageHero>
      {s.intro ? (
        <section className="bg-night pt-24 sm:pt-32">
          <div className="wrap">
            {s.intro.map((p, k) => (
              <p key={k} data-lit={k === 0 ? '' : undefined} className={k === 0 ? 'max-w-[30ch] text-[clamp(1.6rem,3.4vw,2.8rem)] font-bold leading-[1.12] tracking-[-0.02em] font-display' : 'body rv mt-8 max-w-[64ch] text-[1.1rem]'}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}
      <section className="bg-night py-28 sm:py-40">
        <div className="wrap grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {s.groups.map((g, k) => (
            <div key={g.title} className="rv border-t border-white/15 pt-7" style={{ ['--d' as string]: `${(k % 3) * 80}ms` }}>
              <h2 data-nosplit className="text-[1.4rem] font-bold leading-tight tracking-[-0.015em] text-white font-display">{g.title}</h2>
              {g.note ? <p className="body mt-3">{g.note}</p> : null}
              {g.items.length ? (
                <ul className="mt-5 space-y-3">
                  {g.items.map((it) => <li key={it} className="tick-li body">{it}</li>)}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>
      {s.extra?.map((x, k) => (
        <section key={x.title} className={`${k % 2 ? 'bg-night' : 'bg-deep'} py-20 sm:py-28`}>
          <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className={x.img ? 'lg:col-span-6' : 'lg:col-span-8'}>
              <p className="kicker rv"><LayerIcon layer={s.layer} className="h-5 w-5" />{s.short}</p>
              <h2 className="d-md mt-4 text-[clamp(2rem,4vw,3.2rem)]">{x.title}</h2>
              {x.body ? <p className="body rv mt-6 max-w-[60ch] text-[1.08rem]">{x.body}</p> : null}
              {x.items ? (
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {x.items.map((it) => <li key={it} className="rv tick-li body">{it}</li>)}
                </ul>
              ) : null}
            </div>
            {x.img ? <Img id={x.img} alt={x.imgAlt ?? ''} sizes="(max-width: 1023px) 92vw, 46vw" className="aspect-[4/3] rounded-lg lg:col-span-6" /> : null}
          </div>
        </section>
      ))}
      {s.brands.length ? (
        <section className="bg-night py-20 sm:py-24" aria-labelledby="b-h">
          <div className="wrap mb-10">
            <p className="kicker rv">Our brands</p>
            <h2 id="b-h" data-nosplit className="mt-4 max-w-[40ch] text-[clamp(1.3rem,2.2vw,1.8rem)] font-bold leading-snug font-display">Capital Fire & Security Inc. only installs products from industry-leading manufacturers.</h2>
          </div>
          <BrandMarquee list={s.brands.length < 8 ? [...s.brands, ...s.brands] : s.brands} speed={s.brands.length * 4} />
        </section>
      ) : null}
      <section data-open className="grain relative isolate flex min-h-[80svh] items-end overflow-hidden bg-night" aria-label="Doing what we do best">
        <Img id={BAND[s.slug] ?? 'hero-tower'} alt="" sizes="(max-width: 899px) 220vw, 112vw" className="absolute inset-0 -z-20" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,12,23,.2)_0%,rgba(5,12,23,.9)_100%)]" />
        <div className="wrap pb-16 sm:pb-24">
          <h2 className="d-xl max-w-[15ch] text-[clamp(2.8rem,8vw,8rem)]">Doing what we do best, protecting your building.</h2>
        </div>
      </section>
      <section className="border-t border-white/10 bg-night">
        <Link to={`/services/${next.slug}`} className="wrap group flex items-center justify-between gap-6 py-14 sm:py-20">
          <span>
            <span className="text-sm font-semibold text-mute">Next service</span>
            <span className="mt-3 block font-display text-[clamp(2.4rem,7vw,6.4rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-white transition-colors group-hover:text-signal">{next.short}</span>
          </span>
          <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/25 text-xl transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-signal group-hover:bg-signal group-hover:text-night sm:h-20 sm:w-20">→</span>
        </Link>
      </section>
      <CtaBand />
    </>
  )
}
