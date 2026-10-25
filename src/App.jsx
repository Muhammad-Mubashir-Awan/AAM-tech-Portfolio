import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import QuickQuote from './components/QuickQuote.jsx'
import Marquee from './components/Marquee.jsx'
import Services from './components/Services.jsx'
import Team from './components/Team.jsx'
import About from './components/About.jsx'
import RecentProjects from './components/RecentProjects.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Work from './pages/Work.jsx'
import AboutPage from './pages/AboutPage.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import { ProjectModalProvider, useProjectModal } from './components/ProjectModal.jsx'


function Home() {
  return (
    <>
      <Hero />
      <QuickQuote />
      <Marquee />
      <Services />
      <Team />
      <About />
      <RecentProjects />
    </>
  )
}

// The old Contact page is now the "Start a project" pop-up: open it and go home,
// so shared /contact links still lead somewhere useful
function OpenProjectForm() {
  const openProjectForm = useProjectModal()
  useEffect(() => {
    openProjectForm()
  }, [openProjectForm])
  return <Navigate to="/" replace />
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
          <Route path="/about" element={<AboutPage />} />
          <Route path="/work" element={<Work />} />
          <Route path="/contact" element={<OpenProjectForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </ProjectModalProvider>
  )
}
