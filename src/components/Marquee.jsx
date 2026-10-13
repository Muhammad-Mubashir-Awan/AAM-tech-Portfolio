import { marquee } from '../data.js'

// The points repeat enough times that one copy is wider than any screen, and the track
// holds two copies, so sliding it by half loops with no visible seam.
const REPEATS = 4

// A tilted band of selling points drifting left to right under the home hero.
export default function Marquee() {
  const copy = (key) => (
    <ul key={key} className="marquee__list">
      {Array.from({ length: REPEATS }, (_, r) =>
        marquee.map((text) => (
          <li key={`${r}-${text}`} className="marquee__item">{text}</li>
        )),
      )}
    </ul>
  )

  return (
    <div className="marquee">
      {/* Read once by screen readers; the moving copies are decoration */}
      <p className="visually-hidden">{marquee.join(', ')}</p>
      <div className="marquee__band" aria-hidden="true">
        <div className="marquee__track">{[copy('a'), copy('b')]}</div>
      </div>
    </div>
  )
}
