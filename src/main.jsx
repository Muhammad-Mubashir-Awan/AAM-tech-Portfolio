import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/tailwind.css'

// BASE_URL is '/' in dev and '/AAM-tech-Portfolio/' on GitHub Pages
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Built pages arrive with their HTML already inside #root (scripts/prerender.js), so React
// takes it over. Anything else (the dev server, 404.html, or a host that answers an unknown
// address with another page's HTML) is drawn from scratch.
const page = window.location.pathname.slice(basename.length).replace(/^\/|\/$/g, '')
if (root.dataset.page === page) {
  hydrateRoot(root, app)
} else {
  root.replaceChildren()
  createRoot(root).render(app)
}
