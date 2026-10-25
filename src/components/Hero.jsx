import { Link } from 'react-router-dom'
import HoverField from './HoverField.jsx'
import TypedTitle from './TypedTitle.jsx'
import HeroShowcase from './HeroShowcase.jsx'
import { useProjectModal } from './ProjectModal.jsx'

// Typed in letter by letter when the page opens
const headline = [
  { text: 'We build ' },
  { text: 'digital experiences', className: 'gradient-text gradient-text--animated' },
  { text: ' that grow businesses.' },
]

// Short promises shown under the buttons, each with a small icon
const TRUST = [
  { icon: <path d="M13 3L5 14h6l-1 7 8-11h-6z" />, text: 'Fast delivery' },
  { icon: <path d="M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />, text: '24h replies' },
  { icon: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.6 3.5 5.6 3.5 9s-1 6.4-3.5 9c-2.5-2.6-3.5-5.6-3.5-9s1-6.4 3.5-9z" />, text: 'Working worldwide' },
]

export default function Hero() {
  const openProjectForm = useProjectModal()
  return (
    <section className="hero hero--home" id="top">
      <HoverField />

      <div className="container hero__inner hero__split">
        <div className="hero__copy">
          <p className="eyebrow">Web design & development studio</p>
          <h1 className="hero__title">
            <TypedTitle parts={headline} />
          </h1>
          <p className="hero__intro">
            Modern, fast and responsive websites for businesses, startups and organizations,
            designed and built end to end by our team.
          </p>
          <div className="hero__actions">
            <button type="button" className="btn" onClick={openProjectForm}>
              Start your project <span className="btn__arrow" aria-hidden="true">→</span>
            </button>
            <Link to="/work" className="btn btn--ghost">See our work</Link>
          </div>
          <ul className="hero__trust">
            {TRUST.map((t) => (
              <li key={t.text}>
                <svg viewBox="0 0 24 24" aria-hidden="true">{t.icon}</svg>
                {t.text}
              </li>
            ))}
          </ul>
        </div>

        <HeroShowcase />
      </div>
    </section>
  )
}
