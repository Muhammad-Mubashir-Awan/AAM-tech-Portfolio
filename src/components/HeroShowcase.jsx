import { projects } from '../data.js'

// Decorative visual beside the home headline: a laptop and a phone showing mini previews
// of our project sites, with a few floating badges. Built in HTML/CSS so it stays sharp
// and follows the site's colours; screen readers skip it.
const BADGES = [
  { icon: <path d="M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />, title: '24h', text: 'Reply time' },
  { icon: <path d="M4 5h16v11H4zM8 20h8M12 16v4" />, title: '100%', text: 'Responsive builds' },
  { icon: <path d="M5 12l4 4L19 6" />, title: 'End-to-end', text: 'Design to launch' },
]

// A tiny website, taller than its screen: hovering a device scrolls it down like a real
// page preview (see .mini__page in index.css).
function MiniSite({ project, compact = false }) {
  return (
    <div className={`mini ${compact ? 'mini--compact' : ''}`}>
      <div className="mini__page">
        <div className="mini__nav">
          <span className="mini__logo" />
          {!compact && <span className="mini__links"><i /><i /><i /></span>}
        </div>
        <div className="mini__hero" style={{ background: project.gradient }}>
          <strong>{project.title}</strong>
          <span>{project.category}</span>
          <i className="mini__btn" />
        </div>
        <div className="mini__cards">
          <i /><i />{!compact && <i />}
        </div>
        <div className="mini__text">
          <i /><i /><i />
        </div>
        <div className="mini__features">
          <i /><i />{!compact && <i />}
        </div>
        <div className="mini__cta" style={{ background: project.gradient }} />
        <div className="mini__footer" />
      </div>
    </div>
  )
}

export default function HeroShowcase() {
  const [main, second] = projects
  return (
    <div className="showcase" aria-hidden="true">
      <div className="showcase__laptop">
        <div className="showcase__screen">
          <MiniSite project={main} />
        </div>
        <div className="showcase__base" />
      </div>
      {second && (
        <div className="showcase__phone">
          <MiniSite project={second} compact />
        </div>
      )}
      {BADGES.map((b, i) => (
        <div key={b.title} className={`showcase__badge showcase__badge--${i + 1}`}>
          <svg viewBox="0 0 24 24">{b.icon}</svg>
          <div>
            <strong>{b.title}</strong>
            <span>{b.text}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
