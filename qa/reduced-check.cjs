const { webkit, devices } = require('/Users/jessica/hermes-workspace/outbound/arthex-condominiums-site/app/node_modules/playwright')
;(async () => {
  const b = await webkit.launch(); const ctx = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const p = await ctx.newPage(); const res = {}
  for (const r of ['', 'services/']) {
    await p.goto('https://itrapidsupport.github.io/capitalfire-preview/' + r, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)
    res[r || 'home'] = await p.evaluate(() => ({ cls: document.documentElement.className, canvas: !!document.querySelector('canvas'), hidden: [...document.querySelectorAll('main h1,main h2,main h3,main p,main li,main img')].filter((e) => +getComputedStyle(e).opacity < 0.9 || getComputedStyle(e).clipPath.startsWith('inset(100')).length, mqAnim: getComputedStyle(document.querySelector('.ax-mq-track')).animationName }))
  }
  console.log(JSON.stringify(res)); await b.close()
})()
