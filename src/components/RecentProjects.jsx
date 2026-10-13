import { Link } from 'react-router-dom'
import { projects } from '../data.js'
import Reveal from './Reveal.jsx'

const isLive = (link) => /^https?:\/\//.test(link)

// Home page preview of the latest work: the first three projects from data.js,
// with a link through to the full Our Work page
export default function RecentProjects() {
  return (
    <section className="section" id="recent-work">
      <div className="container">
        <div className="recent__head">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2>Recent projects</h2>
          </div>
          <Link to="/work" className="recent__all">
            View full work portfolio <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="recent__grid">
          {projects.slice(0, 3).map((p, i) => (
            <Reveal key={p.title} index={i}>
              <article className="recent-card">
                <div className="project__thumb recent-card__thumb" style={{ background: p.gradient }}>
                  <span className="project__thumb-title">{p.title}</span>
                  <span className="recent-card__pill">{p.category}</span>
                  {/* Shown until the project has a live website */}
                  {!isLive(p.link) && <span className="recent-card__badge">Sample project</span>}
                </div>
                <div className="recent-card__body">
                  <p className="recent-card__label">{p.tags.join(' · ')}</p>
                  <h3>{p.title}</h3>
                  <p className="recent-card__text">{p.text}</p>
                  {isLive(p.link) ? (
                    <a href={p.link} className="recent-card__link" target="_blank" rel="noopener noreferrer">
                      View project <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <Link to="/work" className="recent-card__link">
                      See details <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
