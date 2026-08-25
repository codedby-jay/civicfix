import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhotoDropzone } from '@/components/civic/photo-dropzone'
import { CivicMap } from '@/components/civic/civic-map'
import { SeverityBadge } from '@/components/civic/status-badges'
import { DemoBanner } from '@/components/common/demo-banner'
import { FieldError } from '@/components/common/field-error'
import { PageHeader } from '@/components/common/page-header'
import { Stepper } from '@/components/common/stepper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import { analysisDemoNotice } from '@/constants/demo'
import { issueCategories } from '@/data/issue-categories'
import { demoMapIssues } from '@/data/demo-issues'
import { analysisForCategory, categoryLabel } from '@/lib/civic'
import { routes } from '@/constants/routes'
import type { IssueCategoryId } from '@/types/civic'

const steps = [
  { id: 'photo', number: '01', label: 'Photo' },
  { id: 'location', number: '02', label: 'Location' },
  { id: 'details', number: '03', label: 'Details' },
  { id: 'analysis', number: '04', label: 'Analysis' },
  { id: 'review', number: '05', label: 'Review' },
]

export function ReportPage() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [step, setStep] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [pick, setPick] = useState<{ x: number; y: number } | null>({ x: 28, y: 42 })
  const [locationLabel, setLocationLabel] = useState('Maple Ave & 4th St')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<IssueCategoryId | ''>('')
  const [error, setError] = useState<string | undefined>()

  const analysis = useMemo(
    () => (category ? analysisForCategory(category) : null),
    [category],
  )

  function goNext() {
    setError(undefined)
    if (step === 0 && !previewUrl) {
      setError('Add a photo of the problem so reviewers can see the condition.')
      return
    }
    if (step === 1 && (!pick || !locationLabel.trim())) {
      setError('Choose a point on the map and name the location.')
      return
    }
    if (step === 2) {
      if (!title.trim()) {
        setError('Give the issue a short title.')
        return
      }
      if (description.trim().length < 12) {
        setError('Describe what you noticed in at least a sentence.')
        return
      }
      if (!category) {
        setError('Select a category so the right team can review it.')
        return
      }
    }
    setStep((value) => Math.min(steps.length - 1, value + 1))
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    push({
      tone: 'success',
      title: 'Report captured on this device',
      description: 'Submission will be stored when the backend is connected. Opening a sample case.',
    })
    void navigate('/complaints/CF-1843')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Report"
        title="Report an issue"
        description="Five short steps. You can go back and edit before anything is sent."
      />
      <div className="mt-6">
        <Stepper steps={steps} currentIndex={step} />
      </div>
      <p className="mt-4 text-sm text-ink-muted">
        Step {steps[step]?.number}: {steps[step]?.label}.{' '}
        {step < 4 ? 'Next: ' + steps[step + 1]?.label : 'Review and submit.'}
      </p>

      <form className="mt-8" onSubmit={onSubmit} noValidate>
        {step === 0 ? (
          <section>
            <h2 className="text-sm font-medium text-ink">Photo</h2>
            <p className="mt-1 mb-4 text-sm text-ink-muted">
              A clear photo of the problem is the most useful thing you can provide.
            </p>
            <PhotoDropzone
              previewUrl={previewUrl}
              invalid={Boolean(error)}
              onFile={(file) => {
                setPreviewUrl(URL.createObjectURL(file))
                setError(undefined)
              }}
              onClear={() => setPreviewUrl(null)}
            />
          </section>
        ) : null}

        {step === 1 ? (
          <section>
            <h2 className="text-sm font-medium text-ink">Location</h2>
            <p className="mt-1 mb-4 text-sm text-ink-muted">
              Tap the map to drop a pin, then name the place in your own words.
            </p>
            <CivicMap
              issues={demoMapIssues}
              showPanel={false}
              pickMode
              pick={pick}
              onPick={setPick}
              className="min-h-64"
              legend={false}
            />
            <div className="mt-4">
              <Label htmlFor="location">Location name</Label>
              <Input
                id="location"
                value={locationLabel}
                onChange={(event) => setLocationLabel(event.target.value)}
                placeholder="Intersection, park, or landmark"
              />
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="space-y-4">
            <div>
              <Label htmlFor="title">Issue title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Short description of the problem"
              />
            </div>
            <div>
              <Label htmlFor="details">Description</Label>
              <Textarea
                id="details"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What did you notice, and who is affected?"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={category}
                onValueChange={(value) => setCategory(value as IssueCategoryId)}
                placeholder="Choose a category"
                options={issueCategories.map((item) => ({
                  value: item.id,
                  label: item.label,
                }))}
              />
            </div>
          </section>
        ) : null}

        {step === 3 && analysis && category ? (
          <section>
            <h2 className="text-sm font-medium text-ink">Analysis preview</h2>
            <DemoBanner className="mt-2 mb-5">{analysisDemoNotice}</DemoBanner>
            <dl className="divide-y divide-line border-y border-line">
              <Row label="Detected" value={analysis.detected} />
              <Row label="Confidence" value={`${analysis.confidence}%`} />
              <Row
                label="Severity"
                value={<SeverityBadge severity={analysis.confidence > 92 ? 'high' : 'medium'} />}
              />
              <Row label="Safety risk" value={analysis.safetyRisk} />
              <Row label="Suggested department" value={analysis.suggestedDepartment} />
              <Row label="Potential duplicate" value={`${analysis.nearbyDuplicates} nearby reports`} />
              <Row label="Category" value={categoryLabel(category)} />
            </dl>
          </section>
        ) : null}

        {step === 4 ? (
          <section>
            <h2 className="text-sm font-medium text-ink">Review</h2>
            <p className="mt-1 mb-4 text-sm text-ink-muted">
              Nothing is sent to a server in this phase. Check the summary, then submit to open a
              sample case file.
            </p>
            {previewUrl ? (
              <img src={previewUrl} alt="" className="mb-4 max-h-48 w-full rounded-md object-cover" />
            ) : null}
            <dl className="divide-y divide-line border-y border-line">
              <Row label="Title" value={title} />
              <Row label="Location" value={locationLabel} />
              <Row label="Category" value={category ? categoryLabel(category) : '—'} />
              <Row label="Description" value={description} />
            </dl>
          </section>
        ) : null}

        <FieldError message={error} />

        <div className="mt-8 flex flex-wrap gap-2">
          {step > 0 ? (
            <Button type="button" variant="secondary" onClick={() => setStep((value) => value - 1)}>
              Back
            </Button>
          ) : (
            <Button type="button" variant="ghost" onClick={() => navigate(routes.dashboard)}>
              Cancel
            </Button>
          )}
          {step === 4 ? (
            <>
              <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                Edit details
              </Button>
              <Button type="submit">Submit report</Button>
            </>
          ) : (
            <Button type="button" onClick={goNext}>
              Continue
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-xs tracking-wide text-ink-subtle uppercase">{label}</dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  )
}
