// Formspree's free plan allows 50 messages a month, so each browser may send at most LIMIT
// messages per 24 hours, shared by every form on the site (project brief, free audit).
// This lives in the visitor's browser, so it stops casual repeat sending; a determined
// person could still get round it.
export const LIMIT = 2
const DAY = 24 * 60 * 60 * 1000
const SENT_KEY = 'aam-contact-sent'

// Times of this browser's sends in the last 24 hours
export const recentSends = () => {
  try {
    const times = JSON.parse(localStorage.getItem(SENT_KEY)) || []
    return times.filter((t) => Date.now() - t < DAY)
  } catch {
    return []
  }
}

export const rememberSend = () => {
  try {
    localStorage.setItem(SENT_KEY, JSON.stringify([...recentSends(), Date.now()]))
  } catch {
    // Storage blocked: no limit, but sending still works
  }
}

// People take more than a few seconds to fill in a form; bots send instantly
export const tooFast = (startedAt) => Date.now() - startedAt < 3000
