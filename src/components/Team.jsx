import { asset, team } from '../data.js'
import Reveal from './Reveal.jsx'
import SectionHeader from './SectionHeader.jsx'
import { liftCard, zoomOnHover } from '@/lib/card'
import { cn } from '@/lib/utils'

// "Jane Doe" -> "JD"
const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

// "Meet the team" — shown on the About page
export default function Team() {
  return (
    <section className="py-18 md:py-25" id="team">
      <div className="wrap">
        <SectionHeader
          eyebrow="Our team"
          title="Meet the team"
          text="The people you'll work with, from the first call to launch day."
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,340px))] justify-center gap-8">
          {team.map((m, i) => (
            <Reveal key={`${m.name}-${i}`} index={i} className="flex">
              <article className={cn(liftCard, 'w-full px-5 pt-5 pb-7 text-center')}>
                {m.photo ? (
                  // Frame: a thin mint-to-green ring with a soft shadow; a deeper green ring fades
                  // in on hover (gradients can't animate, so it's a second layer). The photo is
                  // rounded inside with a gentle fade at the bottom and zooms within the frame.
                  <div className="relative mb-5 rounded-[20px] bg-linear-145 from-pine-100 to-pine-300 p-[5px] shadow-[0_14px_28px_-16px_rgba(5,31,32,0.45)] transition-shadow duration-[600ms] before:absolute before:inset-0 before:rounded-[inherit] before:bg-linear-145 before:from-pine-300 before:to-pine-600 before:opacity-0 before:transition-opacity before:duration-[800ms] before:ease-soft before:content-[''] group-hover/card:shadow-[0_18px_34px_-16px_rgba(5,31,32,0.55)] group-hover/card:before:opacity-100">
                    <div className="relative overflow-hidden rounded-[15px] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[30%] after:bg-linear-to-b after:from-transparent after:to-pine-900/25 after:content-['']">
                      {/* About 290 px wide on screen (less on small phones); the browser picks the
                          600 or 900 px file to suit the screen */}
                      <img
                        src={asset(m.photo)}
                        srcSet={m.photoLarge ? `${asset(m.photo)} 600w, ${asset(m.photoLarge)} 900w` : undefined}
                        sizes="(min-width: 372px) 290px, calc(100vw - 82px)"
                        width={600}
                        height={750}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        alt={m.name}
                        className={cn('block aspect-[4/5] w-full object-cover object-[center_25%]', zoomOnHover)}
                      />
                    </div>
                  </div>
                ) : (
                  <div aria-hidden="true" className="mx-auto mt-4 mb-5 grid size-21 place-items-center rounded-full bg-linear-135 from-primary to-pine-600 font-display text-[1.6rem] font-bold text-primary-foreground shadow-[0_12px_30px_-10px_rgba(5,31,32,0.4)]">
                    {initials(m.name)}
                  </div>
                )}
                <h3 className="mb-2 text-[1.3rem]">{m.name}</h3>
                {m.role && <p className="mb-3 text-[0.9rem] font-semibold text-pine-600">{m.role}</p>}
                {m.bio && <p className="mb-0 text-[0.98rem] leading-relaxed">{m.bio}</p>}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
