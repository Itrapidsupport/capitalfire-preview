import { Link } from 'react-router-dom'
import Img from '../components/Img'
import { LayerIcon } from '../components/Icons'
import { CtaBand, PageHero } from '../components/ui'
import { SERVICES } from '../data/site'

export default function Services() {
  return (
    <>
      <PageHero kicker="Products and services" title="Every system your building runs on." img="lobby" position="50% 60%"
        lede="Industry leading integration, products and services. Complete, state-of-the-art fire life safety and security system solutions including design, installation, maintenance, training and software support." />
      <section className="bg-night py-28 sm:py-40">
        <ul className="wrap space-y-24 sm:space-y-36">
          {SERVICES.map((s, i) => (
            <li key={s.slug}>
              <Link to={`/services/${s.slug}`} className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                <div className={`relative lg:col-span-7 ${i % 2 ? 'lg:order-2' : ''}`}>
                  <Img id={s.img} alt={s.imgAlt} sizes="(max-width: 1023px) 96vw, 62vw" className="aspect-[16/10] rounded-lg" imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]" />
                  <span className={`absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-md bg-night/80 backdrop-blur ${s.layer === 'fire' ? 'text-alarm' : 'text-signal'}`}><LayerIcon layer={s.layer} /></span>
                </div>
                <div className={`lg:col-span-5 ${i % 2 ? 'lg:order-1' : ''}`}>
                  <p className="kicker rv">{s.layer === 'service' ? 'Around the clock' : 'Products and services'}</p>
                  <h2 className="d-lg mt-4 text-[clamp(2.2rem,4.6vw,4.2rem)] transition-colors group-hover:text-signal">{s.short}</h2>
                  <p className="body rv mt-5 max-w-[46ch] text-[1.08rem]">{s.card}</p>
                  <span className="rv mt-8 inline-flex items-center gap-3 font-semibold text-white">
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-white/25 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-signal group-hover:bg-signal group-hover:text-night">→</span>
                    View service
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  )
}
