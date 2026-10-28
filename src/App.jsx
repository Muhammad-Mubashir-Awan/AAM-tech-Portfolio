import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import QuickQuote from './components/QuickQuote.jsx'
import Marquee from './components/Marquee.jsx'
import Services from './components/Services.jsx'
import RecentProjects from './components/RecentProjects.jsx'
import Stats from './components/Stats.jsx'
import Testimonials from './components/Testimonials.jsx'
import ClosingCta from './components/ClosingCta.jsx'
import Analytics from './components/Analytics.jsx'
import usePageTitle from './hooks/usePageTitle.js'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Work from './pages/Work.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import { ProjectModalProvider } from './components/ProjectModal.jsx'

// Kept short on purpose: pricing, FAQ, team and contact options each have their own page
function Home() {
  usePageTitle()
  return (
    <>
      <Hero />
      <QuickQuote />
      <Marquee />
      <Services />
      <Stats />
      <RecentProjects />
      <Testimonials />
      <ClosingCta />
    </>
  )
}

export default function App() {
  return (
    <ProjectModalProvider>
      {/* Soft glow behind the top of the page */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[600px] overflow-hidden">
        <div className="absolute -top-[200px] left-1/2 h-[600px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(250,255,251,0.95),transparent),radial-gradient(closest-side_at_70%_60%,rgba(35,83,71,0.08),transparent)]" />
      </div>
      <ScrollToTop />
      <Navbar />
      {/* clip: decorative glows can't make the page scroll sideways */}
      <main className="relative z-[1] overflow-x-clip">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/work" element={<Work />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
    </ProjectModalProvider>
  )
}
