import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import App from './App'
import { SEO, headHtml } from './data/seo'

export { headHtml }
export const ROUTES = SEO.map((e) => e.path)

/** Full markup for `url`. */
export async function render(url: string): Promise<string> {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const tree = () => (
    <StaticRouter location={base + url} basename={base}>
      <App />
    </StaticRouter>
  )
  const { prelude } = await prerender(tree(), { progressiveChunkSize: Number.MAX_SAFE_INTEGER })
  return await new Response(prelude).text()
}
