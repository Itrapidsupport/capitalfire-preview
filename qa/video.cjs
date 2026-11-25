// Phone screen recording of the home page: node qa/video.cjs <base> <out.mp4>
const { webkit, devices } = require('playwright')
const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
;(async () => {
  const base = (process.argv[2] || 'https://itrapidsupport.github.io/capitalfire-preview/').replace(/\/?$/, '/')
  const out = process.argv[3] || '/tmp/capitalfire-mobile.mp4'
  const dir = path.join(__dirname, 'out', 'video'); fs.mkdirSync(dir, { recursive: true })
  const b = await webkit.launch()
  const ctx = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, recordVideo: { dir, size: { width: 780, height: 1688 } } })
  const p = await ctx.newPage()
  await p.goto(base, { waitUntil: 'networkidle' })
  await p.waitForTimeout(4200)
  const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  // eased scroll through the page with short holds on key sections (~19 s)
  const stops = [0.07, 0.17, 0.3, 0.42, 0.55, 0.68, 0.8, 0.9, 1]
  let y = 0
  for (const s of stops) {
    const to = Math.round(H * s), from = y, steps = 70
    for (let i = 1; i <= steps; i++) {
      const t = i / steps, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      await p.evaluate((v) => window.scrollTo(0, v), Math.round(from + (to - from) * e))
      await p.waitForTimeout(16)
    }
    y = to
    await p.waitForTimeout(900)
  }
  await p.waitForTimeout(800)
  const v = p.video()
  await ctx.close(); await b.close()
  const webm = await v.path()
  const ff = process.env.FFMPEG || 'ffmpeg'
  execFileSync(ff, ['-y', '-i', webm, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-movflags', '+faststart', '-r', '30', out], { stdio: 'ignore' })
  console.log('video', out)
})()
