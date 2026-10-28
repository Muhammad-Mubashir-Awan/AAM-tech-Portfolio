import { useEffect, useState } from 'react'
import { company } from '../data.js'
import { Button } from '@/components/ui/button'

const CONSENT_KEY = 'aam-analytics-consent' // 'granted' | 'denied'

const readConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY)
  } catch {
    return null
  }
}

// Loads Google Analytics 4 once. GA4's enhanced measurement (on by default) also counts the
// page changes inside this single-page site, so no manual page_view calls are needed.
let loaded = false
function loadGoogleAnalytics(id) {
  if (loaded) return
  loaded = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments) // gtag expects the arguments object itself
  }
  window.gtag('js', new Date())
  window.gtag('config', id, { anonymize_ip: true })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)
}

// Visitor analytics with a cookie notice. Nothing loads, and no notice shows, until a GA4 ID is
// set in data.js; after that, analytics only starts once the visitor clicks Accept.
export default function Analytics() {
  const id = company.gaId
  const [consent, setConsent] = useState(readConsent)

  useEffect(() => {
    if (id && consent === 'granted') loadGoogleAnalytics(id)
  }, [id, consent])

  if (!id || consent) return null

  const choose = (value) => {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {
      // Storage blocked: the choice lasts for this visit only
    }
    setConsent(value)
  }

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed right-4 bottom-4 left-4 z-40 rounded-xl border border-border bg-card p-4 shadow-[0_16px_40px_-16px_rgba(5,31,32,0.45)] md:right-auto md:bottom-6 md:left-6 md:max-w-md md:p-5"
    >
      <p className="mb-3 text-[0.9rem] text-foreground">
        We use cookies to understand how visitors use our site, so we can improve it. No ads, no selling data.
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => choose('granted')}>Accept</Button>
        <Button size="sm" variant="outline" onClick={() => choose('denied')}>Decline</Button>
      </div>
    </div>
  )
}
