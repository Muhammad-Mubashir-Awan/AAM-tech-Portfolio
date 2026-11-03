import { CircleAlertIcon } from 'lucide-react'

// The message under a form field that needs fixing. The field points to it with aria-describedby
// and aria-invalid, so screen readers read the problem together with the field.
export default function FieldError({ id, children }) {
  if (!children) return null
  return (
    <p id={id} className="mb-0 flex items-start gap-1.5 text-[0.85rem] leading-snug font-medium text-red-700">
      <CircleAlertIcon aria-hidden="true" className="mt-px size-4 flex-none" />
      {children}
    </p>
  )
}
