import { Link } from 'react-router-dom'
import { projects } from '../data.js'
import Reveal from './Reveal.jsx'
import { liftCard, zoomOnHover } from '@/lib/card'
import { cn } from '@/lib/utils'

const isLive = (link) => /^https?:\/\//.test(link)
const mono = "font-mono [font-family:ui-monospace,'SFMono-Regular',Consolas,monospace]"
const arrow = 'transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transition-none'

// Home page preview of the latest work: the first three projects from data.js,
// with a link through to the full Our Work page
export default function RecentProjects() {
  return (
    <section className="bg-background/60 py-18 md:py-25" id="recent-work">
      <div className="wrap">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mb-0">Recent projects</h2>
          </div>
          <Link to="/work" className="group/link inline-flex gap-1.5 text-[0.95rem] font-semibold text-foreground">
            View full work portfolio <span aria-hidden="true" className={arrow}>→</span>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((p, i) => (
            <Reveal key={p.title} index={i} className="flex">
              <article className={cn(liftCard, 'w-full')}>
                <div className="overflow-hidden">
                  <div className={cn('relative grid aspect-[16/10] place-items-center', zoomOnHover)} style={{ background: p.gradient }}>
                    <span className="font-display text-[clamp(1.3rem,2.2vw,1.7rem)] font-bold text-white [text-shadow:0_4px_20px_rgba(0,0,0,0.25)]">{p.title}</span>
                    <span className={cn(mono, 'absolute top-3.5 left-3.5 rounded-full border border-white/35 bg-pine-900/55 px-2.5 py-[0.45rem] text-[0.66rem] leading-none font-semibold tracking-[0.08em] text-white uppercase')}>
                      {p.category}
                    </span>
                    {/* Shown until the project has a live website */}
                    {!isLive(p.link) && (
                      <span className={cn(mono, 'absolute top-3.5 right-3.5 rounded-sm bg-pine-900 px-2 py-[0.35rem] text-[0.66rem] leading-none font-semibold tracking-[0.08em] text-pine-100 uppercase')}>
                        Sample project
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className={cn(mono, 'mb-1.5 text-[0.78rem] font-medium')}>{p.tags.join(' · ')}</p>
                  <h3 className="mb-2.5">{p.title}</h3>
                  <p className="mb-5 line-clamp-3 text-[0.92rem]">{p.text}</p>
                  {isLive(p.link) ? (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className={cn(mono, 'group/link mt-auto flex justify-between border-t border-border pt-4 text-[0.85rem] font-semibold text-pine-600')}>
                      View project <span aria-hidden="true" className={arrow}>→</span>
                    </a>
                  ) : (
                    <Link to="/work" className={cn(mono, 'group/link mt-auto flex justify-between border-t border-border pt-4 text-[0.85rem] font-semibold text-pine-600')}>
                      See details <span aria-hidden="true" className={arrow}>→</span>
                    </Link>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
