import { Link } from 'react-router-dom'
import { company, stats } from '../data.js'
import Reveal from './Reveal.jsx'
import HoverField from './HoverField.jsx'
import TypedTitle from './TypedTitle.jsx'
import { useProjectModal } from './ProjectModal.jsx'

// Typed in letter by letter when the page opens
const headline = [
  { text: 'We build ' },
  { text: 'digital experiences', className: 'gradient-text gradient-text--animated' },
  { text: ' that grow businesses.' },
]

// The 3D shapes behind this section live in ScrollScene (rendered from App).
export default function Hero() {
  const openProjectForm = useProjectModal()
  return (
    <section className="hero" id="top">
      <HoverField />

      <div className="container hero__inner">
        <p className="eyebrow">Web design & development studio</p>
        <h1 className="hero__title">
          <TypedTitle parts={headline} />
        </h1>
        <p className="hero__intro">{company.intro}</p>
        <div className="hero__actions">
          <button type="button" className="btn" onClick={openProjectForm}>Start your project</button>
          <Link to="/work" className="btn btn--ghost">See our work</Link>
        </div>

        <ul className="hero__stats">
          {stats.map((s, i) => (
            <Reveal as="li" key={s.label} index={i}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
