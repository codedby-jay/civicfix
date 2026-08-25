import { ErrorState } from '@/components/common/state-panels'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Operations"
        title="Admin dashboard"
        description="Prioritization, clustering, and assignment tools will live here. This screen is a structural placeholder."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-ink">Queue overview</p>
          </CardHeader>
          <CardBody>
            <Skeleton className="mb-3 h-8 w-24" />
            <Skeleton className="h-3 w-full" />
          </CardBody>
        </Card>
        <ErrorState
          title="Live operations are offline"
          description="Admin APIs, assignment, and intelligence will be connected in a later phase."
        />
      </div>
    </div>
  )
}
