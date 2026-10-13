import { Link } from 'react-router-dom'
import Projects from '../components/Projects.jsx'
import HoverField from '../components/HoverField.jsx'
import { useProjectModal } from '../components/ProjectModal.jsx'

export default function Work() {
  const openProjectForm = useProjectModal()
  return (
    <>
      <section className="hero page-head" id="top">
        <HoverField />
        <div className="container hero__inner">
          <p className="eyebrow">Our portfolio</p>
          <h1 className="hero__title">
            Work that <span className="gradient-text">speaks for itself</span>.
          </h1>
          <p className="hero__intro">
            A selection of websites and apps we have designed and built for our clients.
          </p>
          <div className="hero__actions">
            <button type="button" className="btn" onClick={openProjectForm}>Start your project</button>
            <Link to="/" className="btn btn--ghost">Back to home</Link>
          </div>
        </div>
      </section>
      <Projects />
    </>
  )
}
