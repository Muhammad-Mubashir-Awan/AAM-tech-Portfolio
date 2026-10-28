import { useEffect, useState } from 'react'
import { asset, clientLogos, counters, visible } from '../data.js'
import useIsClient from '../hooks/useIsClient.js'
import useReveal from '../hooks/useReveal.js'
import SampleTag from './SampleTag.jsx'
import TechStack from './TechStack.jsx'

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Counts from 0 up to `value` (easing out) once `run` turns true; shows the final number
// straight away for visitors who prefer reduced motion (once the page is live in their browser).
function CountUp({ value, suffix, run }) {
  const isClient = useIsClient()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run || reducedMotion) return
    let frame
    let start = null
    const tick = (now) => {
      start ??= now
      const p = Math.min(1, (now - start) / 1400)
      setN(Math.round(value * (1 - (1 - p) ** 3)))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run, value])
  return (
    <>
      {isClient && reducedMotion ? value : n}
      {suffix}
    </>
  )
}

// Numbers that count up, the tools we build with, and (once added) client logos
export default function Stats() {
  const [ref, inView] = useReveal(0.3)
  const items = visible(counters)

  return (
    <section ref={ref} aria-label="AAM Technology in numbers" className="border-y border-border bg-card/60 py-14 md:py-16">
      <div className="wrap">
        {/* Centred whatever the number of counters (real ones only on the live site) */}
        {items.length > 0 && (
          <dl className="flex flex-wrap justify-center gap-x-6 gap-y-10 text-center md:gap-x-12">
            {items.map((c) => (
              <div key={c.label} className="flex w-[calc(50%-0.75rem)] flex-col items-center gap-1 md:w-48">
                <dt className="order-2 text-[0.9rem] text-muted-foreground">
                  {c.label} {c.sample && <SampleTag className="ml-1 align-middle" />}
                </dt>
                <dd className="order-1 m-0 font-display text-[clamp(2.2rem,5vw,3rem)] leading-none font-bold text-primary tabular-nums">
                  {/* Screen readers get the final number; the counting copy is visual only */}
                  <span className="sr-only">{c.value}{c.suffix}</span>
                  <span aria-hidden="true"><CountUp value={c.value} suffix={c.suffix} run={inView} /></span>
                </dd>
              </div>
            ))}
          </dl>
        )}

        <TechStack className="mt-12" />

        {clientLogos.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-5">
            <p className="eyebrow mb-0 justify-center">Trusted by</p>
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {clientLogos.map((c) => (
                <li key={c.name}>
                  <img src={asset(c.logo)} alt={c.name} loading="lazy" className="h-9 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
