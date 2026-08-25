import { EmptyState } from '@/components/common/state-panels'
import { PageHeader } from '@/components/common/page-header'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { issueCategories } from '@/data/issue-categories'

export function ReportPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Citizen"
        title="Report an issue"
        description="The reporting workflow is scaffolded. Submissions will be stored in a later phase."
      />
      <form
        className="mt-8 space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Short description of the problem" disabled />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            value="potholes"
            onValueChange={() => undefined}
            placeholder="Choose a category"
            options={issueCategories.map((category) => ({
              value: category.id,
              label: category.label,
            }))}
            disabled
          />
        </div>
        <div>
          <Label htmlFor="details">Details</Label>
          <Textarea id="details" placeholder="What did you notice?" disabled />
        </div>
        <Button type="submit" disabled>
          Submit report
        </Button>
      </form>
      <EmptyState
        className="mt-8"
        title="Reporting is not live yet"
        description="Photo upload, geolocation, and classification will be added in Phase 2."
      />
    </div>
  )
}
