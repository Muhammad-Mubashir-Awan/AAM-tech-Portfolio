import { CheckIcon } from 'lucide-react'
import { pricing } from '../data.js'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import { useProjectModal } from './ProjectModal.jsx'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Three packages; each button opens the "Start a project" pop-up with its budget selected.
// `heading={false}` drops the section title when the page header already says it.
export default function Pricing({ heading = true }) {
  const openProjectForm = useProjectModal()

  return (
    <section className={cn('bg-background/60 pb-18 md:pb-25', heading ? 'pt-18 md:pt-25' : 'pt-10')} id="pricing">
      <div className="wrap">
        {heading && (
          <SectionHeader
            eyebrow="Pricing"
            title="Simple packages, honest prices"
            text="Every project is quoted for you, but here's where most of our work starts."
          />
        )}
        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {pricing.map((p, i) => (
            <Reveal key={p.name} index={i} className="flex">
              <article
                className={cn(
                  'relative flex w-full flex-col rounded-xl border p-7 shadow-[0_10px_30px_rgba(11,43,38,0.08)] md:p-8',
                  p.popular ? 'border-primary bg-card ring-1 ring-primary' : 'border-pine-800/10 bg-card/90',
                )}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wide text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="mb-1">{p.name}</h3>
                <p className="mb-5 text-[0.92rem]">{p.text}</p>
                <p className="mb-6 flex items-baseline gap-2 text-foreground">
                  <span className="text-[0.85rem] text-muted-foreground">from</span>
                  <span className="font-display text-[2.2rem] leading-none font-bold tabular-nums">{p.price}</span>
                </p>
                <ul className="mb-8 grid gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[0.95rem] text-foreground">
                      <CheckIcon aria-hidden="true" className="mt-0.5 size-[18px] flex-none text-pine-500" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={p.popular ? 'default' : 'outline'}
                  className="mt-auto w-full"
                  onClick={() => openProjectForm({ budget: p.budget })}
                >
                  {p.cta} <span data-arrow aria-hidden="true">→</span>
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-8 mb-0 max-w-160 text-center text-[0.9rem]">
          Prices are starting points in Pakistani rupees. Tell us what you need and we'll send a
          clear, fixed quote before any work starts.
        </p>
      </div>
    </section>
  )
}
