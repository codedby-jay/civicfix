import { Link } from 'react-router-dom'
import { EmptyState, LoadingState } from '@/components/common/state-panels'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardBody } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { routes } from '@/constants/routes'

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Citizen"
        title="Dashboard"
        description="Your reports, nearby issues, and follow-ups will appear here once the platform is connected."
        actions={
          <Button asChild>
            <Link to={routes.report}>Report an Issue</Link>
          </Button>
        }
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Card className="mt-6">
        <CardBody>
          <LoadingState label="Waiting for live data" />
          <EmptyState
            className="mt-4 border-0 bg-transparent px-0 py-4"
            title="No activity yet"
            description="This is a Phase 1 placeholder. Reporting, tracking, and maps will be wired to the API in the next phase."
          />
        </CardBody>
      </Card>
    </div>
  )
}
