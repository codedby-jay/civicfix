import { Link } from 'react-router-dom'
import { SeverityBadge, StatusBadge } from '@/components/civic/status-badges'
import { DemoBanner } from '@/components/common/demo-banner'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { demoComplaints } from '@/data/complaints'
import { complaintPath } from '@/lib/civic'
import { routes } from '@/constants/routes'

export function ComplaintsPage() {
  const mine = demoComplaints.filter((item) => item.isMine)

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Citizen"
        title="My complaints"
        description="Open and recent reports you filed, with the same status the city sees."
        actions={
          <Button asChild>
            <Link to={routes.report}>Report an Issue</Link>
          </Button>
        }
      />
      <DemoBanner className="mt-5" />
      {mine.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No complaints to show"
          description="Submit a report to start a public case file."
        />
      ) : (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {mine.map((item) => (
            <li key={item.id}>
              <Link
                to={complaintPath(item.id)}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-mono text-[11px] text-ink-subtle">{item.id}</p>
                  <p className="mt-1 text-sm font-medium text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">{item.locationLabel}</p>
                  <p className="mt-1 text-xs text-ink-subtle">{item.reportedAtLabel}</p>
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
    </div>
  )
}
