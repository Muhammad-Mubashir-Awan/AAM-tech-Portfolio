import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The site's routes (see src/App.jsx), other than the home page
const PAGES = ['about', 'work', 'contact', 'services', 'pricing']

// GitHub Pages serves the site from /<repo>/, so the build needs that base path.
// `npm run preview` uses it too, so it serves dist/ exactly like GitHub Pages.
// Dev keeps / so the local dev server works as before.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/AAM-tech-Portfolio/' : '/',
  // '@/...' imports point at src/ (used by the shadcn components)
  resolve: { alias: { '@': resolve('src') } },
  plugins: [
    react(),
    tailwindcss(),
    {
      // GitHub Pages has no rewrites, so a refresh on /work would return 404.
      // work.html etc. make the real pages load with a proper 200 status (so Google
      // indexes them and link previews work); 404.html catches any other URL.
      name: 'github-pages-spa-fallback',
      closeBundle() {
        for (const page of [...PAGES, '404']) {
          copyFileSync(resolve('dist', 'index.html'), resolve('dist', `${page}.html`))
        }
      },
    },
  ],
}))
