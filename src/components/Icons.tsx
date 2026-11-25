import type { ReactElement } from 'react'
export const Arrow = () => <span aria-hidden className="arr">→</span>

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

/** Line glyphs for each system layer (same vocabulary as the 3D hero legend). */
export function LayerIcon({ layer, className = 'h-6 w-6' }: { layer: string; className?: string }) {
  const p: Record<string, ReactElement> = {
    cctv: <><path {...S} d="M3 8.5l12-4 2.2 6.6-12 4z" /><path {...S} d="M17 9.6l3.4-1.1v5.2l-2.3.8" /><path {...S} d="M7.6 14.6L9 19H4" /></>,
    access: <><rect {...S} x="6" y="3" width="12" height="18" rx="2" /><circle {...S} cx="12" cy="10" r="2.6" /><path {...S} d="M9.5 16.5h5" /></>,
    fire: <><path {...S} d="M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.7 3.3-5.4 3.9-9.4 2.7 1.6 4.3 4 4.4 6.4 1-.8 1.6-2 1.7-3.1 1.9 1.6 3 3.7 3 6.1 0 3.5-2.6 6.1-6.5 6.1z" /></>,
    intercom: <><rect {...S} x="5" y="2.5" width="14" height="19" rx="2" /><rect {...S} x="8" y="5.5" width="8" height="5" rx="1" /><path {...S} d="M9 14h.01M12 14h.01M15 14h.01M9 17h.01M12 17h.01M15 17h.01" /></>,
    smart: <><rect {...S} x="7" y="2.5" width="10" height="19" rx="2" /><circle {...S} cx="12" cy="8" r="1.6" /><path {...S} d="M12 12.5v4" /><path {...S} d="M3.5 7.5a9 9 0 0 1 0 9M20.5 7.5a9 9 0 0 1 0 9" /></>,
    integrated: <><circle {...S} cx="12" cy="12" r="2.4" /><circle {...S} cx="4.5" cy="5" r="1.6" /><circle {...S} cx="19.5" cy="5" r="1.6" /><circle {...S} cx="4.5" cy="19" r="1.6" /><circle {...S} cx="19.5" cy="19" r="1.6" /><path {...S} d="M5.7 6.2l4.5 4.2M18.3 6.2l-4.5 4.2M5.7 17.8l4.5-4.2M18.3 17.8l-4.5-4.2" /></>,
    doors: <><path {...S} d="M4 21V3h16v18" /><path {...S} d="M12 3v18" /><path {...S} d="M9 12l-2 0M15 12h2" /><path {...S} d="M2 21h20" /></>,
    service: <><circle {...S} cx="12" cy="12" r="9" /><path {...S} d="M12 7v5l3.2 2" /></>,
  }
  return <svg viewBox="0 0 24 24" className={className} aria-hidden>{p[layer] ?? p.integrated}</svg>
}
