import { Badge } from '@/components/ui/badge'
import type { ComplaintStatus, SeverityLevel } from '@/types/civic'

const statusCopy: Record<ComplaintStatus, { label: string; tone: 'neutral' | 'brand' | 'info' | 'warning' | 'success' }> =
  {
    reported: { label: 'Reported', tone: 'neutral' },
    reviewed: { label: 'Reviewed', tone: 'info' },
    assigned: { label: 'Assigned', tone: 'brand' },
    in_progress: { label: 'In progress', tone: 'warning' },
    resolved: { label: 'Resolved', tone: 'success' },
  }

const severityCopy: Record<
  SeverityLevel,
  { label: string; className: string }
> = {
  critical: { label: 'Critical', className: 'bg-critical-soft text-critical' },
  high: { label: 'High', className: 'bg-high-soft text-high' },
  medium: { label: 'Medium', className: 'bg-medium-soft text-medium' },
  low: { label: 'Low', className: 'bg-low-soft text-low' },
}

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const copy = statusCopy[status]
  return <Badge tone={copy.tone}>{copy.label}</Badge>
}

export function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  const copy = severityCopy[severity]
  return (
    <span
      className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] font-medium tracking-wide uppercase ${copy.className}`}
    >
      {copy.label}
    </span>
  )
}
