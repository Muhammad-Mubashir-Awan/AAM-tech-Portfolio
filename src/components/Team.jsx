import { asset, team } from '../data.js'
import Reveal from './Reveal.jsx'
import SectionHeader from './SectionHeader.jsx'
import TiltCard from './TiltCard.jsx'

// "Jane Doe" -> "JD"
const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

// "Meet the team" — shown on both the home page and the About page
export default function Team() {
  return (
    <section className="section" id="team">
      <div className="container">
        <SectionHeader
          eyebrow="Our team"
          title="Meet the team"
          text="The people you'll work with, from the first call to launch day."
        />
        <div className="team__grid">
          {team.map((m, i) => (
            <Reveal key={`${m.name}-${i}`} index={i}>
              <TiltCard className="card team__card">
                {m.photo ? (
                  <img className="team__avatar team__avatar--photo" src={asset(m.photo)} alt={m.name} />
                ) : (
                  <div className="team__avatar" aria-hidden="true">{initials(m.name)}</div>
                )}
                <h3>{m.name}</h3>
                {m.role && <p className="team__role">{m.role}</p>}
                {m.bio && <p>{m.bio}</p>}
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
