import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckIcon, PlusIcon } from 'lucide-react'
import { services } from '../data.js'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import TiltCard from './TiltCard.jsx'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

// Home: the service cards with a link to the Services page.
// `detailed` (Services page): no header, and each card lists what's included.
export default function Services({ detailed = false }) {
  const compact = !detailed
  // Phones (home page): tapping a tile opens a small pop-up with that service's details.
  // `selected` stays set while the pop-up fades out, so its text doesn't vanish early.
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const opener = useRef(null) // the tile that was tapped, so focus can go back to it
  const showDetails = (service, tile) => {
    opener.current = tile
    setSelected(service)
    setOpen(true)
  }

  return (
    <section className={detailed ? 'pt-10 pb-18 md:pb-25' : 'py-18 md:py-25'} id="services">
      <div className="wrap">
        {detailed ? (
          // The page title above is the h1; this keeps heading levels in order for screen readers
          <h2 className="sr-only">All services</h2>
        ) : (
          <SectionHeader
            eyebrow="What we do"
            title="Services built around your goals"
            text="From a simple landing page to a full web application, we handle design, development, and launch."
          />
        )}
        {/* On phones the home page shows the services as compact two-column tiles (title only) to
            keep the page short; a tap opens the details. The Services page has them all in full. */}
        <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', compact && 'max-sm:grid-cols-2 max-sm:gap-3')}>
          {services.map((s, i) => (
            <Reveal key={s.title} index={i % 3}>
              <TiltCard as="article" className={cn('p-8', compact && 'max-sm:p-4')}>
                <div aria-hidden="true" className={cn('mb-5 grid size-12 place-items-center rounded-xl bg-pine-600/10 text-[1.4rem] text-pine-600', compact && 'max-sm:mb-3 max-sm:size-10')}>
                  {s.icon}
                </div>
                <h3 className={cn(compact && 'max-sm:mb-0 max-sm:text-[0.98rem]')}>{s.title}</h3>
                <p className={cn('mb-0', compact && 'max-sm:hidden')}>{s.text}</p>
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
                {compact && (
                  <>
                    {/* A button stretched over the whole tile (phones only) */}
                    <button
                      type="button"
                      onClick={(e) => showDetails(s, e.currentTarget)}
                      aria-haspopup="dialog"
                      className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine-600 active:bg-pine-600/10 sm:hidden"
                    >
                      <span className="sr-only">{s.title}: show details</span>
                    </button>
                    {/* A small "+" so it's clear the tile can be tapped */}
                    <span aria-hidden="true" className="pointer-events-none absolute top-3 right-3 grid size-6 place-items-center rounded-full bg-pine-600/10 text-pine-600 sm:hidden">
                      <PlusIcon className="size-3.5" strokeWidth={2.5} />
                    </span>
                  </>
                )}
              </TiltCard>
            </Reveal>
          ))}
        </div>
        {!detailed && (
          <p className="mt-10 mb-0 text-center">
            <Link to="/services" className="group/link inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-foreground pointer-coarse:min-h-11">
              See all services & how we work
              <span aria-hidden="true" className="transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transition-none">→</span>
            </Link>
          </p>
        )}
      </div>

      {compact && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            // Back to the tile that opened it (some phone browsers don't focus a tapped button)
            onCloseAutoFocus={(e) => {
              e.preventDefault()
              opener.current?.focus({ preventScroll: true })
            }}
            className="gap-0 overflow-hidden rounded-[18px] border-border bg-card p-0 shadow-[0_30px_80px_-20px_rgba(5,31,32,0.55)] sm:max-w-md"
          >
            <div className="p-6 pb-5">
              <div className="mb-4 flex items-center gap-3 pr-8">
                <span aria-hidden="true" className="grid size-11 flex-none place-items-center rounded-xl bg-pine-600/10 text-[1.3rem] text-pine-600">
                  {selected?.icon}
                </span>
                <DialogTitle className="m-0 font-display text-[1.25rem] leading-tight font-bold text-foreground">
                  {selected?.title}
                </DialogTitle>
              </div>
              <DialogDescription className="mb-0 text-[0.95rem] leading-relaxed text-muted-foreground">
                {selected?.text}
              </DialogDescription>
            </div>
            <div className="border-t border-border px-6 py-5">
              <p className="mb-3 text-[0.8rem] font-semibold tracking-[0.12em] text-pine-600 uppercase">What's included</p>
              <ul className="grid gap-2.5">
                {selected?.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[0.92rem] text-foreground">
                    <CheckIcon aria-hidden="true" className="mt-0.5 size-[18px] flex-none text-pine-500" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border p-4">
              <DialogClose asChild>
                <Button variant="outline" className="w-full">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
