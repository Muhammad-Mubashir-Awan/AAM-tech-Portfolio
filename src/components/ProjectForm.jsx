import { useRef, useState } from 'react'
import { company, services } from '../data.js'
import { WhatsAppIcon, WhatsAppLink } from './WhatsAppButton.jsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

export const emptyForm = {
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
// `form` / `setForm` live in the pop-up provider, so a half-written brief survives closing it.
export default function ProjectForm({ openedAt, prefill, form, setForm }) {
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

  const setField = (name) => (value) => setForm((f) => ({ ...f, [name]: value }))
  const req = <span className="text-red-500" aria-hidden="true">*</span>
  const optional = <span className="font-normal text-muted-foreground">(optional)</span>
  const field = 'grid gap-2 text-[0.9rem] font-medium'
  const input = 'h-12 rounded-[10px] bg-background px-4 text-base md:text-[0.95rem]'
  const status_ = 'rounded-[10px] border px-4 py-3 text-[0.9rem] [&_a]:underline'

  return (
    <form className="grid gap-x-5 gap-y-[1.1rem] p-5 md:grid-cols-2 md:p-6" onSubmit={submit}>
      <div className={field}>
        <Label htmlFor="pf-name">Your name {req}</Label>
        <Input id="pf-name" className={input} name="name" value={form.name} onChange={update} required maxLength={80} autoComplete="name" placeholder="Ali Khan" />
      </div>
      <div className={field}>
        <Label htmlFor="pf-email">Email {req}</Label>
        <Input id="pf-email" className={input} type="email" name="email" value={form.email} onChange={update} required autoComplete="email" placeholder="you@company.com" />
      </div>

      <div className={field}>
        <Label htmlFor="pf-company">Company / organisation {optional}</Label>
        <Input id="pf-company" className={input} name="company" value={form.company} onChange={update} maxLength={100} autoComplete="organization" placeholder="Your business name" />
      </div>
      <div className={field}>
        <Label htmlFor="pf-service">What do you need?</Label>
        <Select name="service" value={form.service} onValueChange={setField('service')}>
          <SelectTrigger id="pf-service"><SelectValue placeholder="Choose a service…" /></SelectTrigger>
          <SelectContent>{NEEDS.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className={field}>
        <Label htmlFor="pf-budget">Budget</Label>
        <Select name="budget" value={form.budget} onValueChange={setField('budget')}>
          <SelectTrigger id="pf-budget"><SelectValue placeholder="Choose a range…" /></SelectTrigger>
          <SelectContent>{BUDGETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className={field}>
        <Label htmlFor="pf-timeline">Timeline</Label>
        <Select name="timeline" value={form.timeline} onValueChange={setField('timeline')}>
          <SelectTrigger id="pf-timeline"><SelectValue placeholder="When do you need it?" /></SelectTrigger>
          <SelectContent>{TIMELINES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* "How should we reach you?" pill buttons (real radio inputs, so keyboards work) */}
      <fieldset className="m-0 grid min-w-0 gap-2 border-0 p-0">
        <legend className="mb-2 p-0 text-[0.9rem] font-medium">How should we reach you?</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_WAYS.map((way) => (
            <label key={way} className="block">
              <input type="radio" name="contactVia" value={way} checked={form.contactVia === way} onChange={update} className="peer sr-only" />
              <span className="inline-block cursor-pointer rounded-full border border-border bg-background px-4 py-2.5 text-[0.88rem] transition-colors duration-200 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pine-600 hover:border-primary">
                {way}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className={field}>
        <Label htmlFor="pf-phone">Phone / WhatsApp number {needsPhone ? req : optional}</Label>
        <Input
          id="pf-phone"
          className={input}
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
      </div>

      <div className={`${field} md:col-span-2`}>
        <Label htmlFor="pf-message">Project details {req}</Label>
        <Textarea
          id="pf-message"
          className="min-h-28 rounded-[10px] bg-background px-4 py-3 text-base md:text-[0.95rem]"
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
        <span id="message-count" aria-hidden="true" className={`justify-self-end text-[0.8rem] font-normal ${words >= MIN_WORDS ? 'text-green-700' : 'text-muted-foreground'}`}>
          {words >= MIN_WORDS ? `${words} words ✓` : `${words} / ${MIN_WORDS} words`}
        </span>
      </div>

      {/* Hidden from people; bots that fill it in are dropped by Formspree */}
      <input
        type="text"
        name="_gotcha"
        value={form._gotcha}
        onChange={update}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] size-px opacity-0"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-2">
        <p className="m-0 text-[0.82rem]"><span aria-hidden="true">🔒</span> Your details stay private.</p>
        <Button type="submit" disabled={status === 'sending' || limited} className="max-md:w-full disabled:cursor-progress">
          {status === 'sending' ? 'Sending…' : 'Send project brief'}
        </Button>
      </div>

      <p role="status" aria-live="polite" className={`m-0 empty:hidden md:col-span-2 ${status === 'sent' ? `${status_} border-green-600/35 bg-green-500/10 text-green-700` : status === 'error' ? `${status_} border-red-500/35 bg-red-500/10 text-red-700` : ''}`}>
        {status === 'sent' && "Thanks! Your project brief has been sent — we'll reply within 24 hours."}
        {status === 'error' && (
          <>
            Something went wrong. Please email us at <a href={`mailto:${company.email}`}>{company.email}</a> or
            message us on WhatsApp.
          </>
        )}
      </p>
      {limited && (
        <p className={`${status_} m-0 border-border bg-pine-600/10 text-pine-600 md:col-span-2`}>
          You've sent us {LIMIT} messages today. Thank you, we'll reply soon! For anything urgent, email{' '}
          <a href={`mailto:${company.email}`}>{company.email}</a> or{' '}
          <WhatsAppLink page="contact">message us on WhatsApp</WhatsAppLink>.
        </p>
      )}

      <p className="m-0 text-center text-[0.85rem] md:col-span-2 [&_a]:text-pine-600">
        Prefer to reach us directly? <a href={`mailto:${company.email}`}>{company.email}</a>
        <span aria-hidden="true"> · </span>
        <WhatsAppLink page="contact" className="inline-flex items-center gap-1"><WhatsAppIcon className="size-4 text-[#25d366]" /> WhatsApp</WhatsAppLink>
      </p>
    </form>
  )
}
