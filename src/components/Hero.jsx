import { Link } from 'react-router-dom'
import HoverField from './HoverField.jsx'
import TypedTitle from './TypedTitle.jsx'
import HeroShowcase from './HeroShowcase.jsx'
import { useProjectModal } from './ProjectModal.jsx'
import { Button } from '@/components/ui/button'

// Typed in letter by letter when the page opens
const headline = [
  { text: 'We build ' },
  { text: 'digital experiences', className: 'text-gradient-animated' },
  { text: ' that grow businesses.' },
]

// Short promises shown under the buttons, each with a small icon
const TRUST = [
  { icon: <path d="M13 3L5 14h6l-1 7 8-11h-6z" />, text: 'Fast delivery' },
  { icon: <path d="M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />, text: '24h replies' },
  { icon: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.6 3.5 5.6 3.5 9s-1 6.4-3.5 9c-2.5-2.6-3.5-5.6-3.5-9s1-6.4 3.5-9z" />, text: 'Working worldwide' },
]

export default function Hero() {
  const openProjectForm = useProjectModal()
  return (
    // The soft curved edge at the bottom sits under the quick quote bar
    <section
      id="top"
      className="relative overflow-hidden bg-linear-to-b from-transparent to-pine-600/10 pt-[110px] pb-[120px] after:pointer-events-none after:absolute after:-inset-x-[10%] after:-bottom-px after:h-[90px] after:rounded-[50%_50%_0_0/100%_100%_0_0] after:bg-background after:content-[''] sm:py-[150px]"
    >
      <HoverField />

      <div className="wrap relative z-[1] grid items-center gap-9 sm:gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow">Web design & development studio</p>
          <h1 className="text-glow text-[2.1rem] max-[360px]:text-[1.9rem] sm:text-[clamp(2.4rem,4.6vw,3.9rem)]">
            <TypedTitle parts={headline} />
          </h1>
          <p className="text-glow mb-6 max-w-130 text-base sm:mb-8 sm:text-[1.1rem]">
            Modern, fast and responsive websites for businesses, startups and organizations,
            designed and built end to end by our team.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
            <Button onClick={openProjectForm} className="max-sm:px-3 max-sm:py-3 max-sm:text-[0.9rem]">
              Start your project <span data-arrow aria-hidden="true" className="max-[420px]:hidden">→</span>
            </Button>
            <Button asChild variant="outline" className="max-sm:px-3 max-sm:py-3 max-sm:text-[0.9rem]">
              <Link to="/work">See our work</Link>
            </Button>
          </div>
          <ul className="mt-6 grid grid-cols-3 gap-2 text-[0.75rem] font-semibold text-foreground max-[360px]:text-[0.7rem] sm:mt-8 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-3 sm:text-[0.9rem]">
            {TRUST.map((t) => (
              <li
                key={t.text}
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card px-1.5 py-2.5 text-center leading-tight sm:flex-row sm:gap-[0.45rem] sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:text-left sm:leading-normal sm:not-first:border-l sm:not-first:pl-5"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px] flex-none fill-none stroke-current stroke-2 text-primary [stroke-linecap:round] [stroke-linejoin:round]">
                  {t.icon}
                </svg>
                {t.text}
              </li>
            ))}
          </ul>
        </div>

        <HeroShowcase />
      </div>
    </section>
  )
}
