import { processSteps } from '../data.js'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'

// "How we work": four numbered steps from first call to launch (Services page)
export default function Process() {
  return (
    <section className="bg-background/60 py-18 md:py-25" id="process">
      <div className="wrap">
        <SectionHeader
          eyebrow="How we work"
          title="From first call to launch day"
          text="A simple process with no surprises: you always know what happens next."
        />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <Reveal as="li" key={s.title} index={i} className="rounded-xl border border-pine-800/10 bg-card/90 p-6 shadow-[0_10px_30px_rgba(11,43,38,0.08)]">
              <span aria-hidden="true" className="mb-4 grid size-10 place-items-center rounded-full bg-primary font-display text-[1rem] font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mb-1.5 text-[1.05rem]">{s.title}</h3>
              <p className="mb-0 text-[0.92rem]">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
