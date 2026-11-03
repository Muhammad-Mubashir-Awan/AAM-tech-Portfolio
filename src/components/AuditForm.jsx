import { useRef, useState } from 'react'
import { company } from '../data.js'
import useIsClient from '../hooks/useIsClient.js'
import FieldError from './FieldError.jsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LIMIT, recentSends, rememberSend, tooFast } from '@/lib/sendLimit'
import { track } from '@/lib/track'
import { isEmail } from '@/lib/validate'
import { cn } from '@/lib/utils'

const empty = { website: '', email: '', name: '', _gotcha: '' }

// "mybusiness.com" -> "https://mybusiness.com"; returns '' when it isn't a usable address
const normaliseUrl = (text) => {
  const raw = text.trim()
  if (!raw) return ''
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
    return url.hostname.includes('.') ? url.href : ''
  } catch {
    return ''
  }
}

// What is wrong with one field; an empty string means it is fine
const problemWith = (name, form) => {
  if (name === 'website') {
    return normaliseUrl(form.website) ? '' : 'Please enter your website address, e.g. mybusiness.com'
  }
  if (name === 'email') {
    if (!form.email.trim()) return 'Please enter your email so we can send your audit.'
    return isEmail(form.email) ? '' : 'Please enter a valid email address, e.g. you@company.com.'
  }
  return ''
}
// In the order they appear on the page
const CHECKED = ['website', 'email']

// Free website audit request: website + email, sent through the same Formspree form and
// sharing the 2-a-day limit with the project form
export default function AuditForm({ className }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({}) // field name -> message, only for fields showing a problem
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'
  const isClient = useIsClient()
  // The daily limit is saved in this browser, so it only applies once the page is live
  const [limitReached, setLimitReached] = useState(() => recentSends().length >= LIMIT)
  const limited = isClient && limitReached
  const startedAt = useRef(Date.now())
  const hasErrors = Object.values(errors).some(Boolean)

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
    const found = {}
    for (const name of CHECKED) {
      const problem = problemWith(name, form)
      if (problem) found[name] = problem
    }
    setErrors(found)
    const first = CHECKED.find((name) => found[name])
    if (first) {
      setTimeout(() => document.getElementById(`audit-${first}`)?.focus(), 0)
      return
    }

    const website = normaliseUrl(form.website)
    if (recentSends().length >= LIMIT) {
      setLimitReached(true)
      return
    }
    // Too fast to be a person: pretend it worked so the bot learns nothing
    if (tooFast(startedAt.current)) {
      setStatus('sent')
      return
    }

    const details = { Request: 'Free website audit', Website: website, Name: form.name || '—', Email: form.email }
    if (!company.formspreeId) {
      const body = Object.entries(details).map(([k, v]) => `${k}: ${v}`).join('\n')
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent('Free website audit request')}&body=${encodeURIComponent(body)}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${company.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...details,
          email: form.email,
          message: `Please send a free audit for ${website}`,
          _gotcha: form._gotcha,
          _subject: `Free website audit request: ${website}`,
        }),
      })
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`)
      rememberSend()
      track('generate_lead', { lead_source: 'free_audit' })
      setForm(empty)
      setStatus('sent')
      setLimitReached(recentSends().length >= LIMIT)
    } catch {
      setStatus('error')
    }
  }

  const input = 'h-12 rounded-[10px] bg-background px-4 text-base md:text-[0.95rem]'
  // Points a field at its error message (read out together with the field)
  const invalid = (name) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `audit-${name}-error` : undefined,
  })

  return (
    // noValidate: the checks above show their messages beside each field instead of in a browser pop-up
    <form noValidate onSubmit={submit} className={cn('grid gap-4 rounded-xl bg-card p-6 text-foreground md:p-7', className)} aria-labelledby="audit-title">
      <div>
        <h3 id="audit-title" className="mb-1.5">Free website audit</h3>
        <p className="mb-0 text-[0.92rem]">
          Send us your website and we'll email you 3 quick wins for speed, design and SEO within 48 hours.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="audit-website">Your website</Label>
        <Input id="audit-website" name="website" className={input} value={form.website} onChange={update} onBlur={check} required inputMode="url" autoComplete="url" placeholder="mybusiness.com" {...invalid('website')} />
        <FieldError id="audit-website-error">{errors.website}</FieldError>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid content-start gap-2">
          <Label htmlFor="audit-email">Email</Label>
          <Input id="audit-email" name="email" type="email" className={input} value={form.email} onChange={update} onBlur={check} required autoComplete="email" placeholder="you@company.com" {...invalid('email')} />
          <FieldError id="audit-email-error">{errors.email}</FieldError>
        </div>
        <div className="grid content-start gap-2">
          <Label htmlFor="audit-name">Name <span className="font-normal text-muted-foreground">(optional)</span></Label>
          <Input id="audit-name" name="name" className={input} value={form.name} onChange={update} maxLength={80} autoComplete="name" placeholder="Ali Khan" />
        </div>
      </div>
      {/* Hidden from people; bots that fill it in are dropped by Formspree */}
      <input type="text" name="_gotcha" value={form._gotcha} onChange={update} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] size-px opacity-0" />
      <Button type="submit" disabled={status === 'sending' || limited} className="w-full disabled:cursor-progress">
        {status === 'sending' ? 'Sending…' : 'Get my free audit'}
      </Button>
      <p role="status" aria-live="polite" className="m-0 text-[0.88rem] empty:hidden">
        {status === 'sent' && <span className="text-green-700">Thanks! We'll email your audit within 48 hours.</span>}
        {status === 'error' && (
          <span className="text-red-700">
            Something went wrong. Please email us at <a className="underline" href={`mailto:${company.email}`}>{company.email}</a>.
          </span>
        )}
        {hasErrors && status !== 'sent' && status !== 'error' && (
          <span className="text-red-700">Please check the highlighted fields and try again.</span>
        )}
        {limited && status !== 'sent' && (
          <span className="text-pine-600">
            You've already sent us {LIMIT} requests today. Thank you, we'll be in touch soon!
          </span>
        )}
      </p>
    </form>
  )
}
