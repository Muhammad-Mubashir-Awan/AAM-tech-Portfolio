// Each page's title and description. The build (vite.config.js) writes them into that page's
// HTML file, so Google and link previews see the right ones; usePageTitle() sets the tab title.
// The key is the page's address ('' is the home page).

export const SITE_URL = 'https://muhammad-mubashir-awan.github.io/AAM-tech-Portfolio/'
export const SITE_NAME = 'AAM Technology'
export const HOME_TITLE = 'AAM Technology — Websites & Digital Solutions'

export const pages = {
  '': {
    title: HOME_TITLE,
    description: 'AAM Technology builds modern, responsive websites and digital solutions for businesses, startups, and organizations.',
  },
  services: {
    name: 'Services',
    description: "Website design, web development, e-commerce, custom web apps, redesigns and SEO. See what's included and how we work, from first call to launch.",
  },
  work: {
    name: 'Our Work',
    description: 'A selection of websites and web apps designed and built by AAM Technology for businesses and organizations.',
  },
  pricing: {
    name: 'Pricing',
    description: 'Simple website packages with honest prices: Starter from Rs 100k, Business from Rs 300k and custom builds, plus answers to common questions.',
  },
  about: {
    name: 'About Us',
    description: 'Meet the team behind AAM Technology: a small, focused team building fast, modern websites and web apps that help businesses grow.',
  },
  contact: {
    name: 'Contact Us',
    description: 'Start a project, chat on WhatsApp, book a free call or ask for a free website audit. AAM Technology replies within 24 hours.',
  },
  privacy: {
    name: 'Privacy policy',
    description: 'How AAM Technology handles the information you share through this website: forms, WhatsApp, analytics and cookies.',
  },
}

// "Services" -> "Services — AAM Technology"; no name -> the home page title
export const pageTitle = (name) => (name ? `${name} — ${SITE_NAME}` : HOME_TITLE)
