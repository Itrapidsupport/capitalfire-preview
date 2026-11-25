// Bake the hero poster from the live 3D scene: node qa/bake-poster.cjs <base> <out.png>
const { chromium } = require('playwright')
;(async () => {
  const base = (process.argv[2] || 'http://localhost:4180/capitalfire-preview/').replace(/\/?$/, '/')
  const out = process.argv[3] || '/tmp/poster.png'
  const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 4 })
  await p.goto(base + '?bake', { waitUntil: 'networkidle' })
  await p.waitForSelector('[data-hero3d="3d"]', { timeout: 20000 })
  await p.click('button[aria-label="Integrated security"]')
  await p.waitForTimeout(2500)
  await p.addStyleTag({ content: 'body *{visibility:hidden!important} [data-hero3d],[data-hero3d] *{visibility:visible!important}' })
  await p.waitForTimeout(300)
  await p.locator('[data-hero3d]').screenshot({ path: out })
  await b.close()
  console.log('baked', out)
})()
