import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'
import { pages } from './seo.js'

// Used only at build time by scripts/prerender.js: renders each page to HTML ahead of time,
// with the same components and router setup as src/main.jsx.

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

// Every page in src/seo.js ('' is the home page)
export const paths = Object.keys(pages)

// The page's HTML, e.g. render('services')
export const render = (path) =>
  renderToString(
    <StrictMode>
      <StaticRouter basename={basename} location={`${basename}/${path}`}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
