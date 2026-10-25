import { Link } from 'react-router-dom'
import { company, values } from '../data.js'
import Reveal from './Reveal.jsx'
import TiltCard from './TiltCard.jsx'
import { Button } from '@/components/ui/button'

export default function About() {
  return (
    <section className="bg-background/60 py-18 md:py-25" id="about">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">About us</p>
          <h2>Your partner for a stronger online presence</h2>
          <p>
            {company.name} is a technology and software development company. We work
            closely with businesses, startups, and organizations to turn ideas into
            websites and digital products that look great and deliver real results.
          </p>
          <Button asChild className="mt-3">
            <Link to="/about">More about us <span data-arrow aria-hidden="true">→</span></Link>
          </Button>
        </Reveal>

        {/* A soft green glow sits behind the value cards */}
        <div className="relative grid gap-4 sm:grid-cols-2 before:pointer-events-none before:absolute before:-inset-[15%] before:-z-10 before:bg-[radial-gradient(closest-side,rgba(250,255,251,0.95),rgba(35,83,71,0.08)_60%,transparent)] before:blur-[20px] before:content-['']">
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
