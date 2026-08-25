import { AlertCircle, CheckCircle2, Inbox, LoaderCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface StatePanelProps {
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, action, className }: StatePanelProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-start rounded-lg border border-dashed border-line-strong bg-surface px-6 py-10',
        className,
      )}
    >
      <Inbox className="size-5 text-ink-subtle" aria-hidden />
      <h2 className="mt-4 font-display text-xl text-ink">{title}</h2>
      <p className="mt-2 max-w-prose text-sm text-ink-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  className,
}: StatePanelProps & { onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-start rounded-lg border border-error/20 bg-error-soft px-6 py-8',
        className,
      )}
    >
      <AlertCircle className="size-5 text-error" aria-hidden />
      <h2 className="mt-4 font-display text-xl text-ink">{title}</h2>
      <p className="mt-2 max-w-prose text-sm text-ink-muted">{description}</p>
      {onRetry ? (
        <Button className="mt-5" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}

export function SuccessState({ title, description, action, className }: StatePanelProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-start rounded-lg border border-success/20 bg-success-soft px-6 py-8',
        className,
      )}
    >
      <CheckCircle2 className="size-5 text-success" aria-hidden />
      <h2 className="mt-4 font-display text-xl text-ink">{title}</h2>
      <p className="mt-2 max-w-prose text-sm text-ink-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function LoadingState({
  label = 'Loading',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      role="status"
      className={cn('flex items-center gap-2 text-sm text-ink-muted', className)}
    >
      <LoaderCircle className="size-4 animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  )
}
