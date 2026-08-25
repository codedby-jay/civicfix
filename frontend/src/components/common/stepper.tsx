import { cn } from '@/lib/utils'

interface StepperProps {
  steps: { id: string; number: string; label: string }[]
  currentIndex: number
}

export function Stepper({ steps, currentIndex }: StepperProps) {
  return (
    <ol className="flex items-start gap-0 overflow-x-auto pb-1">
      {steps.map((step, index) => {
        const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming'
        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 flex-col">
              <span
                className={cn(
                  'font-mono text-[11px]',
                  state === 'upcoming' ? 'text-ink-subtle' : 'text-brand',
                )}
              >
                {step.number}
              </span>
              <span
                className={cn(
                  'text-sm',
                  state === 'current' ? 'font-medium text-ink' : 'text-ink-muted',
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span
                className={cn(
                  'mx-3 mt-[-12px] hidden h-px flex-1 sm:block',
                  index < currentIndex ? 'bg-brand' : 'bg-line',
                )}
                aria-hidden
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
