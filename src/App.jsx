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
      <div className="page-glow" aria-hidden="true">
        <div className="hero__glow" />
      </div>
      <ScrollToTop />
      <Navbar />
      <main>
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
