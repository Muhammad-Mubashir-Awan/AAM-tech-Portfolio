import { Link } from 'react-router-dom'
import Projects from '../components/Projects.jsx'
import PageHead from '../components/PageHead.jsx'
import { useProjectModal } from '../components/ProjectModal.jsx'
import { Button } from '@/components/ui/button'
import usePageTitle from '../hooks/usePageTitle.js'

export default function Work() {
  const openProjectForm = useProjectModal()
  usePageTitle('Our Work')
  return (
    <>
      <PageHead
        eyebrow="Our portfolio"
        title={<>Work that <span className="text-gradient">speaks for itself</span>.</>}
        intro="A selection of websites and apps we have designed and built for our clients."
      >
        <Button onClick={openProjectForm}>
          Start your project <span data-arrow aria-hidden="true">→</span>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </PageHead>
      <Projects />
    </>
  )
}
