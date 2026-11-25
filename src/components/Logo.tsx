import { asset } from '../lib/env'

/** Their logo, re-traced to vector from logo-large.png (capitalfireandsecurity.ca). `tone` picks the white or brand-blue file. */
export function Logo({ tone = 'white', className = '' }: { tone?: 'white' | 'blue'; className?: string }) {
  return (
    <img
      src={asset(tone === 'white' ? 'brand/capital-logo-white.svg' : 'brand/capital-logo.svg')}
      width={940} height={919} alt="Capital Fire & Security Inc."
      className={`block w-auto ${className}`} draggable={false}
    />
  )
}
