import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { company } from '../data.js'
import useIsClient from '../hooks/useIsClient.js'
import { Button } from '@/components/ui/button'
import { track } from '@/lib/track'

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

// The footer's "Cookie settings" link fires this to show the notice again
const SETTINGS_EVENT = 'aam:cookie-settings'
export const openCookieSettings = () => window.dispatchEvent(new Event(SETTINGS_EVENT))

// Visitor analytics with a cookie notice. Nothing loads, and no notice shows, until a GA4 ID is
// set in data.js; after that, analytics only starts once the visitor clicks Accept. The choice is
// remembered in this browser, so the notice only comes back through "Cookie settings".
export default function Analytics() {
  const id = company.gaId
  const isClient = useIsClient()
  const [consent, setConsent] = useState(readConsent)
  const barRef = useRef(null)
  const focusBar = useRef(false)

  useEffect(() => {
    if (!id) return
    // Google's own switch: true stops gtag.js sending anything, even after it has loaded
    window[`ga-disable-${id}`] = consent !== 'granted'
    if (consent === 'granted') loadGoogleAnalytics(id)
  }, [id, consent])

  // Reopened from the footer: show the notice and move keyboard focus into it
  useEffect(() => {
    const reopen = () => {
      focusBar.current = true
      setConsent(null)
    }
    window.addEventListener(SETTINGS_EVENT, reopen)
    return () => window.removeEventListener(SETTINGS_EVENT, reopen)
  }, [])

  useEffect(() => {
    if (consent || !focusBar.current) return
    focusBar.current = false
    barRef.current?.querySelector('button')?.focus()
  }, [consent])

  // Counts taps on the contact links (WhatsApp, email, phone, booking page) as events. Only the
  // button's own text is sent, never anything a visitor typed. track() does nothing unless the
  // visitor accepted cookies.
  useEffect(() => {
    if (!id) return
    const onClick = (e) => {
      const link = e.target instanceof Element ? e.target.closest('a[href]') : null
      if (!link) return
      const href = link.getAttribute('href')
      // The first line of the link's text, e.g. "Book a free call" (not its small print)
      const link_text = (link.innerText || link.textContent).trim().split('\n')[0].trim().slice(0, 40)
      if (href.includes('wa.me/')) track('whatsapp_click', { link_text })
      else if (href.startsWith('mailto:')) track('email_click', { link_text })
      else if (href.startsWith('tel:')) track('phone_click', { link_text })
      else if (company.calLink && href === company.calLink) track('book_call_click', { link_text })
    }
    // Capture phase: runs before a link's own handler (the Android WhatsApp link redirects)
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [id])

  // Never in the pre-built HTML: whether to ask depends on the choice saved in this browser
  if (!isClient || !id || consent) return null

  const choose = (value) => {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {
      // Storage blocked: the choice lasts for this visit only
    }
    setConsent(value)
  }

  return (
    // Centred along the bottom; text and buttons share one row on wider screens
    <div
      ref={barRef}
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-2xl rounded-xl border border-border bg-card p-3 shadow-[0_16px_40px_-16px_rgba(5,31,32,0.45)] md:bottom-6 md:flex md:items-center md:gap-6 md:p-5"
    >
      <p className="mb-2.5 text-[0.8125rem] leading-snug text-foreground md:mb-0 md:flex-1 md:text-[0.9rem] md:leading-normal">
        We use cookies to count visits and improve the site. No ads, no selling data.{' '}
        <Link to="/privacy" className="font-medium text-pine-600 underline underline-offset-2">Privacy policy</Link>
      </p>
      {/* On phones the two buttons share the row, which keeps the notice short */}
      <div className="flex flex-none gap-2 max-md:[&>button]:flex-1">
        <Button size="sm" className="pointer-coarse:min-h-11" onClick={() => choose('granted')}>Accept</Button>
        <Button size="sm" variant="outline" className="pointer-coarse:min-h-11" onClick={() => choose('denied')}>Decline</Button>
      </div>
    </div>
  )
}
