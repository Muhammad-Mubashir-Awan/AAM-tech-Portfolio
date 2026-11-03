import { useRef, useState } from 'react'
import { MailIcon, PlusIcon } from 'lucide-react'
import { company, services } from '../data.js'
import useIsClient from '../hooks/useIsClient.js'
import FieldError from './FieldError.jsx'
import { WhatsAppIcon, WhatsAppLink } from './WhatsAppLink.jsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LIMIT, recentSends, rememberSend, tooFast } from '@/lib/sendLimit'
import { track } from '@/lib/track'
import { isEmail } from '@/lib/validate'
import { cn } from '@/lib/utils'

// One line isn't enough to quote from, so the message needs at least this many words.
// A word must contain a letter or number (any language), so "- - - -" doesn't count.
const MIN_WORDS = 10
const countWords = (text) => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length

// Also used by the quick quote bar under the home hero (QuickQuote.jsx)
export const NEEDS = [...services.map((s) => s.title), 'Not sure yet']
export const BUDGETS = ['Under Rs 100k', 'Rs 100k – 300k', 'Rs 300k – 800k', 'Rs 800k+', 'Not sure yet']
export const TIMELINES = ['Under 1 month', '1 – 2 months', '3+ months', 'Flexible']
const CONTACT_WAYS = ['Email', 'WhatsApp', 'Phone call']

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

// What is wrong with one field; an empty string means it is fine. The browser's own checks let
// spaces-only text and numbers like "+++++++" through, so the rules live here.
const problemWith = (name, form) => {
  switch (name) {
    case 'name':
      return form.name.trim() ? '' : 'Please enter your name.'
    case 'email':
      if (!form.email.trim()) return 'Please enter your email so we can reply.'
      return isEmail(form.email) ? '' : 'Please enter a valid email address, e.g. you@company.com.'
    case 'phone': {
      const phone = form.phone.trim()
      if (!phone) {
        return form.contactVia === 'Email' ? '' : `Please add a number so we can reach you ${form.contactVia === 'WhatsApp' ? 'on WhatsApp' : 'by phone'}.`
      }
      const digits = phone.replace(/\D/g, '').length
      return /^[0-9+ ()-]+$/.test(phone) && digits >= 7 && digits <= 15 ? '' : 'Please enter a valid phone number, e.g. +92 300 1234567.'
    }
    case 'message': {
      const words = countWords(form.message)
      return words >= MIN_WORDS ? '' : `Please tell us a bit more about your project (at least ${MIN_WORDS} words — you have ${words}).`
    }
    default:
      return ''
  }
}
// The fields that are checked, in the order they appear (and are tabbed through)
const CHECKED = ['name', 'email', 'message', 'phone']

