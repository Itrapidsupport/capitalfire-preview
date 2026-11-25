import { useState } from 'react'
import { CtaBand, PageHero } from '../components/ui'
import { JOBS, SITE } from '../data/site'
import { Arrow } from '../components/Icons'

export default function Careers() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <>
      <PageHero kicker="Careers" title="Join a team that protects buildings." img="careers" position="50% 35%"
        lede="Capital Fire & Security Inc. has rapidly grown and established itself as a leader in fire life safety and building security systems. We are always looking for exceptional people to join our team." />
      <section className="bg-night py-24 sm:py-32">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="kicker rv">Working here</p>
            <p className="body rv mt-5 text-[1.06rem]">Capital Fire & Security Inc. is a fast-paced and results-driven organization. We encourage our staff to achieve their personal career goals, and work with them to find a healthy balance between work and life.</p>
            <p className="body rv mt-5 text-[1.06rem]">Capital Fire & Security Inc. is an equal opportunity employer, offering competitive salaries and benefits. Join our team and fulfill all your career objectives with us.</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="d-md text-[clamp(2rem,4vw,3.2rem)]">Currently hiring.</h2>
            <ul className="mt-10 border-t border-white/12">
              {JOBS.map((j, i) => {
                const on = open === i
                return (
                  <li key={j.t} className="rv border-b border-white/12">
                    <h3>
                      <button type="button" aria-expanded={on} aria-controls={`job-${i}`} onClick={() => setOpen(on ? null : i)} className="flex w-full items-center justify-between gap-6 py-7 text-left">
                        <span>
                          <span className="block text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold leading-tight tracking-[-0.02em] text-white font-display">{j.t}</span>
                          <span className="mt-1.5 block text-sm font-semibold text-signal">{j.type}</span>
                        </span>
                        <span aria-hidden className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 text-xl transition-transform duration-500 ${on ? 'rotate-45' : ''}`}>+</span>
                      </button>
                    </h3>
                    <div id={`job-${i}`} hidden={!on} className="pb-10">
                      {j.lead ? <p className="body mb-6 max-w-[64ch]">{j.lead}</p> : null}
                      <div className="grid gap-10 md:grid-cols-2">
                        <div>
                          <h4 className="font-semibold text-white">{i === 0 ? 'Primary responsibilities' : 'Example of duties (but not limited to)'}</h4>
                          <ul className="mt-4 space-y-2.5">{j.resp.map((r) => <li key={r} className="tick-li body text-[0.96rem]">{r}</li>)}</ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Qualifications</h4>
                          <ul className="mt-4 space-y-2.5">{j.qual.map((r) => <li key={r} className="tick-li body text-[0.96rem]">{r}</li>)}</ul>
                        </div>
                      </div>
                      <a href={`mailto:${SITE.email}?subject=${encodeURIComponent('Application: ' + j.t)}`} className="btn btn-primary mt-9">Apply by email <Arrow /></a>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
