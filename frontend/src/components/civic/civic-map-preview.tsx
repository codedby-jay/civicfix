import {
  Cone,
  Droplets,
  Layers,
  Lightbulb,
  Minus,
  Plus,
  Recycle,
  Signpost,
  TrafficCone,
  Waves,
} from 'lucide-react'
import { useState } from 'react'
import { SeverityBadge, StatusBadge } from '@/components/civic/status-badges'
import { demoMapIssues } from '@/data/demo-issues'
import type { CivicIssuePreview, IssueCategoryId, SeverityLevel } from '@/types/civic'
import { cn } from '@/lib/utils'

const categoryIcons: Record<IssueCategoryId, typeof Cone> = {
  potholes: Cone,
  garbage: Recycle,
  streetlights: Lightbulb,
  water: Droplets,
  road: Layers,
  drainage: Waves,
  traffic: TrafficCone,
  property: Signpost,
}

const markerColor: Record<SeverityLevel, string> = {
  critical: 'bg-critical',
  high: 'bg-high',
  medium: 'bg-medium',
  low: 'bg-low',
}

interface CivicMapPreviewProps {
  className?: string
  showPanel?: boolean
}

export function CivicMapPreview({ className, showPanel = true }: CivicMapPreviewProps) {
  const [activeId, setActiveId] = useState(demoMapIssues[0]?.id ?? '')
  const active = demoMapIssues.find((issue) => issue.id === activeId) ?? demoMapIssues[0]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-line bg-[#dfe6df] shadow-sm',
        className,
      )}
    >
      <div className="absolute inset-0 civic-map-grid" aria-hidden />
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" aria-hidden>
        <path d="M0 32 H100" stroke="#c9d1c8" strokeWidth="3.2" />
        <path d="M0 58 H100" stroke="#c9d1c8" strokeWidth="2.4" />
        <path d="M22 0 V100" stroke="#c9d1c8" strokeWidth="3" />
        <path d="M54 0 V100" stroke="#c9d1c8" strokeWidth="2.2" />
        <path d="M78 0 V100" stroke="#c9d1c8" strokeWidth="4" />
        <path d="M0 78 H100" stroke="#b7c3b8" strokeWidth="1.6" />
        <rect x="26" y="36" width="24" height="18" fill="#cfd8cf" />
        <rect x="58" y="12" width="16" height="14" fill="#c5d0c6" />
        <rect x="8" y="8" width="10" height="18" fill="#d5ddd4" />
      </svg>

      {demoMapIssues.map((issue) => (
        <button
          key={issue.id}
          type="button"
          onClick={() => setActiveId(issue.id)}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${issue.x}%`, top: `${issue.y}%` }}
          aria-label={`${issue.title}, ${issue.severity} severity`}
        >
          <span
            className={cn(
              'block size-3 rounded-full ring-2 ring-white',
              markerColor[issue.severity],
              issue.id === activeId ? 'scale-125' : '',
            )}
          />
        </button>
      ))}

      <div className="absolute top-3 left-3 flex flex-col overflow-hidden rounded-md border border-line bg-surface shadow-sm">
        <MapControl icon={Plus} label="Zoom in" />
        <MapControl icon={Minus} label="Zoom out" />
      </div>

      <div className="absolute bottom-3 left-3 hidden items-center gap-3 rounded-md border border-line bg-surface/95 px-3 py-2 text-[11px] text-ink-muted sm:flex">
        <LegendDot className="bg-critical" label="Critical" />
        <LegendDot className="bg-high" label="High" />
        <LegendDot className="bg-medium" label="Medium" />
        <LegendDot className="bg-low" label="Low" />
      </div>

      {showPanel && active ? <IssuePreviewPanel issue={active} /> : null}
    </div>
  )
}

function MapControl({
  icon: Icon,
  label,
}: {
  icon: typeof Plus
  label: string
}) {
  return (
    <button
      type="button"
      className="flex size-8 items-center justify-center text-ink-muted hover:bg-paper-deep hover:text-ink"
      aria-label={label}
    >
      <Icon className="size-3.5" />
    </button>
  )
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('size-2 rounded-full', className)} />
      {label}
    </span>
  )
}

function IssuePreviewPanel({ issue }: { issue: CivicIssuePreview }) {
  const Icon = categoryIcons[issue.category]

  return (
    <aside className="absolute top-3 right-3 w-[min(16.5rem,calc(100%-1.5rem))] rounded-md border border-line bg-surface p-3.5 shadow-md">
      <p className="font-mono text-[11px] text-ink-subtle">{issue.id}</p>
      <div className="mt-2 flex items-start gap-2">
        <Icon className="mt-0.5 size-4 text-brand" aria-hidden />
        <div>
          <p className="text-sm font-medium text-ink">{issue.title}</p>
          <p className="mt-1 text-xs text-ink-muted">{issue.locationLabel}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <SeverityBadge severity={issue.severity} />
        <StatusBadge status={issue.status} />
      </div>
      <p className="mt-3 text-xs text-ink-subtle">{issue.reportedAtLabel}</p>
    </aside>
  )
}
