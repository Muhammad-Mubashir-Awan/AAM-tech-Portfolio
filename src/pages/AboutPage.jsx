import { Link } from 'react-router-dom'
import { about, company } from '../data.js'
import Reveal from '../components/Reveal.jsx'
import Team from '../components/Team.jsx'
import Values from '../components/Values.jsx'
import PageHead from '../components/PageHead.jsx'
import { useProjectModal } from '../components/ProjectModal.jsx'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import usePageTitle from '../hooks/usePageTitle.js'

export default function AboutPage() {
  const openProjectForm = useProjectModal()
  usePageTitle('About Us')
  return (
    <>
      <PageHead
        eyebrow="About us"
        title={<>The people behind <span className="text-gradient">{company.name}</span>.</>}
        intro="A small, focused team building websites and web apps that help businesses grow."
      />

      <Team />
      <Values />

      <section className="py-18 md:py-25" id="story">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h2>Built for businesses that want more from the web</h2>
            {about.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>

          <Reveal index={1}>
            <Card className="gap-0 rounded-xl border-pine-800/10 bg-card/90 p-6 shadow-[0_10px_30px_rgba(11,43,38,0.08)] md:p-9">
              <p className="eyebrow">Our mission</p>
              <p className="font-display text-[1.25rem] leading-normal font-semibold text-foreground">{about.mission}</p>
              <ul className="mt-8 flex flex-wrap justify-start gap-6 border-t border-border pt-6 md:justify-between">
                {about.highlights.map((h) => (
                  <li key={h.label} className="flex flex-col">
                    <strong className="font-display text-[1.6rem] font-bold">{h.value}</strong>
                    <span className="text-[0.9rem] text-muted-foreground">{h.label}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>

        <div className="wrap">
          <Reveal className="mt-20 text-center">
            <h2>Let's build something together</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={openProjectForm}>
                Start your project <span data-arrow aria-hidden="true">→</span>
              </Button>
              <Button asChild variant="outline">
                <Link to="/work">See our work</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
