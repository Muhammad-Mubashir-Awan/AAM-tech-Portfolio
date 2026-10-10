import { useRef, useState } from 'react'
import { company } from '../data.js'
import Reveal from './Reveal.jsx'
import { WhatsAppIcon, WhatsAppLink } from './WhatsAppButton.jsx'

const nextSteps = [
  { title: 'We reply within 24 hours', text: 'A real person reads every message and gets back to you.' },
  { title: 'A free discovery call', text: 'We talk through your goals, audience and must-haves.' },
  { title: 'Proposal & quote', text: 'A clear plan, timeline and fixed price — no surprises.' },
]

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

const emptyForm ={ name: '', email: '', phone: '', message: '', _gotcha: '' }

export default function Contact() {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'
  const [limited, setLimited] = useState(() => recentSends().length >= LIMIT)
  // Bots fill in and send forms instantly; people take more than a few seconds
  const openedAt = useRef(Date.now())
  const words = countWords(form.message)

  const update = (e) => {
    e.target.setCustomValidity('') // clear any message from invalid() once they edit the field
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // The browser's own checks let spaces-only text and numbers like "+++++++" through.
  // Returns the first field that is still not good enough, after showing the reason on it.
  const invalid = (formEl) => {
    const digits = form.phone.replace(/\D/g, '').length
    const problems = [
      ['name', !form.name.trim() && 'Please enter your name.'],
      ['message', words < MIN_WORDS &&
        `Please tell us a bit more about your project (at least ${MIN_WORDS} words — you have ${words}).`],
      ['phone', form.phone.trim() && (digits < 7 || digits > 15) && 'Please enter a valid phone number, e.g. +92 300 1234567.'],
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
    if (Date.now() - openedAt.current < 3000) {
      setStatus('sent')
      return
    }

    // No Formspree form yet: open the visitor's email client with the message pre-filled
    if (!company.formspreeId) {
      const subject = encodeURIComponent(`Project enquiry from ${form.name}`)
      const contact = form.phone ? `${form.email}, ${form.phone}` : form.email
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${contact})`)
      window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`
      return
    }

    // Formspree emails the message to us; the visitor's address becomes the reply-to
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${company.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, _subject: `Project enquiry from ${form.name}` }),
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
    <section className="section" id="contact">
      <div className="container contact">
        <Reveal>
          <h2>What happens next</h2>
          <ol className="contact__steps">
            {nextSteps.map((s, i) => (
              <li key={s.title}>
                <span className="contact__step-num">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <ul className="contact__info">
            <li><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></li>
            <li>
              <span>WhatsApp</span>
              <WhatsAppLink page="contact" className="contact__whatsapp">
                <WhatsAppIcon /> Chat with us
              </WhatsAppLink>
            </li>
            <li><span>Location</span>{company.address || company.location}</li>
          </ul>
        </Reveal>

        <Reveal as="form" className="form" index={1} onSubmit={submit}>
          <label>
            Name
            <input name="name" value={form.name} onChange={update} required maxLength={80} placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={update} required placeholder="you@example.com" />
          </label>
          <label>
            <span>
              Phone / WhatsApp <span className="form__hint">(optional)</span>
            </span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={update}
              autoComplete="tel"
              inputMode="tel"
              pattern="[0-9+ \(\)\-]{7,20}"
              title="Numbers only, e.g. +92 300 1234567"
              placeholder="+92 300 1234567"
            />
          </label>
          <label>
            Project details
            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={update}
              required
              maxLength={2000}
              aria-describedby="message-count"
              placeholder={`Tell us about your business, what you'd like built and any deadlines (at least ${MIN_WORDS} words).`}
            />
            {/* Read out with the box via aria-describedby, not on every keystroke */}
            <span
              id="message-count"
              className={`form__count${words >= MIN_WORDS ? ' form__count--ok' : ''}`}
              aria-hidden="true"
            >
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
          <button className="btn" type="submit" disabled={status === 'sending' || limited}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <p className={`form__status form__status--${status}`} role="status" aria-live="polite">
            {status === 'sent' && "Thanks! Your message has been sent — we'll reply within 24 hours."}
            {status === 'error' && (
              <>
                Something went wrong. Please email us at <a href={`mailto:${company.email}`}>{company.email}</a> or
                message us on WhatsApp.
              </>
            )}
          </p>
          {limited && (
            <p className="form__status form__status--limit">
              You've sent us {LIMIT} messages today. Thank you, we'll reply soon! For anything urgent, email{' '}
              <a href={`mailto:${company.email}`}>{company.email}</a> or{' '}
              <WhatsAppLink page="contact">message us on WhatsApp</WhatsAppLink>.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