// The "Start a project" form shown in the pop-up and on the Contact page. `openedAt` is when the pop-up was last
// opened, for the bot check: people take more than a few seconds, bots send instantly.
// `form` / `setForm` live in the pop-up provider, so a half-written brief survives closing it
// (and answers picked in the quick quote bar or on a pricing card are already filled in).
// `idPrefix` keeps field ids unique when the form is also shown on the Contact page, and
// `directLinks={false}` hides the email / WhatsApp buttons there (they sit beside the form).
// On phones only the essentials (name, email, message) show at first; the rest opens with
// "Add more details", or straight away when something in it is already filled in.
export default function ProjectForm({ openedAt, form, setForm, idPrefix = 'pf', directLinks = true }) {
  const [errors, setErrors] = useState({}) // field name -> message, only for fields showing a problem
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'
  const [askedForMore, setAskedForMore] = useState(false)
  const isClient = useIsClient()
  // The daily limit is saved in this browser, so it only applies once the page is live
  const [limitReached, setLimitReached] = useState(() => recentSends().length >= LIMIT)
  const limited = isClient && limitReached
  const mountedAt = useRef(Date.now())
  const words = countWords(form.message)
  const needsPhone = form.contactVia !== 'Email'
  const hasErrors = Object.values(errors).some(Boolean)
  const hasExtras = Boolean(form.company || form.service || form.budget || form.timeline || form.phone) || needsPhone
  const showMore = askedForMore || hasExtras || Boolean(errors.phone)

  const update = (e) => {
    const next = { ...form, [e.target.name]: e.target.value }
    setForm(next)
    // A problem that is showing is re-checked as they type, so it disappears once it is fixed
    setErrors((prev) => {
      const out = {}
      for (const name of Object.keys(prev)) {
        const problem = problemWith(name, next)
        if (problem) out[name] = problem
      }
      return out
    })
  }

  // When they leave a field: say what is wrong, but not for a field they haven't typed in yet
  const check = (e) => {
    const { name } = e.target
    if (!CHECKED.includes(name) || !form[name].trim()) return
    const problem = problemWith(name, form)
    if (problem) setErrors((prev) => ({ ...prev, [name]: problem }))
  }

  const submit = async (e) => {
    e.preventDefault()

    // Nothing is sent (or counted towards the daily limit) until the details are real. Every
    // problem is shown beside its field at once, and the first one gets the keyboard focus.
    const found = {}
    for (const name of CHECKED) {
      const problem = problemWith(name, form)
      if (problem) found[name] = problem
    }
    setErrors(found)
    const first = CHECKED.find((name) => found[name])
    if (first) {
      // After the page has redrawn: a folded-away field (phone, on phones) only exists then
      setTimeout(() => document.getElementById(`${idPrefix}-${first}`)?.focus(), 0)
      return
    }

    if (recentSends().length >= LIMIT) {
      setLimitReached(true)
      return
    }

    // Too fast to be a person: pretend it worked so the bot learns nothing
    if (tooFast(openedAt || mountedAt.current)) {
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
      // A lead for Google Analytics. Only the chosen service and budget range go with it, never
      // the name, email, phone or message.
      track('generate_lead', {
        lead_source: idPrefix === 'contact' ? 'contact_page_form' : 'project_popup',
        service: form.service || 'not_chosen',
        budget: form.budget || 'not_chosen',
      })
      notifyWhatsApp(form.name)
      setForm(emptyForm)
      setErrors({})
      setAskedForMore(false)
      setStatus('sent')
      setLimitReached(recentSends().length >= LIMIT)
    } catch {
      setStatus('error')
    }
  }

  const setField = (name) => (value) => setForm((f) => ({ ...f, [name]: value }))
  const req = <span className="text-red-500" aria-hidden="true">*</span>
  const optional = <span className="font-normal text-muted-foreground">(optional)</span>
  const field = 'grid content-start gap-2 text-[0.9rem] font-medium'
  const input = 'h-12 rounded-[10px] bg-background px-4 text-base md:text-[0.95rem]'
  const status_ = 'rounded-[10px] border px-4 py-3 text-[0.9rem] [&_a]:underline'
  const direct = 'inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-[0.85rem] font-medium text-foreground transition-colors hover:border-primary hover:bg-secondary'
  // Points a field at its error message (read out together with the field)
  const invalid = (name, ...otherIds) => {
    const ids = [errors[name] && `${idPrefix}-${name}-error`, ...otherIds].filter(Boolean)
    return { 'aria-invalid': errors[name] ? true : undefined, 'aria-describedby': ids.length ? ids.join(' ') : undefined }
  }
  const tone = status === 'sent'
    ? `${status_} border-green-600/35 bg-green-500/10 text-green-700`
    : status === 'error' || hasErrors
      ? `${status_} border-red-500/35 bg-red-500/10 text-red-700`
      : ''

  const showMoreDetails = () => {
    setAskedForMore(true)
    // Land in the first new field, so keyboard and screen reader users aren't left on a button that vanished
    setTimeout(() => document.getElementById(`${idPrefix}-company`)?.focus(), 0)
  }

  return (
    // noValidate: the checks above show their messages beside each field instead of in a browser pop-up
    <form noValidate className="grid gap-x-5 gap-y-[1.1rem] p-5 md:grid-cols-2 md:p-6" onSubmit={submit}>
      <div className={field}>
        <Label htmlFor={`${idPrefix}-name`}>Your name {req}</Label>
        <Input id={`${idPrefix}-name`} className={input} name="name" value={form.name} onChange={update} onBlur={check} required maxLength={80} autoComplete="name" placeholder="Ali Khan" {...invalid('name')} />
        <FieldError id={`${idPrefix}-name-error`}>{errors.name}</FieldError>
      </div>
      <div className={field}>
        <Label htmlFor={`${idPrefix}-email`}>Email {req}</Label>
        <Input id={`${idPrefix}-email`} className={input} type="email" name="email" value={form.email} onChange={update} onBlur={check} required autoComplete="email" placeholder="you@company.com" {...invalid('email')} />
        <FieldError id={`${idPrefix}-email-error`}>{errors.email}</FieldError>
      </div>

      <div className={`${field} md:col-span-2`}>
        <Label htmlFor={`${idPrefix}-message`}>Project details {req}</Label>
        <Textarea
          id={`${idPrefix}-message`}
          className="min-h-28 rounded-[10px] bg-background px-4 py-3 text-base md:text-[0.95rem]"
          name="message"
          rows="4"
          value={form.message}
          onChange={update}
          onBlur={check}
          required
          maxLength={2000}
          placeholder={`What problem should the website solve, who is it for, and what must it include? (at least ${MIN_WORDS} words)`}
          {...invalid('message', `${idPrefix}-message-count`)}
        />
        {/* Read out with the box via aria-describedby, not on every keystroke */}
        <span id={`${idPrefix}-message-count`} aria-hidden="true" className={`justify-self-end text-[0.8rem] font-normal ${words >= MIN_WORDS ? 'text-green-700' : 'text-muted-foreground'}`}>
          {words >= MIN_WORDS ? `${words} words ✓` : `${words} / ${MIN_WORDS} words`}
        </span>
        <FieldError id={`${idPrefix}-message-error`}>{errors.message}</FieldError>
      </div>

      {/* Phones: the rest of the form stays folded away until it's wanted */}
      {!showMore && (
        <button
          type="button"
          onClick={showMoreDetails}
          aria-expanded="false"
          aria-controls={`${idPrefix}-more`}
          className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-dashed border-border bg-transparent text-[0.9rem] font-semibold text-pine-600 transition-colors hover:border-primary hover:bg-secondary md:hidden"
        >
          <PlusIcon aria-hidden="true" className="size-4" /> Add more details (optional)
        </button>
      )}
      {/* `contents`: the fields join the form's two columns as if there were no wrapper */}
      <div id={`${idPrefix}-more`} className={cn('contents', !showMore && 'max-md:hidden')}>
        <div className={field}>
          <Label htmlFor={`${idPrefix}-company`}>Company / organisation {optional}</Label>
          <Input id={`${idPrefix}-company`} className={input} name="company" value={form.company} onChange={update} maxLength={100} autoComplete="organization" placeholder="Your business name" />
        </div>
        <div className={field}>
          <Label htmlFor={`${idPrefix}-service`}>What do you need?</Label>
          <Select name="service" value={form.service} onValueChange={setField('service')}>
            <SelectTrigger id={`${idPrefix}-service`}><SelectValue placeholder="Choose a service…" /></SelectTrigger>
            <SelectContent>{NEEDS.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className={field}>
          <Label htmlFor={`${idPrefix}-budget`}>Budget</Label>
          <Select name="budget" value={form.budget} onValueChange={setField('budget')}>
            <SelectTrigger id={`${idPrefix}-budget`}><SelectValue placeholder="Choose a range…" /></SelectTrigger>
            <SelectContent>{BUDGETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className={field}>
          <Label htmlFor={`${idPrefix}-timeline`}>Timeline</Label>
          <Select name="timeline" value={form.timeline} onValueChange={setField('timeline')}>
            <SelectTrigger id={`${idPrefix}-timeline`}><SelectValue placeholder="When do you need it?" /></SelectTrigger>
            <SelectContent>{TIMELINES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {/* "How should we reach you?" pill buttons (real radio inputs, so keyboards work) */}
        <fieldset className="m-0 grid min-w-0 content-start gap-2 border-0 p-0">
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
          <Label htmlFor={`${idPrefix}-phone`}>Phone / WhatsApp number {needsPhone ? req : optional}</Label>
          <Input
            id={`${idPrefix}-phone`}
            className={input}
            type="tel"
            name="phone"
            value={form.phone}
            onChange={update}
            onBlur={check}
            required={needsPhone}
            autoComplete="tel"
            inputMode="tel"
            placeholder="+92 300 1234567"
            {...invalid('phone')}
          />
          <FieldError id={`${idPrefix}-phone-error`}>{errors.phone}</FieldError>
        </div>
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

      <p role="status" aria-live="polite" className={`m-0 empty:hidden md:col-span-2 ${tone}`}>
        {status === 'sent' && "Thanks! Your project brief has been sent — we'll reply within 24 hours."}
        {status === 'error' && (
          <>
            Something went wrong. Please email us at <a href={`mailto:${company.email}`}>{company.email}</a> or
            message us on WhatsApp.
          </>
        )}
        {hasErrors && status !== 'sent' && status !== 'error' && 'Please check the highlighted fields and try again.'}
      </p>
      {limited && (
        <p className={`${status_} m-0 border-border bg-pine-600/10 text-pine-600 md:col-span-2`}>
          You've sent us {LIMIT} messages today. Thank you, we'll reply soon! For anything urgent, email{' '}
          <a href={`mailto:${company.email}`}>{company.email}</a> or{' '}
          <WhatsAppLink page="contact">message us on WhatsApp</WhatsAppLink>.
        </p>
      )}

      {/* Other ways to reach us (the Contact page shows these beside the form instead) */}
      {directLinks && (
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-border pt-4 md:col-span-2">
          {/* Own line on phones, so the two buttons stay side by side */}
          <span className="basis-full text-center text-[0.85rem] text-muted-foreground sm:basis-auto">Prefer to reach us directly?</span>
          <a href={`mailto:${company.email}`} className={direct}>
            <MailIcon aria-hidden="true" className="size-4 text-pine-600" /> Email us
          </a>
          <WhatsAppLink page="contact" className={direct}>
            <WhatsAppIcon className="size-4 text-[#25d366]" /> WhatsApp
          </WhatsAppLink>
        </div>
      )}
    </form>
  )
}
