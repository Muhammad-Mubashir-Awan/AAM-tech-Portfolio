import PageHead from '../components/PageHead.jsx'
import Pricing from '../components/Pricing.jsx'
import FAQ from '../components/FAQ.jsx'
import ClosingCta from '../components/ClosingCta.jsx'
import usePageTitle from '../hooks/usePageTitle.js'

export default function PricingPage() {
  usePageTitle('Pricing')
  return (
    <>
      <PageHead
        eyebrow="Pricing"
        title={<>Simple packages, <span className="text-gradient">honest prices</span>.</>}
        intro="Every project is quoted for you, but here's where most of our work starts."
      />
      <Pricing heading={false} />
      <FAQ />
      <ClosingCta title="Not sure which package fits?" />
    </>
  )
}
