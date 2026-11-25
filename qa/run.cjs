// Playwright QA. Usage: node qa/run.cjs [--url https://itrapidsupport.github.io/capitalfire-preview/] [--out dir]
// Per route x device (Chrome 1440x900 desktop, WebKit iPhone 390x844): HTTP 200, horizontal overflow (ignoring
// elements clipped by an overflow-hidden ancestor), overlapping text, broken images, console/page errors,
// noindex, one h1, header logo crisp (>=2x), axe WCAG A/AA (desktop). Mobile menu test on iPhone.
// Full-page screenshots -> <out>/<route>-<device>.png. Exit 1 on any failure.
const { chromium, webkit, devices } = require('playwright')
const { AxeBuilder } = require('@axe-core/playwright')
const fs = require('node:fs')
const path = require('node:path')
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null }
const OUT = arg('--out') || path.join(__dirname, 'out')
fs.mkdirSync(OUT, { recursive: true })

;(async () => {
  let base = arg('--url'), srv
  if (!base) {
    const { server, BASE } = require('../scripts/serve.cjs')
    await new Promise((r) => server.listen(4179, r)); srv = server
    base = `http://localhost:4179${BASE}`
  }
  base = base.replace(/\/?$/, '/')
  const routes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'dist', 'routes.json'), 'utf8'))
  const targets = [
    { name: 'desktop', type: chromium, launch: { channel: 'chrome' }, ctx: { viewport: { width: 1440, height: 900 } }, axe: true },
    { name: 'iphone', type: webkit, launch: {}, ctx: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }, axe: false },
  ]
  const fails = [], report = []
  for (const t of targets) {
    const browser = await t.type.launch(t.launch)
    const ctx = await browser.newContext(t.ctx)
    for (const r of [...routes, '/this-page-does-not-exist']) {
      const page = await ctx.newPage()
      const errs = []
      const nf = r.startsWith('/this-page')
      page.on('console', (m) => m.type() === 'error' && !(nf && /404/.test(m.text())) && errs.push('console: ' + m.text()))
      page.on('pageerror', (e) => errs.push('pageerror: ' + e.message))
      page.on('requestfailed', (q) => !/mailto:/.test(q.url()) && errs.push('requestfailed: ' + q.url()))
      page.on('response', (s) => s.status() >= 400 && !nf && errs.push(`http ${s.status()}: ${s.url()}`))
      const url = base + (r === '/' ? '' : r.replace(/^\//, '') + (nf ? '' : '/'))
      const resp = await page.goto(url, { waitUntil: 'networkidle' })
      const f = []
      if (!nf && resp.status() !== 200) f.push('status ' + resp.status())
      if (nf && resp.status() !== 404) f.push('404 route returned ' + resp.status())
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)) } window.scrollTo(0, 0) })
      await page.waitForTimeout(1200)
      const res = await page.evaluate(() => {
        const clipped = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'clip') return true } return false }
        const W = document.documentElement.clientWidth
        const over = [...document.querySelectorAll('body *')].filter((e) => { const b = e.getBoundingClientRect(); return b.width && (b.right > W + 1 || b.left < -1) && !clipped(e) && getComputedStyle(e).position !== 'fixed' }).map((e) => e.tagName + '.' + String(e.className).slice(0, 40))
        const vis = (e) => { const s = getComputedStyle(e); return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05 && !e.closest('[hidden],[aria-hidden="true"]') && !(e.closest('details:not([open])') && !e.closest('summary')) }
        const texts = [...document.querySelectorAll('main h1,main h2,main h3,main p,main li,main a,main dt,main dd,main label,main summary,main blockquote,main figcaption,footer p,footer a,header a')]
          .filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && vis(e))
          .flatMap((e) => { const rr = document.createRange(); rr.selectNodeContents(e); return [...rr.getClientRects()].filter((b) => b.width > 1 && b.height > 1).map((b) => ({ e, b })) })
        const overlaps = []
        for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i], c = texts[j]
          if (a.e === c.e || a.e.contains(c.e) || c.e.contains(a.e)) continue
          const ix = Math.min(a.b.right, c.b.right) - Math.max(a.b.left, c.b.left), iy = Math.min(a.b.bottom, c.b.bottom) - Math.max(a.b.top, c.b.top)
          if (ix > 4 && iy > 4 && overlaps.length < 40) overlaps.push(`${a.e.tagName}"${a.e.textContent.trim().slice(0, 25)}" x ${c.e.tagName}"${c.e.textContent.trim().slice(0, 25)}"`)
        }
        const logo = document.querySelector('header img')
        return {
          overflow: document.documentElement.scrollWidth - W, over: over.slice(0, 5), overlaps: overlaps.slice(0, 5),
          broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.currentSrc),
          noindex: !!document.querySelector('meta[name=robots][content*=noindex]'), h1: document.querySelectorAll('h1').length,
          logoRatio: logo ? logo.naturalHeight / logo.getBoundingClientRect().height : 0, title: document.title,
        }
      })
      if (res.overflow > 0 || res.over.length) f.push(`overflow-x ${res.overflow}px ${res.over.join(' | ')}`)
      if (res.overlaps.length) f.push('text overlap: ' + res.overlaps.join(' | '))
      if (res.broken.length) f.push('broken images: ' + res.broken.join(', '))
      if (!res.noindex) f.push('missing noindex')
      if (res.h1 !== 1) f.push(`h1 count ${res.h1}`)
      if (res.logoRatio < 2 * (t.name === 'iphone' ? 1.5 : 1)) f.push(`header logo not crisp (natural/rendered ${res.logoRatio.toFixed(2)})`)
      f.push(...errs)
      const slug = (r === '/' ? 'home' : nf ? '404' : r.slice(1).replace(/\//g, '_')) + '-' + t.name
      await page.screenshot({ path: path.join(OUT, slug + '.png'), fullPage: true })
      if (t.axe) {
        const ax = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
        ax.violations.forEach((v) => f.push(`axe ${v.impact} ${v.id} (${v.nodes.length}): ${v.nodes[0].target.join(' ')}`))
      }
      report.push({ device: t.name, route: r, status: resp.status(), title: res.title, fails: f })
      f.forEach((x) => fails.push(`[${t.name}] ${r}: ${x}`))
      await page.close()
    }
    if (t.name === 'iphone') {
      const page = await ctx.newPage()
      await page.goto(base, { waitUntil: 'networkidle' })
      await page.click('[aria-controls="mobile-menu"]')
      await page.waitForTimeout(900)
      const m = await page.evaluate(() => ({ visible: !document.getElementById('mobile-menu').hidden, locked: getComputedStyle(document.body).position === 'fixed', inert: document.querySelector('main').hasAttribute('inert') }))
      await page.screenshot({ path: path.join(OUT, 'menu-iphone.png') })
      await page.click('#mobile-menu a[href$="/services"]')
      await page.waitForTimeout(900)
      const nav = await page.evaluate(() => ({ path: location.pathname, closed: document.getElementById('mobile-menu').hidden, h1: document.querySelector('h1')?.textContent }))
      const mf = []
      if (!m.visible) mf.push('menu did not open')
      if (!m.locked) mf.push('scroll not locked')
      if (!m.inert) mf.push('main not inert')
      if (!/\/services\/?$/.test(nav.path) || !nav.closed) mf.push('menu link did not navigate/close: ' + JSON.stringify(nav))
      report.push({ device: 'iphone', route: 'mobile-menu', fails: mf })
      mf.forEach((x) => fails.push('[iphone] mobile-menu: ' + x))
    }
    await browser.close()
  }
  srv && srv.close()
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1))
  console.log(`QA: ${report.length} checks, ${fails.length} failures`)
  fails.forEach((x) => console.log(' FAIL', x))
  process.exit(fails.length ? 1 : 0)
})().catch((e) => { console.error(e); process.exit(2) })
