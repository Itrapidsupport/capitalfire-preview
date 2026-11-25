import { Link } from 'react-router-dom'
import { SITE } from '../data/site'

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[86svh] items-center overflow-hidden bg-night">
      <div aria-hidden className="grid-bg absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_50%,#000,transparent)]" />
      <div className="wrap pt-[var(--cf-header-h)]">
        <p className="kicker"><span className="live-dot" />Error 404</p>
        <h1 className="d-xl mt-6 text-[clamp(3rem,9vw,7rem)]">No access to this door.</h1>
        <p className="lede mt-6 max-w-[48ch]">The page you asked for isn’t here. It may have moved when the site was rebuilt.</p>
        <div className="mt-9 flex flex-col gap-3 min-[480px]:flex-row">
          <Link to="/" className="btn btn-primary">Back to home</Link>
          <a href={SITE.phoneHref} className="btn btn-line">Call {SITE.phone}</a>
        </div>
      </div>
    </section>
  )
}
