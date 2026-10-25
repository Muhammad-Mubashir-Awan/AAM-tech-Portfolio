import { projects } from '../data.js'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import { Badge } from '@/components/ui/badge'
import { liftCard, zoomOnHover } from '@/lib/card'
import { cn } from '@/lib/utils'

export default function Projects() {
  return (
    <section className="bg-linear-to-b from-pine-50/70 to-background/55 py-18 md:py-25" id="work">
      <div className="wrap">
        <SectionHeader
          eyebrow="Selected work"
          title="Projects we're proud of"
          text="A look at the kinds of websites and apps we design and build."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.title} index={i % 2} className="flex">
              <article className={cn(liftCard, 'w-full')}>
                <div className="overflow-hidden">
                  <div className={cn('relative grid aspect-video place-items-center', zoomOnHover)} style={{ background: p.gradient }}>
                    {/* Browser window dots */}
                    <div className="absolute top-3.5 left-4 flex gap-1.5">
                      <span className="size-2.5 rounded-full bg-white/60" />
                      <span className="size-2.5 rounded-full bg-white/60" />
                      <span className="size-2.5 rounded-full bg-white/60" />
                    </div>
                    <span className="font-display text-[clamp(1.4rem,3vw,2rem)] font-bold text-white [text-shadow:0_4px_20px_rgba(0,0,0,0.25)]">{p.title}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="mb-1.5 text-[0.8rem] tracking-[0.1em] text-pine-600 uppercase">{p.category}</p>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <ul className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li key={t}>
                        <Badge variant="outline" className="rounded-full bg-secondary px-3 py-1 text-[0.8rem] font-normal text-muted-foreground">{t}</Badge>
                      </li>
                    ))}
                  </ul>
                  {/^https?:\/\//.test(p.link) && (
                    <a href={p.link} className="mt-5 inline-block font-semibold text-pine-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      View project →
                    </a>
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
