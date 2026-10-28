import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { pages, pageTitle, SITE_URL } from './src/seo.js'

// Text placed inside an HTML attribute or tag
const esc = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Gives a copy of index.html a page's own title, description and address, so Google and
// link previews don't treat every page as a copy of the home page
const withPageTags = (html, { title, description, url }) =>
  html
    .replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)

// GitHub Pages serves the site from /<repo>/, so the build needs that base path.
// `npm run preview` uses it too, so it serves dist/ exactly like GitHub Pages.
// Dev keeps / so the local dev server works as before.
// `npm run build` makes two builds: the site itself, then a server build of
// src/entry-server.jsx that scripts/prerender.js uses to fill each page's HTML.
export default defineConfig(({ command, isPreview, isSsrBuild }) => ({
  base: command === 'build' || isPreview ? '/AAM-tech-Portfolio/' : '/',
  // '@/...' imports point at src/ (used by the shadcn components)
  resolve: { alias: { '@': resolve('src') } },
  // The server build bundles its packages too, so it runs in Node without extra setup
  ssr: { noExternal: true },
  plugins: [
    react(),
    tailwindcss(),
    !isSsrBuild && {
      // GitHub Pages has no rewrites, so a refresh on /work would return 404. work.html etc.
      // (one per page listed in src/seo.js) make the real pages load with a proper 200 status,
      // each with its own tags; 404.html catches any other address.
      name: 'github-pages-spa-fallback',
      closeBundle() {
        const shell = readFileSync(resolve('dist', 'index.html'), 'utf8')
        for (const [path, page] of Object.entries(pages)) {
          if (!path) continue // index.html already carries the home page's tags
          const tags = { title: pageTitle(page.name), description: page.description, url: SITE_URL + path }
          writeFileSync(resolve('dist', `${path}.html`), withPageTags(shell, tags))
        }
        // Served with a 404 status for unknown addresses: kept out of Google's index
        const notFound = withPageTags(shell, { title: pageTitle('Page not found'), description: pages[''].description, url: SITE_URL })
          .replace(/\s*<link rel="canonical"[^>]*>/, '')
          .replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>')
        writeFileSync(resolve('dist', '404.html'), notFound)
      },
    },
  ],
}))
