import { useState, type FormEvent } from 'react'
import { PageHero } from '../components/ui'
import { INTERESTS, SITE } from '../data/site'
import { Arrow } from '../components/Icons'

/** Estimate request: preview only. Nothing is sent from this site; submitting opens the visitor's own email app. */
function EstimateForm() {
  const [done, setDone] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const need = ['name', 'email', 'phone']
    const miss = need.filter((k) => !String(f.get(k) ?? '').trim())
    if (miss.length) { setErr('Add your name, email and telephone so the team can reach you.'); return }
    setErr(null)
    const lines = [
      `Name: ${f.get('name')}`, `Company/organization: ${f.get('company') || ''}`, `Email: ${f.get('email')}`, `Telephone: ${f.get('phone')}`,
      `City: ${f.get('city') || ''}`, `Postal code: ${f.get('postal') || ''}`, `Interested in: ${f.getAll('interest').join(', ')}`, '', String(f.get('details') || ''),
    ]
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Project estimate request')}&body=${encodeURIComponent(lines.join('\n'))}`
    setDone(true)
  }
  return (
    <form onSubmit={submit} noValidate action="#estimate" className="rounded-lg border border-white/12 bg-deep p-6 sm:p-10" aria-labelledby="est-h">
      <h2 id="est-h" data-nosplit className="text-[clamp(1.6rem,3vw,2.3rem)] font-bold leading-tight tracking-[-0.02em] font-display">Project estimates</h2>
      <p className="body mt-3">Please complete the form below and one of our team members will contact you. Let us show you how Capital Fire & Security Inc. can help you achieve all your security goals.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {[
          { n: 'name', l: 'Full name', t: 'text', a: 'name', r: true },
          { n: 'company', l: 'Company/organization', t: 'text', a: 'organization' },
          { n: 'email', l: 'Email', t: 'email', a: 'email', r: true },
          { n: 'phone', l: 'Telephone', t: 'tel', a: 'tel', r: true },
          { n: 'city', l: 'City', t: 'text', a: 'address-level2' },
          { n: 'postal', l: 'Postal code', t: 'text', a: 'postal-code' },
        ].map((x) => (
          <label key={x.n} className="block">
            <span className="mb-2 block text-sm font-semibold text-ice/85">{x.l}{x.r ? <span className="text-signal"> *</span> : null}</span>
            <input name={x.n} type={x.t} autoComplete={x.a} required={x.r} className="field" />
          </label>
        ))}
      </div>
      <fieldset className="mt-7">
        <legend className="mb-3 text-sm font-semibold text-ice/85">I’m interested in</legend>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <label key={i} className="relative cursor-pointer">
              <input type="checkbox" name="interest" value={i} className="peer sr-only" />
              <span className="inline-flex min-h-[42px] items-center rounded-full border border-white/20 px-4 text-[0.9rem] text-ice/85 transition-colors peer-checked:border-signal peer-checked:bg-signal peer-checked:text-night peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-signal">{i}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="mt-7 block">
        <span className="mb-2 block text-sm font-semibold text-ice/85">Additional details</span>
        <textarea name="details" rows={5} className="field min-h-[140px] resize-y" />
      </label>
      {err ? <p role="alert" className="mt-5 text-[0.95rem] font-semibold text-alarm">{err}</p> : null}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary">Send estimate request <Arrow /></button>
        <p className="text-sm text-mute">Opens your email app with the details filled in.</p>
      </div>
      {done ? <p role="status" className="mt-6 rounded-md border border-signal/40 bg-signal/10 p-4 text-[0.95rem]">Your email app should open with the request ready to send. If it didn’t, email <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a> or call <a className="underline" href={SITE.phoneHref}>{SITE.phone}</a>.</p> : null}
    </form>
  )
}

export default function Contact() {
  return (
    <>
      <PageHero kicker="We’re here to help" title="Talk to Capital Fire & Security." img="lobby" position="50% 50%"
        lede="Complete, state-of-the-art fire life safety and security system solutions including design, installation, maintenance, training and software support." />
      <section className="bg-night py-20 sm:py-28" id="estimate">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="rv rounded-lg border border-alarm/40 bg-alarm/[0.07] p-6 sm:p-8">
              <p className="flex items-center gap-3 text-sm font-semibold text-ice/85"><span className="live-dot" />24 hour service line, 7 days a week</p>
              <a href={SITE.phoneHref} className="mt-3 block text-[clamp(2.2rem,5vw,3.2rem)] font-semibold leading-none tracking-[-0.03em] text-white font-display">{SITE.phone}</a>
            </div>
            <dl className="mt-10 space-y-7">
              <div className="rv">
                <dt className="text-sm font-semibold text-mute">Office</dt>
                <dd className="mt-2 text-[1.1rem] leading-relaxed text-white">{SITE.legal}<br />{SITE.street}<br />{SITE.city}, {SITE.region} {SITE.postal}</dd>
                <dd className="mt-3"><a href={SITE.mapsHref} target="_blank" rel="noopener noreferrer" className="link-u font-semibold text-signal">Open in Google Maps ↗</a></dd>
              </div>
              <div className="rv">
                <dt className="text-sm font-semibold text-mute">Email</dt>
                <dd className="mt-2"><a href={`mailto:${SITE.email}`} className="link-u break-all text-[1.1rem] text-white">{SITE.email}</a></dd>
                <dd className="mt-1 text-sm text-mute">{SITE.officeHours}</dd>
              </div>
              <div className="rv">
                <dt className="text-sm font-semibold text-mute">Fax</dt>
                <dd className="mt-2 text-[1.1rem] text-white">{SITE.fax}</dd>
              </div>
            </dl>
          </div>
          <div className="rv lg:col-span-7"><EstimateForm /></div>
        </div>
      </section>
    </>
  )
}
