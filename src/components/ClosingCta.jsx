import { CalendarIcon } from 'lucide-react'
import BookCallLink from './BookCall.jsx'
import Reveal from './Reveal.jsx'
import { useProjectModal } from './ProjectModal.jsx'
import { Button } from '@/components/ui/button'

// Dark green band at the end of a page: start a project or book a free call
export default function ClosingCta({ title = "Let's talk about your project" }) {
  const openProjectForm = useProjectModal()

  return (
    <section className="py-18 md:py-25" id="get-started">
      <div className="wrap">
        <Reveal className="rounded-2xl bg-linear-to-br from-primary to-pine-800 px-7 py-12 text-center text-pine-100 shadow-[0_30px_60px_-30px_rgba(5,31,32,0.6)] md:px-12 md:py-16">
          <p className="mb-3 text-[0.8rem] font-semibold tracking-[0.14em] text-pine-300 uppercase">Free, no obligation</p>
          <h2 className="text-pine-50">{title}</h2>
          <p className="mx-auto mb-8 max-w-140 text-pine-100/85">
            Tell us what you need and we'll reply within 24 hours, or book a free 15-minute call to
            talk it through.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={openProjectForm} className="bg-pine-100 text-pine-900 hover:bg-white hover:shadow-[0_8px_20px_-10px_rgba(0,0,0,0.45)]">
              Start your project <span data-arrow aria-hidden="true">→</span>
            </Button>
            <Button asChild variant="outline" className="border-pine-100/40 text-pine-50 hover:border-pine-100 hover:bg-pine-100/10 hover:text-white">
              <BookCallLink>
                <CalendarIcon aria-hidden="true" /> Book a free call
              </BookCallLink>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
