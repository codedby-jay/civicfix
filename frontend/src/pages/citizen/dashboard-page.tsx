import { Link } from 'react-router-dom'
import { CivicMap } from '@/components/civic/civic-map'
import { SeverityBadge, StatusBadge } from '@/components/civic/status-badges'
import { DemoBanner } from '@/components/common/demo-banner'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { demoComplaints, toIssuePreview } from '@/data/complaints'
import { complaintPath } from '@/lib/civic'
import { routes } from '@/constants/routes'

export function DashboardPage() {
  const mine = demoComplaints.filter((item) => item.isMine)
  const nearby = demoComplaints.filter((item) => !item.isMine && item.status !== 'resolved').slice(0, 4)
  const activity = mine.flatMap((item) =>
    item.activity.slice(0, 1).map((event) => ({ ...event, id: item.id, title: item.title })),
  )

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Citizen"
        title="Good afternoon"
        description="Three of your reports are still open. Nearby work is visible on the map."
        actions={
          <Button asChild>
            <Link to={routes.report}>Report an Issue</Link>
          </Button>
        }
      />
      <DemoBanner className="mt-5" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <section aria-labelledby="active-heading">
          <h2 id="active-heading" className="text-sm font-medium text-ink">
            Active complaints
          </h2>
          {mine.length === 0 ? (
            <EmptyState
              className="mt-3"
              title="No open reports"
              description="When you submit an issue, it will appear here with its public status."
            />
          ) : (
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {mine.map((item) => (
                <li key={item.id}>
                  <Link
                    to={complaintPath(item.id)}
                    className="flex flex-col gap-2 py-3.5 transition-colors hover:bg-paper-deep/60 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-mono text-[11px] text-ink-subtle">{item.id}</p>
                      <p className="mt-0.5 text-sm font-medium text-ink">{item.title}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{item.locationLabel}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <SeverityBadge severity={item.severity} />
                      <StatusBadge status={item.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <h2 className="mt-8 text-sm font-medium text-ink">Recent activity</h2>
          <ul className="mt-3 space-y-3">
            {activity.map((event) => (
              <li key={`${event.id}-${event.atLabel}`} className="text-sm">
                <p className="text-ink">
                  <span className="font-mono text-[11px] text-ink-subtle">{event.id}</span>{' '}
                  {event.note}
                </p>
                <p className="text-xs text-ink-subtle">
                  {event.actor} · {event.atLabel}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="nearby-heading">
          <div className="mb-3 flex items-end justify-between">
            <h2 id="nearby-heading" className="text-sm font-medium text-ink">
              Nearby issues
            </h2>
            <Link to={routes.map} className="text-xs text-brand hover:underline">
              Open map
            </Link>
          </div>
          <CivicMap
            issues={nearby.map(toIssuePreview)}
            selectedId={nearby[0]?.id}
            showPanel={false}
            className="min-h-64"
          />
          <ul className="mt-3 divide-y divide-line">
            {nearby.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                <Link to={complaintPath(item.id)} className="min-w-0">
                  <p className="truncate text-sm text-ink">{item.title}</p>
                  <p className="text-xs text-ink-subtle">{item.locationLabel}</p>
                </Link>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
