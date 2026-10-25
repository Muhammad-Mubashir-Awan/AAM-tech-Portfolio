import { useRef, useState } from 'react'
import { company, services } from '../data.js'
import { WhatsAppIcon, WhatsAppLink } from './WhatsAppButton.jsx'

// Formspree's free plan allows 50 messages a month, so each browser may send
// at most LIMIT messages per 24 hours. This lives in the visitor's browser, so it
// stops casual repeat sending; a determined person could still get round it.
const LIMIT = 2
const DAY = 24 * 60 * 60 * 1000
const SENT_KEY = 'aam-contact-sent'

// One line isn't enough to quote from, so the message needs at least this many words.
// A word must contain a letter or number (any language), so "- - - -" doesn't count.
const MIN_WORDS = 10
const countWords = (text) => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length

// Also used by the quick quote bar under the home hero (QuickQuote.jsx)
export const NEEDS = [...services.map((s) => s.title), 'Not sure yet']
export const BUDGETS = ['Under Rs 100k', 'Rs 100k – 300k', 'Rs 300k – 800k', 'Rs 800k+', 'Not sure yet']
export const TIMELINES = ['Under 1 month', '1 – 2 months', '3+ months', 'Flexible']
const CONTACT_WAYS = ['Email', 'WhatsApp', 'Phone call']

const recentSends = () => {
  try {
    const times = JSON.parse(localStorage.getItem(SENT_KEY)) || []
    return times.filter((t) => Date.now() - t < DAY)
  } catch {
    return []
  }
}

const rememberSend = () => {
  try {
    localStorage.setItem(SENT_KEY, JSON.stringify([...recentSends(), Date.now()]))
  } catch {
    // Storage blocked: no limit, but sending still works
  }
}

// Pings the owner's WhatsApp so they know to check their email. Fire-and-forget: the reply isn't
// needed, and a failure here must never make a message that was sent look like it failed.
const notifyWhatsApp = (name) => {
  if (!company.callmebotKey) return
  try {
    const text = `New enquiry from ${name.trim().slice(0, 40)} — check your email.`
    const url =
      `https://api.callmebot.com/whatsapp.php?phone=${company.whatsapp}` +
      `&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(company.callmebotKey)}`
    fetch(url, { mode: 'no-cors' }).catch(() => {})
  } catch {
    // Alert is a nice-to-have
  }
}

const emptyForm = {
  name: '',
  email: '',
  company: '',
  service: '',
  budget: '',
  timeline: '',
  contactVia: 'Email',
  phone: '',
  message: '',
  _gotcha: '',
}

