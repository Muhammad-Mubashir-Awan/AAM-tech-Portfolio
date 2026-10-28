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
  // Pre-filled WhatsApp greetings (the visitor can edit them before sending)
  whatsappMessages: {
    // Used by the WhatsApp links in the footer
    home: "Hi AAM Technology! 👋 I found you through your website and I'd love to chat about a project I have in mind.",
    // Used by the Contact page, the FAQ and the "Start a project" form
    contact: "Hi AAM Technology! 👋 I'd love to talk about a project with you. When's a good time?",
    // Used by "Book a free call" until a Cal.com link is set below
    call: "Hi AAM Technology! 👋 I'd like to book a free 15-minute call about my website. When are you free?",
  },
  // Cal.com booking page, e.g. 'https://cal.com/aam-technology/15min'. While empty,
  // "Book a free call" opens WhatsApp instead.
  calLink: '',
  // Google Analytics 4 measurement ID, e.g. 'G-ABC123XYZ'. While empty, no analytics or
  // cookie notice is loaded.
  gaId: 'G-HN90VM1QSG',
  location: 'Remote — working with clients worldwide',
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

// Selling points on the moving strip under the home hero (shown in capitals)
export const marquee = ['Fast', 'Responsive', 'SEO-friendly', 'Custom-built', '24h replies', 'Working worldwide']

// `includes` is the "What's included" list shown on the Services page
export const services = [
  {
    icon: '◧',
    title: 'Website Design',
    text: 'Clean, modern interfaces designed around your brand and your customers — beautiful on every screen size.',
    includes: ['Layouts designed around your brand', 'Mobile, tablet and desktop views', 'Your feedback built in before any code'],
  },
  {
    icon: '⌘',
    title: 'Web Development',
    text: 'Fast, accessible, SEO-friendly websites built with modern tools like React, so they load quickly and rank well.',
    includes: ['Hand-coded with React and Tailwind CSS', 'Contact forms and WhatsApp button', 'Tested on real phones before launch'],
  },
  {
    icon: '◎',
    title: 'E-commerce',
    text: 'Online stores with smooth checkout, product management, and payment integration that turn visitors into buyers.',
    includes: ['Product pages and smooth checkout', 'Online payments set up for you', 'Easy product and order management'],
  },
  {
    icon: '⟳',
    title: 'Redesign & Maintenance',
    text: 'Give an outdated site a fresh look, improve performance, and keep everything secure and up to date.',
    includes: ['A fresh design for an outdated site', 'Speed and security fixes', 'Monthly updates and backups'],
  },
  {
    icon: '▤',
    title: 'Custom Web Apps',
    text: 'Dashboards, booking systems, and internal tools tailored to the way your business actually works.',
    includes: ['Dashboards, bookings and internal tools', 'Built around how your team works', 'Connected to the tools you already use'],
  },
  {
    icon: '↗',
    title: 'SEO & Performance',
    text: 'Technical SEO, Core Web Vitals tuning, and analytics setup so you can measure and grow your traffic.',
    includes: ['Technical SEO and page titles', 'Faster loading on every device', 'Google Analytics so you can see results'],
  },
]

