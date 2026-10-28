import { Link } from 'react-router-dom'
import { CheckIcon } from 'lucide-react'
import { services } from '../data.js'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import TiltCard from './TiltCard.jsx'

// Home: the service cards with a link to the Services page.
// `detailed` (Services page): no header, and each card lists what's included.
export default function Services({ detailed = false }) {
  return (
    <section className={detailed ? 'pt-10 pb-18 md:pb-25' : 'py-18 md:py-25'} id="services">
      <div className="wrap">
        {!detailed && (
          <SectionHeader
            eyebrow="What we do"
            title="Services built around your goals"
            text="From a simple landing page to a full web application, we handle design, development, and launch."
          />
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} index={i % 3}>
              <TiltCard as="article" className="p-8">
                <div aria-hidden="true" className="mb-5 grid size-12 place-items-center rounded-xl bg-pine-600/10 text-[1.4rem] text-pine-600">
                  {s.icon}
                </div>
                <h3>{s.title}</h3>
                <p className="mb-0">{s.text}</p>
                {detailed && (
                  <ul className="mt-5 grid gap-2.5 border-t border-border pt-5" aria-label={`${s.title}: what's included`}>
                    {s.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[0.92rem] text-foreground">
                        <CheckIcon aria-hidden="true" className="mt-0.5 size-[18px] flex-none text-pine-500" strokeWidth={2.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </TiltCard>
            </Reveal>
          ))}
        </div>
        {!detailed && (
          <p className="mt-10 mb-0 text-center">
            <Link to="/services" className="group/link inline-flex gap-1.5 text-[0.95rem] font-semibold text-foreground">
              See all services & how we work
              <span aria-hidden="true" className="transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transition-none">→</span>
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}
