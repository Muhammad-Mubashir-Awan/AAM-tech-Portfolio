import { useState } from 'react'
import { BUDGETS, NEEDS, TIMELINES } from './ProjectForm.jsx'
import { useProjectModal } from './ProjectModal.jsx'

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
    <div className="container quick">
      <form className="quick__bar" onSubmit={submit} aria-label="Get a free quote">
        {FIELDS.map((f) => (
          <label key={f.name} className="quick__field">
            <span>{f.label}</span>
            <select
              name={f.name}
              value={answers[f.name]}
              onChange={(e) => setAnswers({ ...answers, [f.name]: e.target.value })}
            >
              <option value="">{f.placeholder}</option>
              {f.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        ))}
        <button type="submit" className="btn quick__submit">
          Get a free quote <span className="btn__arrow" aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  )
}
