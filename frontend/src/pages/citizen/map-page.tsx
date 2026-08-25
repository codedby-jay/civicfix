import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CivicMap, MapSearch } from '@/components/civic/civic-map'
import { SeverityBadge, StatusBadge } from '@/components/civic/status-badges'
import { DemoBanner } from '@/components/common/demo-banner'
import { Select } from '@/components/ui/select'
import { demoComplaints, toIssuePreview } from '@/data/complaints'
import { issueCategories } from '@/data/issue-categories'
import { complaintPath } from '@/lib/civic'
import { complaintStatuses, severityLevels } from '@/types/civic'
import type { ComplaintRecord } from '@/types/civic'
import { cn } from '@/lib/utils'

export function MapPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [severity, setSeverity] = useState('all')
  const [status, setStatus] = useState('all')
  const [selectedId, setSelectedId] = useState('CF-1843')
  const [sheetOpen, setSheetOpen] = useState(true)

  const filtered = useMemo(() => {
    return demoComplaints.filter((item) => {
      const haystack = `${item.id} ${item.title} ${item.locationLabel}`.toLowerCase()
      if (query && !haystack.includes(query.toLowerCase())) return false
      if (category !== 'all' && item.category !== category) return false
      if (severity !== 'all' && item.severity !== severity) return false
      if (status !== 'all' && item.status !== status) return false
      return true
    })
  }, [query, category, severity, status])

  const issues = filtered.map(toIssuePreview)
  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0]

  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col lg:h-svh lg:min-h-0 lg:flex-row">
      <aside className="hidden w-80 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="space-y-3 border-b border-line p-4">
          <h1 className="font-display text-xl text-ink">Civic map</h1>
          <DemoBanner />
          <MapSearch value={query} onChange={setQuery} />
          <Select
            aria-label="Category"
            value={category}
            onValueChange={setCategory}
            options={[
              { value: 'all', label: 'All categories' },
              ...issueCategories.map((item) => ({ value: item.id, label: item.label })),
            ]}
          />
          <Select
            aria-label="Severity"
            value={severity}
            onValueChange={setSeverity}
            options={[
              { value: 'all', label: 'All severities' },
              ...severityLevels.map((item) => ({ value: item, label: item })),
            ]}
          />
          <Select
            aria-label="Status"
            value={status}
            onValueChange={setStatus}
            options={[
              { value: 'all', label: 'All statuses' },
              ...complaintStatuses.map((item) => ({
                value: item,
                label: item.replace('_', ' '),
              })),
            ]}
          />
        </div>
        <ul className="flex-1 overflow-y-auto">
          {filtered.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  'w-full border-b border-line px-4 py-3 text-left',
                  item.id === selected?.id ? 'bg-brand-soft' : 'hover:bg-paper',
                )}
              >
                <p className="font-mono text-[11px] text-ink-subtle">{item.id}</p>
                <p className="mt-1 text-sm font-medium text-ink">{item.title}</p>
                <p className="mt-1 text-xs text-ink-muted">{item.locationLabel}</p>
                <div className="mt-2 flex gap-1.5">
                  <SeverityBadge severity={item.severity} />
                  <StatusBadge status={item.status} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="relative min-h-[52svh] flex-1">
        <div className="absolute top-3 right-3 left-3 z-10 lg:hidden">
          <MapSearch value={query} onChange={setQuery} />
        </div>
        <CivicMap
          className="h-full min-h-[52svh] rounded-none border-0"
          issues={issues}
          selectedId={selected?.id}
          onSelect={(id) => {
            setSelectedId(id)
            setSheetOpen(true)
          }}
          showPanel={false}
        />
      </div>

      {selected ? (
        <div className="border-t border-line bg-surface p-4 lg:hidden">
          <button
            type="button"
            className="mx-auto mb-3 block h-1 w-10 rounded-full bg-line-strong"
            aria-expanded={sheetOpen}
            aria-label={sheetOpen ? 'Collapse issue details' : 'Expand issue details'}
            onClick={() => setSheetOpen((value) => !value)}
          />
          {sheetOpen ? <SelectedIssueCard item={selected} /> : (
            <p className="text-center text-sm text-ink-muted">{selected.title}</p>
          )}
        </div>
      ) : null}
    </div>
  )
}

function SelectedIssueCard({ item }: { item: ComplaintRecord }) {
  return (
    <div>
      <p className="font-mono text-[11px] text-ink-subtle">{item.id}</p>
      <p className="mt-1 text-sm font-medium text-ink">{item.title}</p>
      <p className="mt-1 text-sm text-ink-muted">{item.locationLabel}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <SeverityBadge severity={item.severity} />
        <StatusBadge status={item.status} />
      </div>
      <p className="mt-2 text-xs text-ink-subtle">{item.reportedAtLabel}</p>
      <Link to={complaintPath(item.id)} className="mt-3 inline-block text-sm text-brand hover:underline">
        Open case
      </Link>
    </div>
  )
}
