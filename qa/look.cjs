// Quick look: node qa/look.cjs <base> <outdir> [routes comma list] [devices: desktop,iphone]
// Scrolls each page top->bottom (fires reveals), then takes a viewport shot at top (hero, 3D running) + a full-page shot.
const { chromium, webkit, devices } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')
const [, , baseArg, outArg, routesArg, devArg] = process.argv
const base = (baseArg || 'http://localhost:4180/capitalfire-preview/').replace(/\/?$/, '/')
const OUT = outArg || path.join(__dirname, 'out')
fs.mkdirSync(OUT, { recursive: true })
const ROUTES = routesArg ? routesArg.split(',') : JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'dist', 'routes.json'), 'utf8'))
const DEV = (devArg || 'desktop,iphone').split(',')
const T = {
  desktop: { type: chromium, ctx: { viewport: { width: 1440, height: 900 } } },
  iphone: { type: webkit, ctx: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } } },
}
;(async () => {
  const report = []
  for (const d of DEV) {
    const browser = await T[d].type.launch()
    const ctx = await browser.newContext(T[d].ctx)
    for (const r of ROUTES) {
      const page = await ctx.newPage()
      const errs = []
      page.on('pageerror', (e) => errs.push('pageerror: ' + e.message))
      page.on('console', (m) => m.type() === 'error' && errs.push('console: ' + m.text()))
      page.on('response', (s) => s.status() >= 400 && !r.includes('does-not-exist') && errs.push(`http ${s.status()} ${s.url()}`))
      const url = base + (r === '/' ? '' : r.replace(/^\//, '') + (r.includes('does-not-exist') ? '' : '/')) + (process.env.REDUCE ? '?reduce' : '')
      const resp = await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForTimeout(r === '/' ? 3500 : 1500)
      const name = (r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '_')) + '-' + d
      await page.screenshot({ path: path.join(OUT, name + '-top.png') })
      const h = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < h; y += 500) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(90) }
      await page.waitForTimeout(900)
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600)
      const m = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth
        const over = []
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) return
          if (r.right > vw + 1 || r.left < -1) {
            let p = el.parentElement, clipped = false
            while (p && p !== document.body) { const cs = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(cs.overflowX)) { clipped = true; break } p = p.parentElement }
            if (!clipped) over.push((el.tagName + '.' + (el.className?.baseVal ?? el.className)).slice(0, 80) + ` ${Math.round(r.left)}..${Math.round(r.right)}`)
          }
        })
        const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.currentSrc)
        return { sw: document.documentElement.scrollWidth, vw, over: over.slice(0, 8), broken, h1: document.querySelectorAll('h1').length, hero3d: document.querySelector('[data-hero3d]')?.getAttribute('data-hero3d') ?? null }
      })
      await page.screenshot({ path: path.join(OUT, name + '-full.png'), fullPage: true })
      report.push({ d, r, status: resp.status(), ...m, errs })
      console.log(d, r, resp.status(), 'sw', m.sw, 'vw', m.vw, 'h1', m.h1, '3d', m.hero3d, m.over.length ? 'OVER ' + m.over.join(' | ') : '', m.broken.length ? 'BROKEN ' + m.broken.join(',') : '', errs.length ? 'ERRS ' + errs.slice(0, 3).join(' | ') : '')
      await page.close()
    }
    await browser.close()
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1))
})()
