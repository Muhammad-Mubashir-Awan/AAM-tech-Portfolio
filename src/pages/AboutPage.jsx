import { Link } from 'react-router-dom'
import { about, company } from '../data.js'
import Reveal from '../components/Reveal.jsx'
import Team from '../components/Team.jsx'
import HoverField from '../components/HoverField.jsx'
import { useProjectModal } from '../components/ProjectModal.jsx'

export default function AboutPage() {
  const openProjectForm = useProjectModal()
  return (
    <>
      <section className="hero page-head" id="top">
        <HoverField />
        <div className="container hero__inner">
          <p className="eyebrow">About us</p>
          <h1 className="hero__title">
            The people behind <span className="gradient-text">{company.name}</span>.
          </h1>
          <p className="hero__intro">
            A small, focused team building websites and web apps that help businesses grow.
          </p>
        </div>
      </section>

      <Team />

      <section className="section" id="story">
        <div className="container about">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h2>Built for businesses that want more from the web</h2>
            {about.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>

          <Reveal index={1}>
            <div className="card about__mission">
              <p className="eyebrow">Our mission</p>
              <p className="about__mission-text">{about.mission}</p>
              <ul className="hero__stats about__highlights">
                {about.highlights.map((h) => (
                  <li key={h.label}>
                    <strong>{h.value}</strong>
                    <span>{h.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="container">
          <Reveal className="about__closing">
            <h2>Let's build something together</h2>
            <div className="hero__actions">
              <button type="button" className="btn" onClick={openProjectForm}>Start your project</button>
              <Link to="/work" className="btn btn--ghost">See our work</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
