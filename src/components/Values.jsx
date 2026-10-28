import { values } from '../data.js'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import TiltCard from './TiltCard.jsx'

// What clients can count on from us: the four value cards on the About page
export default function Values() {
  return (
    <section className="bg-background/60 py-18 md:py-25" id="values">
      <div className="wrap">
        <SectionHeader
          eyebrow="Our values"
          title="What you can expect from us"
          text="The way we work on every project, big or small."
        />
        {/* A soft green glow sits behind the value cards */}
        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 before:pointer-events-none before:absolute before:-inset-[15%] before:-z-10 before:bg-[radial-gradient(closest-side,rgba(250,255,251,0.95),rgba(35,83,71,0.08)_60%,transparent)] before:blur-[20px] before:content-['']">
          {values.map((v, i) => (
            <Reveal key={v.title} index={i}>
              <TiltCard className="p-6">
                <div aria-hidden="true" className="mb-4 grid size-[42px] place-items-center rounded-xl bg-pine-600/10 text-[1.1rem] text-pine-600">
                  {v.icon}
                </div>
                <h3 className="mb-1.5 text-[1.05rem]">{v.title}</h3>
                <p className="mb-0 text-[0.92rem]">{v.text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
