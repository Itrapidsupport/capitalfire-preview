import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { canonical, seoFor } from '../data/seo'

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = value
}

/** Keeps <head> in sync on client-side navigation (prerendered HTML already carries it). robots stays noindex. */
export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const e = seoFor(pathname)
    document.title = e.title
    setMeta('name', 'description', e.description)
    setMeta('property', 'og:title', e.title)
    setMeta('property', 'og:description', e.description)
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (e.path === '/404') link?.remove()
    else {
      if (!link) link = Object.assign(document.createElement('link'), { rel: 'canonical' })
      document.head.appendChild(link)
      link.href = canonical(pathname)
    }
    const ld = document.head.querySelector('script[type="application/ld+json"]')
    if (e.jsonld) {
      const s = ld ?? document.head.appendChild(Object.assign(document.createElement('script'), { type: 'application/ld+json' }))
      s.textContent = JSON.stringify(e.jsonld)
    } else ld?.remove()
  }, [pathname])
  return null
}
