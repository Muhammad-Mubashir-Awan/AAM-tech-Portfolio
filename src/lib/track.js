import { company } from '../data.js'

// Sends a Google Analytics event, but only while analytics is running: the visitor accepted
// cookies (that is when window.gtag exists) and has not declined since (Google's own
// "ga-disable" switch, set in Analytics.jsx). Otherwise it does nothing.
export function track(name, params = {}) {
  try {
    if (typeof window.gtag === 'function' && window[`ga-disable-${company.gaId}`] !== true) {
      window.gtag('event', name, params)
    }
  } catch {
    // Analytics must never break the page
  }
}
