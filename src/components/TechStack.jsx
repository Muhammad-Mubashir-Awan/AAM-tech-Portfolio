import { techStack } from '../data.js'
import { cn } from '@/lib/utils'

// "Built with": the tools we use, as chips (home page numbers strip and Services page)
export default function TechStack({ className }) {
  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <p className="eyebrow mb-0 justify-center">Built with</p>
      <ul className="flex flex-wrap justify-center gap-2">
        {techStack.map((t) => (
          <li key={t} className="rounded-full border border-border bg-background px-4 py-1.5 text-[0.85rem] font-medium text-foreground">
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}
