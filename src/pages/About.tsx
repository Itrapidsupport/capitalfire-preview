import { Link } from 'react-router-dom'
import Img from '../components/Img'
import { Arrow } from '../components/Icons'
import { CtaBand, Memberships, PageHero } from '../components/ui'
import { ABOUT } from '../data/site'

export default function About() {
  return (
    <>
      <PageHero kicker="Our company" title="Put our expertise to work for you." img="hero-tower" position="50% 40%"
        lede="Doing what we do best, protecting your building. Fire life safety and building security systems, from assessment to 24-hour service." />
      <section className="bg-night py-24 sm:py-32">
        <div className="wrap">
          <p data-lit className="max-w-[26ch] text-[clamp(1.8rem,4vw,3.4rem)] font-bold leading-[1.1] tracking-[-0.025em] font-display">{ABOUT.p1}</p>
          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <p className="body rv text-[1.08rem]">{ABOUT.p2}</p>
            <p className="body rv text-[1.08rem]" style={{ ['--d' as string]: '100ms' }}>{ABOUT.p3}</p>
          </div>
        </div>
      </section>
      <section className="on-light bg-paper py-24 text-ink sm:py-28" data-open aria-labelledby="mem-h">
        <div className="wrap">
          <p className="kicker rv">Memberships</p>
          <h2 id="mem-h" className="d-md mt-4 max-w-[24ch] text-[clamp(2rem,4vw,3.2rem)] text-ink">Members of the Canadian Fire Alarm Association and the Canadian Security Association.</h2>
          <Memberships className="rv mt-12" />
          <p className="body rv mt-8 max-w-[64ch]">Capital Fire & Security Inc. has been a listed ULC authorized monitoring provider for over 25 years, with fully licensed, factory-trained and certified fire alarm technicians.</p>
        </div>
      </section>
      <section className="bg-night py-24 sm:py-32" id="process" aria-labelledby="pr-h">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker rv">Our process</p>
            <h2 id="pr-h" className="d-md mt-4 text-[clamp(2rem,4vw,3.2rem)]">With Capital Fire & Security Inc. you are in the best hands from start to finish.</h2>
            <p className="body rv mt-7">{ABOUT.p4}</p>
          </div>
          <ol className="lg:col-span-7">
            {ABOUT.process.map((s, i) => (
              <li key={s.t} className="rv grid grid-cols-[auto_minmax(0,1fr)] gap-6 border-t border-white/12 py-8" style={{ ['--d' as string]: `${i * 90}ms` }}>
                <span className="text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-none tracking-[-0.04em] text-signal/80 font-display">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-[1.5rem] font-bold text-white font-display">{s.t}</h3>
                  <p className="body mt-2">{s.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="bg-deep py-24 sm:py-32" aria-labelledby="w-h">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <Img id="service" alt="Technician with a tool bag in a service corridor at night" sizes="(max-width: 1023px) 92vw, 40vw" className="aspect-[4/5] rounded-lg max-lg:aspect-[16/10]" />
          </div>
          <div className="lg:col-span-7">
            <p className="kicker rv">What you get</p>
            <h2 id="w-h" className="d-md mt-4 text-[clamp(2rem,4vw,3.2rem)]">Your fire and security partners.</h2>
            <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {ABOUT.why.map((w, i) => <li key={w} className="rv tick-li body" style={{ ['--d' as string]: `${(i % 2) * 70}ms` }}>{w}</li>)}
            </ul>
            <Link to="/services" className="btn btn-line rv mt-10">Products and services <Arrow /></Link>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