// The "Start a project" form shown in the pop-up. `openedAt` is when the pop-up was last
// opened, for the bot check: people take more than a few seconds, bots send instantly.
// `prefill` holds answers already picked in the quick quote bar (service, budget, timeline).
export default function ProjectForm({ openedAt, prefill }) {
  const [form, setForm] = useState(emptyForm)
  // Each time the pop-up opens with answers from the quick bar, copy them in. Done while
  // rendering (React's pattern for adjusting state when a prop changes), not in an effect.
  const [filledFor, setFilledFor] = useState(0)
  if (prefill && openedAt !== filledFor) {
    setFilledFor(openedAt)
    const picked = Object.fromEntries(Object.entries(prefill).filter(([k, v]) => v && k in emptyForm))
    setForm((f) => ({ ...f, ...picked }))
  }
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'
  const [limited, setLimited] = useState(() => recentSends().length >= LIMIT)
  const mountedAt = useRef(Date.now())
  const words = countWords(form.message)
  const needsPhone = form.contactVia !== 'Email'

  const update = (e) => {
    e.target.setCustomValidity('') // clear any message from invalid() once they edit the field
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // The browser's own checks let spaces-only text and numbers like "+++++++" through.
  // Returns the first field that is still not good enough, after showing the reason on it.
  const invalid = (formEl) => {
    const digits = form.phone.replace(/\D/g, '').length
    const badPhone = digits < 7 || digits > 15
    const problems = [
      ['name', !form.name.trim() && 'Please enter your name.'],
      ['phone', needsPhone && !form.phone.trim() && `Please add a number so we can reach you by ${form.contactVia.toLowerCase()}.`],
      ['phone', form.phone.trim() && badPhone && 'Please enter a valid phone number, e.g. +92 300 1234567.'],
      ['message', words < MIN_WORDS &&
        `Please tell us a bit more about your project (at least ${MIN_WORDS} words — you have ${words}).`],
    ]
    for (const [name, problem] of problems) {
      if (!problem) continue
      const field = formEl.elements[name]
      field.setCustomValidity(problem)
      field.reportValidity()
      return field
    }
    return null
  }

  const submit = async (e) => {
    e.preventDefault()

    // Nothing is sent (or counted towards the daily limit) until the details are real
    if (invalid(e.currentTarget)) return

    if (recentSends().length >= LIMIT) {
      setLimited(true)
      return
    }

    // Too fast to be a person: pretend it worked so the bot learns nothing
    if (Date.now() - (openedAt ?? mountedAt.current) < 3000) {
      setStatus('sent')
      return
    }

    // The same details, labelled, for the email we receive
    const details = {
      Name: form.name,
      Email: form.email,
      Company: form.company || '—',
      'Needs help with': form.service || '—',
      Budget: form.budget || '—',
      Timeline: form.timeline || '—',
      'Reach them by': form.contactVia,
      'Phone / WhatsApp': form.phone || '—',
    }

    // No Formspree form yet: open the visitor's email client with the message pre-filled
    if (!company.formspreeId) {
      const subject = encodeURIComponent(`Project enquiry from ${form.name}`)
      const lines = Object.entries(details).map(([k, v]) => `${k}: ${v}`).join('\n')
      const body = encodeURIComponent(`${form.message}\n\n${lines}`)
      window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`
      return
    }

    // Formspree emails it to us; `email` becomes the reply-to address
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${company.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...details,
          email: form.email,
          message: form.message,
          _gotcha: form._gotcha,
          _subject: `Project enquiry from ${form.name}`,
        }),
      })
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`)
      rememberSend()
      notifyWhatsApp(form.name)
      setForm(emptyForm)
      setStatus('sent')
      setLimited(recentSends().length >= LIMIT)
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="form form--grid" onSubmit={submit}>
      <label>
        <span>Your name <span className="form__req" aria-hidden="true">*</span></span>
        <input name="name" value={form.name} onChange={update} required maxLength={80} autoComplete="name" placeholder="Ali Khan" />
      </label>
      <label>
        <span>Email <span className="form__req" aria-hidden="true">*</span></span>
        <input type="email" name="email" value={form.email} onChange={update} required autoComplete="email" placeholder="you@company.com" />
      </label>

      <label>
        <span>Company / organisation <span className="form__hint">(optional)</span></span>
        <input name="company" value={form.company} onChange={update} maxLength={100} autoComplete="organization" placeholder="Your business name" />
      </label>
      <label>
        What do you need?
        <select name="service" value={form.service} onChange={update}>
          <option value="">Choose a service…</option>
          {NEEDS.map((n) => <option key={n}>{n}</option>)}
        </select>
      </label>

      <label>
        Budget
        <select name="budget" value={form.budget} onChange={update}>
          <option value="">Choose a range…</option>
          {BUDGETS.map((b) => <option key={b}>{b}</option>)}
        </select>
      </label>
      <label>
        Timeline
        <select name="timeline" value={form.timeline} onChange={update}>
          <option value="">When do you need it?</option>
          {TIMELINES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>

      <fieldset className="choice">
        <legend>How should we reach you?</legend>
        <div className="choice__options">
          {CONTACT_WAYS.map((way) => (
            <label key={way} className="choice__option">
              <input type="radio" name="contactVia" value={way} checked={form.contactVia === way} onChange={update} />
              <span>{way}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        <span>
          Phone / WhatsApp number{' '}
          {needsPhone ? <span className="form__req" aria-hidden="true">*</span> : <span className="form__hint">(optional)</span>}
        </span>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={update}
          required={needsPhone}
          autoComplete="tel"
          inputMode="tel"
          pattern="[0-9+ \(\)\-]{7,20}"
          title="Numbers only, e.g. +92 300 1234567"
          placeholder="+92 300 1234567"
        />
      </label>

      <label className="form__wide">
        <span>Project details <span className="form__req" aria-hidden="true">*</span></span>
        <textarea
          name="message"
          rows="4"
          value={form.message}
          onChange={update}
          required
          maxLength={2000}
          aria-describedby="message-count"
          placeholder={`What problem should the website solve, who is it for, and what must it include? (at least ${MIN_WORDS} words)`}
        />
        {/* Read out with the box via aria-describedby, not on every keystroke */}
        <span id="message-count" className={`form__count${words >= MIN_WORDS ? ' form__count--ok' : ''}`} aria-hidden="true">
          {words >= MIN_WORDS ? `${words} words ✓` : `${words} / ${MIN_WORDS} words`}
        </span>
      </label>

      {/* Hidden from people; bots that fill it in are dropped by Formspree */}
      <input
        type="text"
        name="_gotcha"
        value={form._gotcha}
        onChange={update}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="form__trap"
      />

      <div className="form__footer form__wide">
        <p className="form__private"><span aria-hidden="true">🔒</span> Your details stay private.</p>
        <button className="btn" type="submit" disabled={status === 'sending' || limited}>
          {status === 'sending' ? 'Sending…' : 'Send project brief'}
        </button>
      </div>

      <p className={`form__status form__status--${status} form__wide`} role="status" aria-live="polite">
        {status === 'sent' && "Thanks! Your project brief has been sent — we'll reply within 24 hours."}
        {status === 'error' && (
          <>
            Something went wrong. Please email us at <a href={`mailto:${company.email}`}>{company.email}</a> or
            message us on WhatsApp.
          </>
        )}
      </p>
      {limited && (
        <p className="form__status form__status--limit form__wide">
          You've sent us {LIMIT} messages today. Thank you, we'll reply soon! For anything urgent, email{' '}
          <a href={`mailto:${company.email}`}>{company.email}</a> or{' '}
          <WhatsAppLink page="contact">message us on WhatsApp</WhatsAppLink>.
        </p>
      )}

      <p className="form__direct form__wide">
        Prefer to reach us directly? <a href={`mailto:${company.email}`}>{company.email}</a>
        <span aria-hidden="true"> · </span>
        <WhatsAppLink page="contact" className="form__whatsapp"><WhatsAppIcon /> WhatsApp</WhatsAppLink>
      </p>
    </form>
  )
}
