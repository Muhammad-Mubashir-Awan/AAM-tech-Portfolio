// All site content lives here — edit this file to update the portfolio.

// Files in /public live under the site's base path ('/AAM-tech-Portfolio/' on GitHub Pages)
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')

export const company = {
  name: 'AAM Technology',
  tagline: 'We build digital experiences that grow businesses.',
  intro:
    'AAM Technology is a technology and software development company helping businesses, startups, and organizations build a strong digital presence with modern, responsive, and user-friendly websites.',
  email: 'am.pk.tech@gmail.com',
  // Contact form delivery via Formspree (the part after formspree.io/f/).
  // If this is left empty, "Send message" opens the visitor's email app instead.
  formspreeId: 'mjygblwl',
  // Country code + number, digits only (no +, spaces or leading 0)
  whatsapp: '923192663398',
  // CallMeBot API key: when set, each contact-form message also sends a short WhatsApp alert
  // to the number above. Leave empty to switch the alert off. (Key is visible in the site code.)
  callmebotKey: '',
  // Pre-filled WhatsApp greeting, picked by the page the visitor is on (client can edit it before sending)
  whatsappMessages: {
    home: "Hi AAM Technology! 👋 I found you through your website and I'd love to chat about a project I have in mind.",
    work: "Hi AAM Technology! 👋 I just saw your work on your website — I'd love something like that for my business. Can we talk?",
    about: "Hi AAM Technology! 👋 I was reading about your team on your website and I'd love to chat about a project.",
    contact: "Hi AAM Technology! 👋 I'm on your website's contact page and I'd love to talk about a project. When's a good time?",
  },
  location: 'Remote — working with clients worldwide',
  // Office location for the map on the Contact page. The map stays hidden until address or mapEmbed is set.
  address: '', // e.g. 'Street, City, Country' — shown on the page and used for the map if mapEmbed is empty
  mapEmbed: '', // Google Maps → Share → "Embed a map" → the src="https://www.google.com/maps/embed?pb=…" link
  mapLink: '', // Any Google Maps link to your place (e.g. https://maps.app.goo.gl/…) for the "Open in Google Maps" button
  // Paste each page's link between the quotes. Empty ones are hidden from the footer.
  socials: [
    { label: 'GitHub', href: '' },
    { label: 'LinkedIn', href: '' },
    { label: 'Instagram', href: '' },
  ],
}

const whatsappText = (page) => company.whatsappMessages[page] || company.whatsappMessages.home

// Opens a WhatsApp chat with the page's greeting pre-filled
// (the app on iPhone if installed; WhatsApp desktop or WhatsApp Web on computers)
export const whatsappLink = (page = 'home') =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(whatsappText(page))}`

// Android: opens the WhatsApp app directly, or the Play Store when it isn't installed
export const whatsappAndroidLink = (page = 'home') =>
  `intent://send?phone=${company.whatsapp}&text=${encodeURIComponent(whatsappText(page))}` +
  `#Intent;scheme=whatsapp;S.browser_fallback_url=${encodeURIComponent(
    'https://play.google.com/store/apps/details?id=com.whatsapp',
  )};end`

export const stats = [
  { value: '100%', label: 'Responsive builds' },
  { value: '24h', label: 'Response time' },
  { value: 'End-to-end', label: 'Design to launch' },
]

export const services = [
  {
    icon: '◧',
    title: 'Website Design',
    text: 'Clean, modern interfaces designed around your brand and your customers — beautiful on every screen size.',
  },
  {
    icon: '⌘',
    title: 'Web Development',
    text: 'Fast, accessible, SEO-friendly websites built with modern tools like React, so they load quickly and rank well.',
  },
  {
    icon: '◎',
    title: 'E-commerce',
    text: 'Online stores with smooth checkout, product management, and payment integration that turn visitors into buyers.',
  },
  {
    icon: '⟳',
    title: 'Redesign & Maintenance',
    text: 'Give an outdated site a fresh look, improve performance, and keep everything secure and up to date.',
  },
  {
    icon: '▤',
    title: 'Custom Web Apps',
    text: 'Dashboards, booking systems, and internal tools tailored to the way your business actually works.',
  },
  {
    icon: '↗',
    title: 'SEO & Performance',
    text: 'Technical SEO, Core Web Vitals tuning, and analytics setup so you can measure and grow your traffic.',
  },
]

