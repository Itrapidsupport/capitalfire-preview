// Prerender: after `vite build` (client) + `vite build --ssr src/entry-server.tsx` (dist-ssr), write
// dist/<route>/index.html for every route with full markup + that route's head (title, description,
// canonical, OG, JSON-LD), plus dist/404.html. Preview only: refuses to build without noindex.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = join(dirname(fileURLToPath(import.meta.url)), '..')
const root = join(app, 'dist')
const ssr = await import(join(app, 'dist-ssr', 'entry-server.js'))
const shell = readFileSync(join(root, 'index.html'), 'utf8')
if (!/name="robots" content="noindex/.test(shell)) throw new Error('noindex meta missing, refusing to build preview')

const page = async (path) => {
  const html = await ssr.render(path)
  if (!html || html.length < 500) throw new Error(`prerender produced no markup for ${path}`)
  return shell.replace(/<!--SEO:START-->[\s\S]*?<!--SEO:END-->/, ssr.headHtml(path)).replace('<!--app-->', html)
}
let n = 0
for (const p of ssr.ROUTES) {
  const out = p === '/' ? join(root, 'index.html') : join(root, p.slice(1), 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, await page(p))
  n++
}
writeFileSync(join(root, '404.html'), await page('/404-not-found'))
if (!existsSync(join(root, '.nojekyll'))) writeFileSync(join(root, '.nojekyll'), '')
writeFileSync(join(root, 'routes.json'), JSON.stringify(ssr.ROUTES, null, 1))
// Guard: no Zeitwerk carry-over and no invented-claim markers in shipped files.
const BANNED = /zeitwerk|Nauman|lorem ipsum|arthex|IT Rapid/i
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]))
for (const f of walk(root).filter((f) => /\.(html|txt|json|js|css)$/.test(f))) {
  const m = readFileSync(f, 'utf8').match(BANNED)
  if (m) throw new Error(`banned string "${m[0]}" in ${f}`)
}
rmSync(join(app, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerender: ${n} routes + 404.html with full markup`)
