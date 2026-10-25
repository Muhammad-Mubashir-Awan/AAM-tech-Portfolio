import { useState } from 'react'
import { BUDGETS, NEEDS, TIMELINES } from './ProjectForm.jsx'
import { useProjectModal } from './ProjectModal.jsx'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const FIELDS = [
  { name: 'service', label: 'What do you need?', placeholder: 'Choose a service', options: NEEDS },
  { name: 'budget', label: 'Budget', placeholder: 'Any budget', options: BUDGETS },
  { name: 'timeline', label: 'Timeline', placeholder: 'Any timeline', options: TIMELINES },
]

// The quick quote bar overlapping the bottom of the home hero. Its answers are carried
// into the "Start a project" pop-up, so the visitor doesn't pick them twice.
export default function QuickQuote() {
  const openProjectForm = useProjectModal()
  const [answers, setAnswers] = useState({ service: '', budget: '', timeline: '' })

  const submit = (e) => {
    e.preventDefault()
    openProjectForm({ ...answers })
  }

  return (
    <div className="wrap relative z-[2] -mt-[72px] sm:-mt-[88px]">
      <form
        onSubmit={submit}
        aria-label="Get a free quote"
        className="grid grid-cols-2 items-end gap-3 rounded-xl border border-border bg-card p-4 shadow-[0_24px_50px_-24px_rgba(5,31,32,0.4)] sm:grid-cols-3 sm:gap-4 sm:p-5 lg:grid-cols-[repeat(3,1fr)_auto]"
      >
        {FIELDS.map((f, i) => (
          <div key={f.name} className={cn('grid gap-1.5', i === 0 && 'col-span-2 sm:col-span-1')}>
            <Label htmlFor={`quick-${f.name}`} className="text-[0.78rem] font-semibold text-muted-foreground">
              {f.label}
            </Label>
            <Select value={answers[f.name]} onValueChange={(v) => setAnswers({ ...answers, [f.name]: v })}>
              <SelectTrigger id={`quick-${f.name}`} className="max-sm:text-[0.9rem]">
                <SelectValue placeholder={f.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {f.options.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
        <Button type="submit" className="col-span-2 min-h-12 sm:col-span-3 lg:col-span-1">
          Get a free quote <span data-arrow aria-hidden="true">→</span>
        </Button>
      </form>
    </div>
  )
}