// TODO: replace these sample projects with your real work.
// `link` is the live website (https://…). Leave it empty and "View project" is hidden.
export const projects = [
  {
    title: 'Bloom Café',
    category: 'Restaurant website',
    text: 'A warm, mobile-first site with an online menu, table booking, and Google Maps integration.',
    tags: ['React', 'Responsive', 'SEO'],
    gradient: 'linear-gradient(135deg, #ff9a8b, #ff6a88)',
    link: '',
  },
  {
    title: 'Nova Store',
    category: 'E-commerce',
    text: 'A fast online storefront with product filtering, cart, and secure checkout.',
    tags: ['E-commerce', 'Payments', 'Performance'],
    gradient: 'linear-gradient(135deg, #6d5dfc, #36c2f6)',
    link: '',
  },
  {
    title: 'Peak Fitness',
    category: 'Business landing page',
    text: 'A high-converting landing page with class schedules and membership sign-up.',
    tags: ['Landing page', 'Animations', 'Forms'],
    gradient: 'linear-gradient(135deg, #34d399, #0ea5e9)',
    link: '',
  },
  {
    title: 'Clarity Dashboard',
    category: 'Web application',
    text: 'An internal analytics dashboard that turns raw business data into clear charts.',
    tags: ['Web app', 'Charts', 'Dashboard'],
    gradient: 'linear-gradient(135deg, #f7b733, #fc4a1a)',
    link: '',
  },
]

export const process = [
  { step: '01', icon: '◎', title: 'Discover', text: 'We learn about your business, goals, audience, and what success looks like.' },
  { step: '02', icon: '◧', title: 'Design', text: 'We create the layout and visual style, and refine it with your feedback.' },
  { step: '03', icon: '⌘', title: 'Develop', text: 'We build a fast, responsive, accessible site with clean, maintainable code.' },
  { step: '04', icon: '↗', title: 'Launch & Support', text: 'We deploy, test across devices, and stay on hand for updates and growth.' },
]

// About page. TODO: rewrite the story and mission in your own words.
export const about = {
  story: [
    'AAM Technology started with a simple idea: every business deserves a website that works as hard as they do. Too many small companies were stuck with slow, outdated sites — or no site at all.',
    'Today we design and build websites and web apps for businesses, startups, and organizations around the world. We keep things personal: you talk directly to the people building your project, from the first call to launch day and beyond.',
  ],
  mission:
    'To give every client a fast, beautiful, and easy-to-manage online presence that brings in real customers — with honest pricing and no technical headaches.',
  highlights: [
    { value: 'Worldwide', label: 'Remote clients' },
    { value: '24h', label: 'Reply time' },
    { value: '100%', label: 'Custom builds' },
  ],
}

// Photos live in the `public` folder. `role` and `bio` are optional and only shown when set.
export const team = [
  // TODO: rewrite these placeholder descriptions in your own words
  {
    name: 'Muhammad Mubashir',
    photo: '/mubashir.webp',
    bio: 'Part of the AAM Technology team, bringing creative ideas and clean code together to deliver standout digital experiences for clients worldwide.',
  },
  {
    name: 'Abdal Niazi',
    photo: '/abdal.webp',
    bio: 'Part of the AAM Technology team, focused on building reliable, well-crafted web experiences for clients around the world.',
  },
]

export const values = [
  { icon: '▣', title: 'Mobile-first', text: 'Responsive design that looks sharp on every phone, tablet, and desktop.' },
  { icon: '{ }', title: 'Clean code', text: 'Well-structured, maintainable code that is easy to grow later.' },
  { icon: '◈', title: 'Transparent pricing', text: 'Clear quotes and timelines up front — no surprises.' },
  { icon: '⟳', title: 'Ongoing support', text: 'We stay on hand after launch for updates and improvements.' },
]