// "How we work" steps on the Services page
export const processSteps = [
  { title: 'Plan', text: 'A free call to understand your business, goals and budget. You get a clear, fixed quote and timeline.' },
  { title: 'Design', text: 'We design the key pages and share them with you. Nothing is built until you are happy with the look.' },
  { title: 'Build', text: 'We code the site, connect your forms and analytics, and test it on phones, tablets and computers.' },
  { title: 'Launch & support', text: 'We put your site live, show you how to update it, and stay on hand for changes after launch.' },
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

// ---------------------------------------------------------------------------------------
// SAMPLE CONTENT: anything marked `sample: true` is only shown on your own computer
// while running `npm run dev`, with a "Sample" tag, and is HIDDEN on the live website,
// so visitors never see made-up reviews or numbers. When you have the real thing, replace
// the text and delete `sample: true`.
// ---------------------------------------------------------------------------------------

// Counters that count up on the home page. `value` is a number; `suffix` goes after it.
export const counters = [
  // TODO: put your real figures here, then delete `sample: true`
  { value: 25, suffix: '+', label: 'Projects delivered', sample: true },
  { value: 20, suffix: '+', label: 'Happy clients', sample: true },
  { value: 5, suffix: '', label: 'Countries served', sample: true },
  { value: 24, suffix: 'h', label: 'Reply time' },
]

// Tools we build with, shown as chips under the counters
export const techStack = ['React', 'JavaScript', 'Tailwind CSS', 'shadcn/ui', 'Vite', 'Node.js', 'GitHub']

// Client logos (files in /public), e.g. { name: 'Bloom Café', logo: '/clients/bloom.svg' }.
// The logo row stays hidden while this list is empty.
export const clientLogos = []

// Client reviews, copied from our Google Business profile. Add new ones here as they come in
// (only reviews with written text work as quotes).
export const testimonials = [
  {
    quote: 'Great experience with AAM Technologies! A highly professional and talented team with excellent service and quality of work. Highly Recommended!',
    name: 'Syed Hammad Hassan',
    role: 'Google review',
    rating: 5,
  },
]

// Pricing packages. `budget` must match one of the budget choices in the project form, so the
// button opens the pop-up with that budget already selected.
export const pricing = [
  {
    name: 'Starter',
    price: 'Rs 100k',
    budget: 'Rs 100k – 300k',
    text: 'A sharp one-page or small website to get your business online fast.',
    features: ['Up to 5 pages', 'Mobile-first, responsive design', 'Contact form + WhatsApp button', 'Basic SEO setup', '1 round of revisions', '2–3 weeks delivery'],
    cta: 'Start with Starter',
  },
  {
    name: 'Business',
    price: 'Rs 300k',
    budget: 'Rs 300k – 800k',
    popular: true,
    text: 'A complete website built to win customers, with the features growing businesses need.',
    features: ['Up to 12 pages', 'Custom design & animations', 'Blog or content you can edit', 'SEO + Google Analytics', 'Speed optimisation', '1 month of support after launch'],
    cta: 'Choose Business',
  },
  {
    name: 'Custom',
    price: 'Rs 800k',
    budget: 'Rs 800k+',
    text: 'Online stores, web apps and systems tailored to how your business works.',
    features: ['E-commerce or custom web app', 'Payments, bookings or dashboards', 'Integrations with your tools', 'Advanced SEO & performance', 'Priority support', 'Timeline planned with you'],
    cta: 'Discuss a custom build',
  },
]

// Frequently asked questions, shown as an accordion on the Pricing page
export const faqs = [
  {
    q: 'How long does a website take?',
    a: 'A small website usually takes 2–3 weeks and a larger business site 4–6 weeks. Online stores and web apps are planned with you, with clear milestones.',
  },
  {
    q: 'Do you handle hosting and the domain name?',
    a: 'Yes. We can set up your domain, hosting and business email for you, or use the accounts you already have.',
  },
  {
    q: 'Will I be able to update the website myself?',
    a: 'Yes. If you need to change text, images or blog posts regularly, we build in an easy way to edit them and show you how it works.',
  },
  {
    q: 'What do I need to provide?',
    a: 'Your logo, photos and a rough idea of the text. Don\'t have them yet? We can help with copywriting and suggest images.',
  },
  {
    q: 'How do payments work?',
    a: 'Usually 50% to start and 50% at launch. Bigger projects can be split into milestones. You get a clear quote before any work starts.',
  },
  {
    q: 'Do you offer support after launch?',
    a: 'Yes. Every project includes a support period, and after that we offer monthly care plans for updates, backups and improvements.',
  },
]

// Show `sample: true` items only on your own computer, never on the live site
export const visible = (items) => items.filter((item) => !item.sample || import.meta.env.DEV)
