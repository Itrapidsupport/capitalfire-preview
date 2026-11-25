// Motion proof: node qa/motion.cjs --url <base> --out <dir>
// iPhone (WebKit 390x844 touch) + desktop (Chrome 1440x900): 4 viewport shots at different scroll depths for home + services,
// hero canvas check (poster hidden, canvas-only element shot), route-transition mid-frame, iPhone home scroll video.
const { chromium, webkit, devices } = require('playwright')
const fs = require('node:fs'), path = require('node:path')
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d }
const base = arg('--url', 'http://localhost:4179/capitalfire-preview/').replace(/\/?$/, '/')
const OUT = arg('--out', path.join(__dirname, '..', '..', 'qa-motion'))
fs.mkdirSync(OUT, { recursive: true })
const iphone = { ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }
const T = [
  { name: 'iphone', type: webkit, launch: {}, ctx: iphone },
  { name: 'desktop', type: chromium, launch: { channel: 'chrome' }, ctx: { viewport: { width: 1440, height: 900 } } },
]
const out = {}
;(async () => {
  for (const t of T) {
    const browser = await t.type.launch(t.launch)
    const ctx = await browser.newContext(t.ctx)
    const page = await ctx.newPage()
    const errs = []; page.on('pageerror', (e) => errs.push(e.message))
    await page.goto(base, { waitUntil: 'load' })
    const t0 = Date.now()
    await page.waitForSelector('[data-hero3d="3d"]', { timeout: 20000 }).catch(() => {})
    const r = { hero3dAfterMs: Date.now() - t0 }
    r.hero = await page.evaluate(() => { const h = document.querySelector('[data-hero3d]'); const c = h && h.querySelector('canvas'); return { state: h && h.dataset.hero3d, canvas: !!c, w: c && c.width, h: c && c.height, gl: !!(c && (c.getContext('webgl2') || c.getContext('webgl'))) } })
    r.mk = await page.evaluate(() => ({ ready: document.documentElement.className, splitHeadings: document.querySelectorAll('.ax-split').length, marquee: !!document.querySelector('.ax-mq-track'), progress: !!document.querySelector('.ax-progress') }))
    await page.waitForTimeout(1600)
    // canvas-only shot (poster hidden) -> pixel check in python
    await page.evaluate(() => { const i = document.querySelector('[data-hero3d] img'); if (i) i.style.visibility = 'hidden' })
    await page.locator('[data-hero3d]').screenshot({ path: path.join(OUT, `hero-canvas-only-${t.name}.png`) })
    await page.evaluate(() => { const i = document.querySelector('[data-hero3d] img'); if (i) i.style.visibility = '' })
    for (const route of ['', 'services/']) {
      if (route) { await page.goto(base + route, { waitUntil: 'load' }); await page.waitForTimeout(400) }
      const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
      const fr = [0, 0.18, 0.42, 0.72]
      for (let i = 0; i < fr.length; i++) {
        const y = Math.round(H * fr[i])
        // step-scroll so scroll-linked scenes move, then grab while reveals are mid-flight
        await page.evaluate(async (y) => { const s = scrollY, n = 12; for (let k = 1; k <= n; k++) { window.scrollTo(0, s + ((y - s) * k) / n); await new Promise((r) => setTimeout(r, 25)) } }, y)
        await page.waitForTimeout(i === 0 ? 900 : 420)
        await page.screenshot({ path: path.join(OUT, `${route ? 'services' : 'home'}-${t.name}-${i + 1}-scroll${Math.round(fr[i] * 100)}.png`) })
      }
    }
    // route transition mid-frame (client-side nav)
    await page.goto(base, { waitUntil: 'load' }); await page.waitForTimeout(800)
    await page.evaluate(() => { const a = [...document.querySelectorAll('a[href$="/about"], a[href$="/about/"]')].find((x) => x.offsetParent); a && a.click() })
    await page.waitForTimeout(260)
    await page.screenshot({ path: path.join(OUT, `route-transition-${t.name}.png`) })
    r.errors = errs
    out[t.name] = r
    await ctx.close()
    if (t.name === 'iphone') {
      const vctx = await browser.newContext({ ...iphone, recordVideo: { dir: OUT, size: { width: 390, height: 844 } } })
      const vp = await vctx.newPage()
      await vp.goto(base, { waitUntil: 'load' })
      await vp.waitForSelector('[data-hero3d="3d"]', { timeout: 20000 }).catch(() => {})
      await vp.waitForTimeout(1800)
      await vp.evaluate(async () => { const H = document.documentElement.scrollHeight - innerHeight; const end = Math.min(H, 3600); const n = 330; for (let k = 1; k <= n; k++) { window.scrollTo(0, (end * k) / n); await new Promise((r) => setTimeout(r, 16)) } })
      await vp.waitForTimeout(900)
      const vpath = await vp.video().path()
      await vctx.close()
      const dst = path.join(OUT, 'iphone-home-scroll.webm'); fs.renameSync(vpath, dst); out.video = dst
    }
    await browser.close()
  }
  fs.writeFileSync(path.join(OUT, 'motion-report.json'), JSON.stringify(out, null, 1))
  console.log(JSON.stringify(out, null, 1))
})()
