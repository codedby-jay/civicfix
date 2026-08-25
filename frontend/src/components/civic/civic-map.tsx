import { Minus, Plus, Search } from 'lucide-react'
import { useMemo, useState, type MouseEvent } from 'react'
import { SeverityBadge, StatusBadge } from '@/components/civic/status-badges'
import { categoryIcons, severityMarkerClass } from '@/lib/icons'
import type { CivicIssuePreview, SeverityLevel } from '@/types/civic'
import { cn } from '@/lib/utils'

interface Cluster {
  key: string
  x: number
  y: number
  items: CivicIssuePreview[]
}

function clusterIssues(issues: CivicIssuePreview[], threshold = 8): Cluster[] {
  const clusters: Cluster[] = []

  for (const issue of issues) {
    const existing = clusters.find(
      (cluster) => Math.hypot(cluster.x - issue.x, cluster.y - issue.y) < threshold,
    )
    if (existing) {
      existing.items.push(issue)
      existing.x =
        existing.items.reduce((sum, item) => sum + item.x, 0) / existing.items.length
      existing.y =
        existing.items.reduce((sum, item) => sum + item.y, 0) / existing.items.length
    } else {
      clusters.push({ key: issue.id, x: issue.x, y: issue.y, items: [issue] })
    }
  }

  return clusters
}

interface CivicMapProps {
  issues: CivicIssuePreview[]
  selectedId?: string
  onSelect?: (id: string) => void
  showPanel?: boolean
  pickMode?: boolean
  pick?: { x: number; y: number } | null
  onPick?: (point: { x: number; y: number }) => void
  className?: string
  legend?: boolean
}

export function CivicMap({
  issues,
  selectedId,
  onSelect,
  showPanel = true,
  pickMode = false,
  pick,
  onPick,
  className,
  legend = true,
}: CivicMapProps) {
  const [zoom, setZoom] = useState(1)
  const clusters = useMemo(() => clusterIssues(issues), [issues])
  const selected = issues.find((issue) => issue.id === selectedId) ?? issues[0]

  function onSurfaceClick(event: MouseEvent<HTMLDivElement>) {
    if (!pickMode || !onPick) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    onPick({ x: Math.min(96, Math.max(4, x)), y: Math.min(96, Math.max(4, y)) })
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md border border-line bg-[#d7e0d6]',
        className,
      )}
    >
      <div
        className={cn(
          'absolute inset-0 origin-center transition-transform duration-200',
          pickMode ? 'cursor-crosshair' : '',
        )}
        style={{ transform: `scale(${zoom})` }}
        onClick={onSurfaceClick}
      >
        <div className="absolute inset-0 civic-map-grid" aria-hidden />
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" aria-hidden>
          <path d="M0 30 H100" stroke="#c3cdc2" strokeWidth="3.4" />
          <path d="M0 52 H100" stroke="#c3cdc2" strokeWidth="2.2" />
          <path d="M0 74 H100" stroke="#b7c3b8" strokeWidth="1.8" />
          <path d="M18 0 V100" stroke="#c3cdc2" strokeWidth="3" />
          <path d="M46 0 V100" stroke="#c3cdc2" strokeWidth="2.4" />
          <path d="M71 0 V100" stroke="#b7c3b8" strokeWidth="4.2" />
          <rect x="22" y="34" width="20" height="14" fill="#c8d2c7" />
          <rect x="50" y="10" width="14" height="16" fill="#c0cbbf" />
          <rect x="6" y="8" width="9" height="16" fill="#d2dad1" />
          <rect x="74" y="56" width="12" height="12" fill="#c5d0c4" />
          <path d="M0 88 Q50 80 100 88" fill="none" stroke="#b4c4c8" strokeWidth="3" />
        </svg>

        {clusters.map((cluster) => {
          if (cluster.items.length > 1) {
            const containsSelected = cluster.items.some((item) => item.id === selectedId)
            return (
              <button
                key={cluster.key}
                type="button"
                className={cn(
                  'absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-ink text-[11px] font-medium text-paper ring-2 ring-white',
                  containsSelected ? 'ring-brand' : '',
                )}
                style={{ left: `${cluster.x}%`, top: `${cluster.y}%` }}
                onClick={(event) => {
                  event.stopPropagation()
                  onSelect?.(cluster.items[0]?.id ?? '')
                }}
                aria-label={`${cluster.items.length} nearby reports`}
              >
                {cluster.items.length}
              </button>
            )
          }

          const issue = cluster.items[0]
          if (!issue) return null
          return (
            <MarkerButton
              key={issue.id}
              issue={issue}
              active={issue.id === selectedId}
              onSelect={onSelect}
            />
          )
        })}

        {pick ? (
          <span
            className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand ring-2 ring-white"
            style={{ left: `${pick.x}%`, top: `${pick.y}%` }}
          />
        ) : null}
      </div>

      <div className="absolute top-3 left-3 z-10 flex flex-col overflow-hidden rounded-md border border-line bg-surface shadow-sm">
        <MapControl
          icon={Plus}
          label="Zoom in"
          onClick={() => setZoom((value) => Math.min(1.45, value + 0.15))}
        />
        <MapControl
          icon={Minus}
          label="Zoom out"
          onClick={() => setZoom((value) => Math.max(1, value - 0.15))}
        />
      </div>

      {legend ? (
        <div className="absolute bottom-3 left-3 z-10 hidden items-center gap-3 rounded-md border border-line bg-surface/95 px-3 py-2 text-[11px] text-ink-muted sm:flex">
          {(['critical', 'high', 'medium', 'low'] as SeverityLevel[]).map((level) => (
            <span key={level} className="inline-flex items-center gap-1.5 capitalize">
              <span className={cn('size-2 rounded-full', severityMarkerClass[level])} />
              {level}
            </span>
          ))}
        </div>
      ) : null}

      {showPanel && selected && !pickMode ? (
        <IssuePreviewPanel issue={selected} />
      ) : null}
    </div>
  )
}

function MarkerButton({
  issue,
  active,
  onSelect,
}: {
  issue: CivicIssuePreview
  active: boolean
  onSelect?: (id: string) => void
}) {
  return (
    <button
      type="button"
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${issue.x}%`, top: `${issue.y}%` }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect?.(issue.id)
      }}
      aria-label={`${issue.title}, ${issue.severity} severity`}
      aria-pressed={active}
    >
      <span
        className={cn(
          'block size-3 rounded-full ring-2 ring-white',
          severityMarkerClass[issue.severity],
          active ? 'scale-125 ring-brand' : '',
        )}
      />
    </button>
  )
}

function MapControl({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Plus
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="flex size-8 items-center justify-center text-ink-muted hover:bg-paper-deep hover:text-ink"
      aria-label={label}
      onClick={onClick}
    >
      <Icon className="size-3.5" />
    </button>
  )
}

function IssuePreviewPanel({ issue }: { issue: CivicIssuePreview }) {
  const Icon = categoryIcons[issue.category]

  return (
    <aside className="absolute top-3 right-3 z-10 w-[min(16.5rem,calc(100%-1.5rem))] rounded-md border border-line bg-surface p-3.5 shadow-md">
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

export function MapSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="relative block">
      <span className="sr-only">Search issues</span>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by ID, street, or title"
        className="h-10 w-full rounded-md border border-line-strong bg-surface pr-3 pl-9 text-sm"
      />
    </label>
  )
}
