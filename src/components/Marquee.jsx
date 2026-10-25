import { marquee } from '../data.js'

// The points repeat enough times that one copy is wider than any screen, and the track
// holds two copies, so sliding it by half loops with no visible seam.
const REPEATS = 4

// A band of selling points drifting left to right under the home hero.
export default function Marquee() {
  const copy = (key) => (
    <ul key={key} className="m-0 flex flex-none list-none p-0">
      {Array.from({ length: REPEATS }, (_, r) =>
        marquee.map((text) => (
          <li
            key={`${r}-${text}`}
            className="flex items-center py-[0.95rem] font-display text-base font-bold tracking-[0.14em] whitespace-nowrap text-primary-foreground uppercase after:mx-[1.6rem] after:text-[0.8em] after:opacity-75 after:content-['✦']"
          >
            {text}
          </li>
        )),
      )}
    </ul>
  )

  return (
    <div className="relative z-[1] overflow-hidden py-7">
      {/* Read once by screen readers; the moving copies are decoration */}
      <p className="sr-only">{marquee.join(', ')}</p>
      <div
        aria-hidden="true"
        className="group/marquee overflow-hidden bg-linear-to-r from-primary to-pine-800 shadow-[0_14px_34px_-14px_rgba(5,31,32,0.45)]"
      >
        <div className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none">
          {[copy('a'), copy('b')]}
        </div>
      </div>
    </div>
  )
}
