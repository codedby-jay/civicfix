import { Link, useParams } from 'react-router-dom'
import { CivicMap } from '@/components/civic/civic-map'
import { ComplaintTimeline } from '@/components/civic/complaint-timeline'
import { IssuePhoto } from '@/components/civic/issue-photo'
import { SeverityBadge, StatusBadge } from '@/components/civic/status-badges'
import { DemoBanner } from '@/components/common/demo-banner'
import { ErrorState } from '@/components/common/state-panels'
import { Button } from '@/components/ui/button'
import { analysisDemoNotice } from '@/constants/demo'
import { getComplaint, toIssuePreview, demoComplaints } from '@/data/complaints'
import { categoryLabel, complaintPath } from '@/lib/civic'
import { routes } from '@/constants/routes'

export function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>()
  const complaint = id ? getComplaint(id) : undefined

  if (!complaint) {
    return (
      <div className="mx-auto max-w-2xl">
        <ErrorState
          title="Complaint not found"
          description="This case is not in the demonstration set."
        />
        <Button className="mt-4" variant="secondary" asChild>
          <Link to={routes.complaints}>Back to my complaints</Link>
        </Button>
      </div>
    )
  }

  const similar = demoComplaints.filter((item) => complaint.similarIds.includes(item.id))

  return (
    <div className="mx-auto max-w-5xl">
      <p className="font-mono text-[11px] text-ink-subtle">{complaint.id}</p>
      <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-ink">{complaint.title}</h1>
          <p className="mt-2 text-sm text-ink-muted">{complaint.locationLabel}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <SeverityBadge severity={complaint.severity} />
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      <IssuePhoto
        category={complaint.category}
        title={complaint.title}
        className="mt-6 aspect-[16/7] max-h-64"
      />

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <Meta label="Priority" value={complaint.priority} />
        <Meta label="Department" value={complaint.department} />
        <Meta label="Category" value={categoryLabel(complaint.category)} />
        <Meta label="Assigned" value={complaint.assignedTo ?? 'Unassigned'} />
      </dl>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div>
          <h2 className="text-sm font-medium text-ink">Description</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{complaint.description}</p>

          <h2 className="mt-8 text-sm font-medium text-ink">Timeline</h2>
          <p className="mt-1 mb-4 text-xs text-ink-subtle">The public path for this case.</p>
          <ComplaintTimeline events={complaint.timeline} current={complaint.status} />
        </div>

        <div>
          <h2 className="text-sm font-medium text-ink">Map</h2>
          <CivicMap
            className="mt-3 min-h-56"
            issues={[toIssuePreview(complaint)]}
            selectedId={complaint.id}
            showPanel={false}
            legend={false}
          />

          <h2 className="mt-8 text-sm font-medium text-ink">Analysis preview</h2>
          <DemoBanner className="mt-2 mb-3">{analysisDemoNotice}</DemoBanner>
          <dl className="text-sm">
            <Row label="Detected" value={complaint.analysis.detected} />
            <Row label="Confidence" value={`${complaint.analysis.confidence}%`} />
            <Row label="Safety risk" value={complaint.analysis.safetyRisk} />
            <Row
              label="Potential duplicate"
              value={`${complaint.analysis.nearbyDuplicates} nearby reports`}
            />
          </dl>

          <h2 className="mt-8 text-sm font-medium text-ink">Similar reports</h2>
          <ul className="mt-2 divide-y divide-line">
            {similar.map((item) => (
              <li key={item.id} className="py-2">
                <Link to={complaintPath(item.id)} className="text-sm text-ink hover:text-brand">
                  {item.id} · {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-sm font-medium text-ink">Activity</h2>
          <ul className="mt-2 space-y-2">
            {complaint.activity.map((event) => (
              <li key={event.atLabel + event.note} className="text-sm">
                <p className="text-ink">{event.note}</p>
                <p className="text-xs text-ink-subtle">
                  {event.actor} · {event.atLabel}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-wide text-ink-subtle uppercase">{label}</dt>
      <dd className="mt-1 capitalize">{value}</dd>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2">
      <dt className="text-ink-subtle">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  )
}
