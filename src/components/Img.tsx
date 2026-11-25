import images from '../data/images.json'
import { asset } from '../lib/env'

type Entry = { w: number; h: number; ws: number[] }
const M = images as Record<string, Entry>
const set = (id: string, e: Entry, ext: string) => e.ws.map((w) => `${asset(`img/${id}-${w}.${ext}`)} ${w}w`).join(', ')

/** Photo with AVIF + WebP srcset; aspect reserved from images.json (no CLS). `sizes` = displayed width incl. object-cover overscan. */
export default function Img({ id, alt, sizes = '100vw', className = '', imgClassName = '', priority = false, position = '50% 50%', reveal = true }: {
  id: string; alt: string; sizes?: string; className?: string; imgClassName?: string; priority?: boolean; position?: string; reveal?: boolean
}) {
  const e = M[id]
  if (!e) throw new Error('unknown image ' + id)
  const src = asset(`img/${id}-${e.ws[Math.min(1, e.ws.length - 1)]}.webp`)
  return (
    <div className={`overflow-hidden ${reveal ? (priority ? 'ax-img ax-img-hero' : 'ax-img') : ''} ${className}`}>
      <picture>
        <source type="image/avif" srcSet={set(id, e, 'avif')} sizes={sizes} />
        <img src={src} srcSet={set(id, e, 'webp')} sizes={sizes} width={e.w} height={e.h} alt={alt}
          loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : undefined}
          className={`h-full w-full object-cover ${imgClassName}`} style={{ objectPosition: position }} />
      </picture>
    </div>
  )
}
