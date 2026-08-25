import { complaintStatuses, type ComplaintStatus } from '@/types/civic'
import { StatusBadge } from '@/components/civic/status-badges'
import { cn } from '@/lib/utils'
import type { TimelineEvent } from '@/types/civic'

export function ComplaintTimeline({
  events,
  current,
}: {
  events: TimelineEvent[]
  current: ComplaintStatus
}) {
  const currentIndex = complaintStatuses.indexOf(current)

  return (
    <ol className="relative">
      {complaintStatuses.map((status, index) => {
        const event = events.find((item) => item.status === status)
        const reached = index <= currentIndex

        return (
          <li key={status} className="relative flex gap-4 pb-8 last:pb-0">
            {index < complaintStatuses.length - 1 ? (
              <span
                className={cn(
                  'absolute top-4 left-[7px] h-[calc(100%-8px)] w-px',
                  index < currentIndex ? 'bg-brand' : 'bg-line',
                )}
                aria-hidden
              />
            ) : null}
            <span
              className={cn(
                'relative z-10 mt-1 size-4 shrink-0 rounded-full border-2 bg-surface',
                reached ? 'border-brand bg-brand' : 'border-line-strong',
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={status} />
                {event ? (
                  <span className="font-mono text-[11px] text-ink-subtle">{event.atLabel}</span>
                ) : (
                  <span className="text-[11px] text-ink-subtle">Pending</span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-ink-muted">
                {event?.note ?? 'This step has not started.'}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
