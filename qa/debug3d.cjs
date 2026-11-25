const { chromium, webkit, devices } = require('playwright')
;(async () => {
  const which = process.argv[2] || 'chromium'
  const args = which === 'chromium' ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] : []
  const b = await (which === 'chromium' ? chromium : webkit).launch({ args })
  const ctx = await b.newContext(which === 'chromium' ? { viewport: { width: 1440, height: 900 } } : { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } })
  const p = await ctx.newPage()
  p.on('console', (m) => console.log('console', m.type(), m.text().slice(0, 200)))
  p.on('pageerror', (e) => console.log('pageerror', e.message))
  await p.goto(process.argv[3] || 'http://localhost:4180/capitalfire-preview/', { waitUntil: 'networkidle' })
  for (let i = 0; i < 6; i++) {
    await p.waitForTimeout(1000)
    const s = await p.evaluate(() => {
      const c = document.createElement('canvas')
      const gl = c.getContext('webgl2') || c.getContext('webgl')
      const dbg = gl && gl.getExtension('WEBGL_debug_renderer_info')
      return { hero: [...document.querySelectorAll('[data-hero3d]')].map((e) => e.getAttribute('data-hero3d')), canvases: document.querySelectorAll('canvas').length, gl: !!gl, renderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : null, hc: navigator.hardwareConcurrency, rs: document.readyState }
    })
    console.log(i, JSON.stringify(s))
  }
  await p.screenshot({ path: process.argv[4] || '/tmp/cf-3d.png' })
  await b.close()
})()
