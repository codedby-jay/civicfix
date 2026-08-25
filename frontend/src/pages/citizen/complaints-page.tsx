import { EmptyState } from '@/components/common/state-panels'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { routes } from '@/constants/routes'

export function ComplaintsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Citizen"
        title="My complaints"
        description="Your submitted issues and their public status will be listed here."
      />
      <EmptyState
        className="mt-8"
        title="No complaints to show"
        description="This list is a Phase 1 placeholder. Tracking history will arrive with the backend."
        action={
          <Button asChild>
            <Link to={routes.report}>Report an Issue</Link>
          </Button>
        }
      />
    </div>
  )
}
