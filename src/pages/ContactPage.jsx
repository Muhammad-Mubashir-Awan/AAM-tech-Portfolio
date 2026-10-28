import { useState } from 'react'
import { CalendarIcon, MailIcon, MapPinIcon } from 'lucide-react'
import { company } from '../data.js'
import PageHead from '../components/PageHead.jsx'
import Reveal from '../components/Reveal.jsx'
import ProjectForm, { emptyForm } from '../components/ProjectForm.jsx'
import AuditForm from '../components/AuditForm.jsx'
import BookCallLink from '../components/BookCall.jsx'
import { WhatsAppIcon, WhatsAppLink } from '../components/WhatsAppLink.jsx'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import usePageTitle from '../hooks/usePageTitle.js'

const card = 'rounded-xl border-pine-800/10 bg-card shadow-[0_10px_30px_rgba(11,43,38,0.08)]'
const row = 'flex items-center gap-3.5 rounded-lg p-2 -mx-2 text-foreground'
const rowIcon = 'grid size-10 flex-none place-items-center rounded-full bg-pine-600/10 text-pine-600'

// Every way to reach us on one page: the project form, WhatsApp, a free call, email
// and the free website audit
export default function ContactPage() {
  usePageTitle('Contact Us')
  // Separate from the pop-up's draft, so the two forms never overwrite each other
  const [form, setForm] = useState(emptyForm)

  return (
    <>
      <PageHead
        eyebrow="Contact us"
        title={<>Let's talk about <span className="text-gradient">your project</span>.</>}
        intro="Send us a project brief, chat on WhatsApp, book a free call or ask for a free website audit. We reply within 24 hours."
      />

      <section className="pt-10 pb-18 md:pb-25">
        <div className="wrap grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <Card className={`gap-0 overflow-hidden p-0 ${card}`}>
              <div className="border-b border-border px-5 pt-6 pb-4 md:px-6">
                <h2 className="mb-1 text-[1.4rem]">Start a project</h2>
                <p className="mb-0 text-[0.92rem]">Tell us about your idea and we'll get back to you within 24 hours.</p>
              </div>
              <ProjectForm idPrefix="contact" directLinks={false} form={form} setForm={setForm} />
            </Card>
          </Reveal>

          <div className="grid gap-6">
            <Reveal index={1}>
              <Card className={`gap-0 p-6 md:p-7 ${card}`}>
                <h2 className="mb-1.5 text-[1.4rem]">Prefer to talk?</h2>
                <p className="mb-5 text-[0.92rem]">Message us on WhatsApp for a quick answer.</p>
                <Button asChild className="w-full bg-[#25d366] text-pine-900 hover:bg-[#1fc05c]">
                  <WhatsAppLink page="contact">
                    <WhatsAppIcon className="size-5" /> Chat on WhatsApp
                  </WhatsAppLink>
                </Button>
                <ul className="mt-6 grid gap-2 border-t border-border pt-5">
                  <li>
                    <BookCallLink className={`${row} transition-colors hover:bg-secondary`}>
                      <span className={rowIcon}><CalendarIcon aria-hidden="true" className="size-[18px]" /></span>
                      <span className="grid">
                        <span className="font-semibold">Book a free call</span>
                        <span className="text-[0.85rem] text-muted-foreground">15 minutes · online · no obligation</span>
                      </span>
                    </BookCallLink>
                  </li>
                  <li>
                    <a href={`mailto:${company.email}`} className={`${row} transition-colors hover:bg-secondary`}>
                      <span className={rowIcon}><MailIcon aria-hidden="true" className="size-[18px]" /></span>
                      <span className="grid min-w-0">
                        <span className="font-semibold">Email us</span>
                        <span className="text-[0.85rem] [overflow-wrap:anywhere] text-muted-foreground">{company.email}</span>
                      </span>
                    </a>
                  </li>
                  <li className={row}>
                    <span className={rowIcon}><MapPinIcon aria-hidden="true" className="size-[18px]" /></span>
                    <span className="grid">
                      <span className="font-semibold">Where we are</span>
                      <span className="text-[0.85rem] text-muted-foreground">{company.location}</span>
                    </span>
                  </li>
                </ul>
              </Card>
            </Reveal>

            <Reveal index={2}>
              <AuditForm className={`border ${card}`} />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
