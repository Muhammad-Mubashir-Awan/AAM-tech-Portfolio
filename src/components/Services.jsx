import { services } from '../data.js'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import TiltCard from './TiltCard.jsx'

export default function Services() {
  return (
    <section className="py-18 md:py-25" id="services">
      <div className="wrap">
        <SectionHeader
          eyebrow="What we do"
          title="Services built around your goals"
          text="From a simple landing page to a full web application, we handle design, development, and launch."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} index={i % 3}>
              <TiltCard as="article" className="p-8">
                <div aria-hidden="true" className="mb-5 grid size-12 place-items-center rounded-xl bg-pine-600/10 text-[1.4rem] text-pine-600">
                  {s.icon}
                </div>
                <h3>{s.title}</h3>
                <p className="mb-0">{s.text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
