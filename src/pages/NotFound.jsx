import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import { Button } from '@/components/ui/button'
import usePageTitle from '../hooks/usePageTitle.js'

// Shown for any address that isn't one of the site's pages (broken or mistyped links)
export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <div className="pb-18 md:pb-25">
      <PageHead
        eyebrow="Error 404"
        title={<>This page <span className="text-gradient">doesn't exist</span>.</>}
        intro="The link may be broken, or the page may have moved. Try one of these instead."
      >
        <Button asChild>
          <Link to="/">Back to home <span data-arrow aria-hidden="true">→</span></Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/services">Our services</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/contact">Contact us</Link>
        </Button>
      </PageHead>
    </div>
  )
}
