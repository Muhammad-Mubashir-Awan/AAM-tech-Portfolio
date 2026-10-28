import { Link } from 'react-router-dom'
import { asset, company, services, whatsappLink } from '../data.js'
import { useProjectModal } from './ProjectModal.jsx'
import { Button } from '@/components/ui/button'
import BookCallLink from './BookCall.jsx'

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
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Our Work' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/pricing#faq', label: 'FAQs' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
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

  const mono = "[font-family:ui-monospace,'SFMono-Regular',Consolas,monospace]"
  const colTitle = `${mono} mb-[1.1rem] text-[0.72rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase`
  const colLink = 'cursor-pointer border-0 bg-transparent p-0 text-left text-foreground opacity-85 transition-[color,opacity] [overflow-wrap:anywhere] hover:text-pine-600 hover:opacity-100'
  const icon = 'fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] stroke-[1.7]'

  return (
    <footer className="relative z-[1] border-t border-border bg-background/60 pt-18 pb-8 text-[0.92rem]">
      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6 pb-12">
          <div>
            <p className="eyebrow mb-[0.9rem]">Building what comes next</p>
            <h2 className="m-0 text-[clamp(1.8rem,4vw,2.9rem)] leading-[1.12]">
              Modern design. Clean code.
              <span className="text-gradient block">Websites that grow your business.</span>
            </h2>
          </div>
          <Button onClick={openProjectForm} className="text-[0.85rem] tracking-[0.04em] uppercase">
            Start a project <span data-arrow aria-hidden="true">→</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border py-12 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          <div className="col-span-full lg:col-span-1">
            <Link to="/" aria-label={company.name} className="flex items-center gap-2.5">
              <img className="h-[30px] w-auto" src={asset('logo-mark-light.png')} alt="" />
              <span className="text-[0.85rem] font-semibold tracking-[0.32em] uppercase">Technology</span>
            </Link>
            <p className="mt-[1.1rem] mb-[1.4rem] max-w-90 leading-relaxed">
              {company.name} designs and builds fast, modern websites and web apps that help
              businesses, startups and organizations grow online.
            </p>
            <ul className="flex flex-wrap gap-2.5">
              {buttons.map((b) => (
                <li key={b.label}>
                  <a
                    href={b.href}
                    aria-label={b.label}
                    title={b.label}
                    className="grid size-[38px] place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-pine-600"
                    {...(b.label === 'Email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className={`size-[17px] ${icon}`}>{ICONS[b.label]}</svg>
                  </a>
                </li>
              ))}
            </ul>
            <p className={`${mono} mt-5 mb-0 flex items-center gap-[0.45rem] text-[0.75rem]`}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className={`size-[15px] flex-none text-emerald-500 ${icon}`}>
                <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6zM9 12l2 2 4-4" />
              </svg>
              Your details stay private.
            </p>
          </div>

          <nav aria-label="Services">
            <h3 className={colTitle}>Services</h3>
            <ul className="grid gap-[0.7rem]">
              {services.map((s) => (
                <li key={s.title}><Link to="/services" className={colLink}>{s.title}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className={colTitle}>Company</h3>
            <ul className="grid gap-[0.7rem]">
              {companyLinks.map((l) => (
                <li key={l.label}><Link to={l.to} className={colLink}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>

          <div className="col-span-full sm:col-span-1">
            <h3 className={colTitle}>Get in touch</h3>
            <ul className="grid gap-[0.7rem]">
              <li><button type="button" onClick={openProjectForm} className={colLink}>Start a project</button></li>
              <li><BookCallLink className={colLink}>Book a free call</BookCallLink></li>
              <li><a href={`mailto:${company.email}`} className={colLink}>{company.email}</a></li>
              <li><a href={whatsappLink('home')} target="_blank" rel="noopener noreferrer" className={colLink}>WhatsApp us</a></li>
              <li className="text-muted-foreground">{company.location}</li>
            </ul>
          </div>
        </div>

        <div className={`${mono} flex flex-wrap items-center justify-between gap-4 border-t border-border pt-[1.6rem] text-[0.75rem] text-muted-foreground`}>
          <p className="m-0">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
            <span className="opacity-75"> · {company.tagline}</span>
          </p>
          <button
            type="button"
            onClick={backToTop}
            className="group/top inline-flex cursor-pointer gap-1.5 rounded-full border border-border bg-transparent px-3.5 py-[0.45rem] text-foreground transition-colors hover:border-primary"
          >
            Back to top <span aria-hidden="true" className="transition-transform duration-200 group-hover/top:-translate-y-[3px] motion-reduce:transition-none">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
