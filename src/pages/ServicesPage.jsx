import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import Services from '../components/Services.jsx'
import Process from '../components/Process.jsx'
import TechStack from '../components/TechStack.jsx'
import ClosingCta from '../components/ClosingCta.jsx'
import { useProjectModal } from '../components/ProjectModal.jsx'
import { Button } from '@/components/ui/button'
import usePageTitle from '../hooks/usePageTitle.js'

export default function ServicesPage() {
  const openProjectForm = useProjectModal()
  usePageTitle('Services')
  return (
    <>
      <PageHead
        eyebrow="Our services"
        title={<>Everything you need to <span className="text-gradient">grow online</span>.</>}
        intro="From a simple landing page to a full web application, we handle design, development and launch."
      >
        <Button onClick={openProjectForm}>
          Start your project <span data-arrow aria-hidden="true">→</span>
        </Button>
        <Button asChild variant="outline">
          <Link to="/pricing">See pricing</Link>
        </Button>
      </PageHead>
      <Services detailed />
      <Process />
      <TechStack className="wrap pt-18 md:pt-25" />
      <ClosingCta />
    </>
  )
}
