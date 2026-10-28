// Runs after `vite build`: puts each page's content, rendered ahead of time by React
// (src/entry-server.jsx), into that page's HTML file in dist/. Visitors then see the page
// straight away instead of a blank screen while the JavaScript loads, and React takes the
// HTML over in the browser (hydrateRoot in src/main.jsx). 404.html stays empty on purpose.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const server = resolve('dist-ssr', 'entry-server.js')
const { paths, render } = await import(pathToFileURL(server).href)

const EMPTY_ROOT = '<div id="root"></div>'

for (const path of paths) {
  const file = resolve('dist', `${path || 'index'}.html`)
  const html = readFileSync(file, 'utf8')
  if (!html.includes(EMPTY_ROOT)) throw new Error(`No empty <div id="root"> in ${file}`)
  // data-page records which page this HTML is, so the browser only reuses it on that page
  writeFileSync(file, html.replace(EMPTY_ROOT, `<div id="root" data-page="${path}">${render(path)}</div>`))
  console.log(`pre-rendered /${path}`)
}

// The server build was only needed for this step
rmSync(resolve('dist-ssr'), { recursive: true, force: true })
