import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Preview only: GitHub Pages project site https://itrapidsupport.github.io/capitalfire-preview/ (noindex).
const base = process.env.VITE_BASE ?? '/capitalfire-preview/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // tiny shared runtime helpers (used by lenis AND drei) must not drag the three chunk into the entry
          if (id.includes('\0') || /runtime\/helpers|@babel\/runtime|@oxc-project/.test(id)) return 'react'
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three'
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) return 'motion'
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'react'
        },
      },
    },
  },
})
