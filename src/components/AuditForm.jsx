import { useRef, useState } from 'react'
import { company } from '../data.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LIMIT, recentSends, rememberSend, tooFast } from '@/lib/sendLimit'
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

// Free website audit request: website + email, sent through the same Formspree form and
// sharing the 2-a-day limit with the project form
export default function AuditForm({ className }) {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'
  const [limited, setLimited] = useState(() => recentSends().length >= LIMIT)
  const startedAt = useRef(Date.now())

  const update = (e) => {
    e.target.setCustomValidity('')
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submit = async (e) => {
    e.preventDefault()
    const site = e.currentTarget.elements.website
    const website = normaliseUrl(form.website)
    if (!website) {
      site.setCustomValidity('Please enter your website address, e.g. mybusiness.com')
      site.reportValidity()
      return
    }
    if (recentSends().length >= LIMIT) {
      setLimited(true)
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
      setForm(empty)
      setStatus('sent')
      setLimited(recentSends().length >= LIMIT)
    } catch {
      setStatus('error')
    }
  }

  const input = 'h-12 rounded-[10px] bg-background px-4 text-base md:text-[0.95rem]'

  return (
    <form onSubmit={submit} className={cn('grid gap-4 rounded-xl bg-card p-6 text-foreground md:p-7', className)} aria-labelledby="audit-title">
      <div>
        <h3 id="audit-title" className="mb-1.5">Free website audit</h3>
        <p className="mb-0 text-[0.92rem]">
          Send us your website and we'll email you 3 quick wins for speed, design and SEO within 48 hours.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="audit-website">Your website</Label>
        <Input id="audit-website" name="website" className={input} value={form.website} onChange={update} required inputMode="url" autoComplete="url" placeholder="mybusiness.com" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="audit-email">Email</Label>
          <Input id="audit-email" name="email" type="email" className={input} value={form.email} onChange={update} required autoComplete="email" placeholder="you@company.com" />
        </div>
        <div className="grid gap-2">
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
        {limited && status !== 'sent' && (
          <span className="text-pine-600">
            You've already sent us {LIMIT} requests today. Thank you, we'll be in touch soon!
          </span>
        )}
      </p>
    </form>
  )
}
