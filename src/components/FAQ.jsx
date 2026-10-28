import { faqs } from '../data.js'
import Reveal from './Reveal.jsx'
import { WhatsAppLink } from './WhatsAppLink.jsx'
import { useProjectModal } from './ProjectModal.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

// Common questions as an accordion (one open at a time; works with mouse, touch and keyboard)
export default function FAQ() {
  const openProjectForm = useProjectModal()

  return (
    <section className="py-18 md:py-25" id="faq">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">FAQ</p>
          <h2>Questions we often get</h2>
          <p>
            Can't find your answer?{' '}
            <button type="button" onClick={openProjectForm} className="cursor-pointer font-semibold text-pine-600 underline-offset-4 hover:underline">
              Send us your question
            </button>{' '}
            or{' '}
            <WhatsAppLink page="contact" className="font-semibold text-pine-600 underline-offset-4 hover:underline">
              message us on WhatsApp
            </WhatsAppLink>
            .
          </p>
        </Reveal>

        <Reveal index={1}>
          <Accordion type="single" collapsible className="rounded-xl border border-pine-800/10 bg-card/90 px-6 shadow-[0_10px_30px_rgba(11,43,38,0.08)]">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="cursor-pointer py-5 text-left text-base font-semibold text-foreground hover:no-underline hover:text-pine-600">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
