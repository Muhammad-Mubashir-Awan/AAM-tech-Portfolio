import { StarIcon } from 'lucide-react'
import { testimonials, visible } from '../data.js'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import SampleTag from './SampleTag.jsx'

const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

// Client reviews. Placeholder ones (sample: true) only show while running `npm run dev`, so
// the section stays hidden on the live site until real reviews are added in data.js.
export default function Testimonials() {
  const items = visible(testimonials)
  if (items.length === 0) return null

  return (
    <section className="py-18 md:py-25" id="testimonials">
      <div className="wrap">
        <SectionHeader
          eyebrow="Client stories"
          title="What our clients say"
          text="Businesses we've worked with, in their own words."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={`${t.name}-${i}`} index={i} className="flex">
              <figure className="m-0 flex w-full flex-col rounded-xl border border-pine-800/10 bg-card/90 p-7 shadow-[0_10px_30px_rgba(11,43,38,0.08)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex gap-0.5 text-amber-500" role="img" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, s) => (
                      <StarIcon key={s} aria-hidden="true" className={`size-4 ${s < t.rating ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                  </div>
                  {t.sample && <SampleTag />}
                </div>
                <blockquote className="m-0 flex-1 text-[1rem] leading-relaxed text-foreground">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <span aria-hidden="true" className="grid size-10 flex-none place-items-center rounded-full bg-linear-135 from-primary to-pine-600 text-sm font-bold text-primary-foreground">
                    {initials(t.name)}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-semibold text-foreground">{t.name}</span>
                    <span className="text-[0.85rem] text-muted-foreground">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
