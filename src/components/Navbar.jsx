import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { asset, company } from '../data.js'
import { useProjectModal } from './ProjectModal.jsx'

// Section links point at the home page, so they work from any page
const links = [
  { to: '/#services', label: 'Services' },
]

// Links to their own pages, highlighted while you're on them
const pages = [
  { to: '/about', label: 'About Us' },
  { to: '/work', label: 'Our Work' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const openProjectForm = useProjectModal()

  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the phone menu on any page change (including the browser's Back button)
  useEffect(() => setOpen(false), [pathname, hash, key])

  // ...and when Escape is pressed
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__logo" aria-label={company.name} onClick={() => setOpen(false)}>
          <img className="nav__mark nav__mark--dark" src={asset('logo-mark-dark.png')} alt="" />
          <img className="nav__mark nav__mark--light" src={asset('logo-mark-light.png')} alt="" />
          <span className="nav__word">Technology</span>
        </Link>

        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>

        <nav className={`nav__links ${open ? 'is-open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : undefined)} onClick={() => setOpen(false)}>
            Home
          </NavLink>
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {pages.map((p) => (
            <NavLink
              key={p.to}
              to={p.to}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              onClick={() => setOpen(false)}
            >
              {p.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="btn btn--small nav__cta--menu"
            onClick={() => {
              setOpen(false)
              openProjectForm()
            }}
          >
            Contact Us
          </button>
        </nav>
        <button type="button" className="btn btn--small nav__cta--bar" onClick={openProjectForm}>Contact Us</button>
      </div>
    </header>
  )
}
