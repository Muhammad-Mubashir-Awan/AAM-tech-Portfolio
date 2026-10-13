import { Link } from 'react-router-dom'
import { asset, company, services, whatsappLink } from '../data.js'
import { useProjectModal } from './ProjectModal.jsx'

// Small line icons for the round buttons under the logo
const ICONS = {
  Email: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
  WhatsApp: (
    <path d="M5 19l1.2-3.6A7.5 7.5 0 1 1 9 18.3zM9.5 9.5c0 2.8 2.2 5 5 5l1-1.4-1.8-.9-.8.8a3.6 3.6 0 0 1-1.9-1.9l.8-.8-.9-1.8z" />
  ),
  GitHub: (
    <path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.4 6-6.6a5 5 0 0 0-1.4-3.6 4.7 4.7 0 0 0-.1-3.6s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.4 0C6.1 1.1 5 1.4 5 1.4a4.7 4.7 0 0 0-.1 3.6 5 5 0 0 0-1.4 3.6c0 5.2 3 6.3 6 6.6a3 3 0 0 0-.9 2.4V21" />
  ),
  LinkedIn: <path d="M4 9h3.5v11H4zM5.75 4.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zM10.5 9H14v1.6c.6-1 1.8-1.9 3.5-1.9 3 0 3.5 2 3.5 4.6V20h-3.5v-5.6c0-1.3-.1-2.6-1.7-2.6s-1.8 1.2-1.8 2.5V20h-3.5z" />,
  Instagram: <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17.5 6.5v.01" />,
}

const companyLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/work', label: 'Our Work' },
  { to: '/#team', label: 'Meet the team' },
  { to: '/#recent-work', label: 'Recent projects' },
]

export default function Footer() {
  const openProjectForm = useProjectModal()

  // Email and WhatsApp always; the social pages only once their link is set in data.js
  const buttons = [
    { label: 'Email', href: `mailto:${company.email}` },
    { label: 'WhatsApp', href: whatsappLink('home') },
    ...company.socials.filter((s) => s.href),
  ]

  const backToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <p className="footer__kicker">Building what comes next</p>
            <h2 className="footer__headline">
              Modern design. Clean code.
              <span>Websites that grow your business.</span>
            </h2>
          </div>
          <button type="button" className="btn footer__cta" onClick={openProjectForm}>
            Start a project <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="nav__logo" aria-label={company.name}>
              <img className="nav__mark nav__mark--dark" src={asset('logo-mark-dark.png')} alt="" />
              <img className="nav__mark nav__mark--light" src={asset('logo-mark-light.png')} alt="" />
              <span className="nav__word">Technology</span>
            </Link>
            <p>
              {company.name} designs and builds fast, modern websites and web apps that help
              businesses, startups and organizations grow online.
            </p>
            <ul className="footer__icons">
              {buttons.map((b) => (
                <li key={b.label}>
                  <a
                    href={b.href}
                    aria-label={b.label}
                    title={b.label}
                    {...(b.label === 'Email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[b.label]}</svg>
                  </a>
                </li>
              ))}
            </ul>
            <p className="footer__private">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6zM9 12l2 2 4-4" /></svg>
              Your details stay private.
            </p>
          </div>

          <nav className="footer__col" aria-label="Services">
            <h3>Services</h3>
            <ul>
              {services.map((s) => (
                <li key={s.title}><Link to="/#services">{s.title}</Link></li>
              ))}
            </ul>
          </nav>

          <nav className="footer__col" aria-label="Company">
            <h3>Company</h3>
            <ul>
              {companyLinks.map((l) => (
                <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h3>Get in touch</h3>
            <ul>
              <li><button type="button" onClick={openProjectForm}>Start a project</button></li>
              <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><a href={whatsappLink('home')} target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>
              <li className="footer__muted">{company.location}</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
            <span className="footer__tagline"> · {company.tagline}</span>
          </p>
          <button type="button" className="footer__top-btn" onClick={backToTop}>
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
