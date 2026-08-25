import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CivicMap } from '@/components/civic/civic-map'
import { SeverityBadge, StatusBadge } from '@/components/civic/status-badges'
import { DemoBanner } from '@/components/common/demo-banner'
import { PageHeader } from '@/components/common/page-header'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { weeklyVolume } from '@/constants/demo'
import { demoComplaints, toIssuePreview } from '@/data/complaints'
import { issueCategories } from '@/data/issue-categories'
import { categoryLabel, complaintPath } from '@/lib/civic'
import { cn } from '@/lib/utils'
import type { ComplaintRecord, SeverityLevel } from '@/types/civic'

const PAGE_SIZE = 6
const severityOrder: SeverityLevel[] = ['critical', 'high', 'medium', 'low']

export function AdminDashboardPage() {
  const [tab, setTab] = useState<'overview' | 'queue'>('overview')
  const open = demoComplaints.filter((item) => item.status !== 'resolved')
  const resolved = demoComplaints.filter((item) => item.status === 'resolved')
  const critical = demoComplaints.filter((item) => item.severity === 'critical')

  const severityDist = severityOrder.map((level) => ({
    name: level,
    count: demoComplaints.filter((item) => item.severity === level).length,
  }))

  const categoryDist = issueCategories.map((category) => ({
    name: category.label,
    count: demoComplaints.filter((item) => item.category === category.id).length,
  }))

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Operations"
        title="Civic operations"
        description="A working view of volume, urgency, and the open queue — sample city data only."
      />
      <DemoBanner className="mt-4" />

      <div className="mt-6 flex gap-1 border-b border-line" role="tablist" aria-label="Admin views">
        <TabButton active={tab === 'overview'} onClick={() => setTab('overview')}>
          Overview
        </TabButton>
        <TabButton active={tab === 'queue'} onClick={() => setTab('queue')}>
          Queue
        </TabButton>
      </div>

      {tab === 'overview' ? (
        <div className="mt-8">
          <dl className="grid grid-cols-2 gap-6 lg:grid-cols-5">
            <Stat label="Issue volume" value={String(demoComplaints.length)} />
            <Stat
              label="Resolution rate"
              value={`${Math.round((resolved.length / demoComplaints.length) * 100)}%`}
            />
            <Stat label="Avg. resolution" value="4.2 d" />
            <Stat label="Critical open" value={String(critical.filter((item) => item.status !== 'resolved').length)} />
            <Stat label="Open issues" value={String(open.length)} />
          </dl>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <ChartBlock title="Complaint volume" caption="Reported vs resolved, eight weeks.">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyVolume} barGap={2}>
                  <CartesianGrid vertical={false} stroke="#e2ddd2" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} width={28} />
                  <Tooltip />
                  <Bar dataKey="reported" fill="#1c4b8f" maxBarSize={18} />
                  <Bar dataKey="resolved" fill="#8aa4c7" maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </ChartBlock>
            <ChartBlock title="Resolution trend" caption="Closed work over the same window.">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyVolume}>
                  <CartesianGrid vertical={false} stroke="#e2ddd2" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} width={28} />
                  <Tooltip />
                  <Line type="monotone" dataKey="resolved" stroke="#1f7a4d" strokeWidth={1.75} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartBlock>
            <ChartBlock title="Severity distribution" caption="Where attention is concentrated.">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={severityDist} layout="vertical" margin={{ left: 48 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={64} />
                  <Bar dataKey="count" maxBarSize={12}>
                    {severityDist.map((entry) => (
                      <Cell key={entry.name} fill={severityFill(entry.name)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartBlock>
            <ChartBlock title="Category distribution" caption="What residents are filing.">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryDist} margin={{ bottom: 24 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-28} textAnchor="end" height={48} />
                  <YAxis tick={{ fontSize: 11 }} width={24} />
                  <Bar dataKey="count" fill="#1c4b8f" maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </ChartBlock>
          </div>

          <h2 className="mt-10 text-sm font-medium text-ink">Geographic hotspots</h2>
          <p className="mt-1 mb-3 text-xs text-ink-subtle">Open issues clustered on the civic map.</p>
          <CivicMap
            issues={open.map(toIssuePreview)}
            selectedId="CF-1843"
            className="min-h-72"
            showPanel
          />
        </div>
      ) : (
        <QueueTable />
      )}
    </div>
  )
}

function QueueTable() {
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState('all')
  const [sort, setSort] = useState<'severity' | 'id'>('severity')
  const [page, setPage] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>('CF-1851')

  const rows = useMemo(() => {
    const next = demoComplaints.filter((item) => {
      const haystack = `${item.id} ${item.title} ${item.locationLabel} ${item.department}`.toLowerCase()
      if (query && !haystack.includes(query.toLowerCase())) return false
      if (severity !== 'all' && item.severity !== severity) return false
      return true
    })
    next.sort((a, b) => {
      if (sort === 'id') return b.id.localeCompare(a.id)
      return severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
    })
    return next
  }, [query, severity, sort])

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const visible = rows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
  const selected = demoComplaints.find((item) => item.id === selectedId)

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.8fr)]">
      <div>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row">
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(0)
            }}
            placeholder="Search queue"
            aria-label="Search queue"
          />
          <Select
            aria-label="Filter severity"
            value={severity}
            onValueChange={(value) => {
              setSeverity(value)
              setPage(0)
            }}
            options={[
              { value: 'all', label: 'All severities' },
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
          />
          <Select
            aria-label="Sort"
            value={sort}
            onValueChange={(value) => setSort(value as 'severity' | 'id')}
            options={[
              { value: 'severity', label: 'Sort: severity' },
              { value: 'id', label: 'Sort: newest ID' },
            ]}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[11px] tracking-wide text-ink-subtle uppercase">
                <th className="py-2 pr-3 font-medium">Complaint</th>
                <th className="py-2 pr-3 font-medium">Category</th>
                <th className="py-2 pr-3 font-medium">Location</th>
                <th className="py-2 pr-3 font-medium">Severity</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Department</th>
                <th className="py-2 pr-3 font-medium">Reported</th>
                <th className="py-2 font-medium">Assigned</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'cursor-pointer border-b border-line',
                    row.severity === 'critical' ? 'bg-critical-soft/50' : '',
                    row.id === selectedId ? 'bg-brand-soft' : 'hover:bg-paper-deep/50',
                  )}
                  onClick={() => setSelectedId(row.id)}
                >
                  <td className="py-3 pr-3">
                    <p className="font-mono text-[11px] text-ink-subtle">{row.id}</p>
                    <p className="font-medium text-ink">{row.title}</p>
                  </td>
                  <td className="py-3 pr-3 text-ink-muted">{categoryLabel(row.category)}</td>
                  <td className="py-3 pr-3 text-ink-muted">{row.locationLabel}</td>
                  <td className="py-3 pr-3">
                    <SeverityBadge severity={row.severity} />
                  </td>
                  <td className="py-3 pr-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="py-3 pr-3 text-ink-muted">{row.department}</td>
                  <td className="py-3 pr-3 text-ink-subtle">{row.reportedAtLabel.replace('Reported ', '')}</td>
                  <td className="py-3 text-ink-muted">{row.assignedTo ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-ink-subtle">
            {rows.length} cases · page {page + 1} of {pageCount}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-brand disabled:text-ink-subtle"
              disabled={page === 0}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="text-brand disabled:text-ink-subtle"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selected ? <QueuePanel complaint={selected} /> : null}
    </div>
  )
}

function QueuePanel({ complaint }: { complaint: ComplaintRecord }) {
  return (
    <aside className="rounded-md border border-line bg-surface p-4">
      <p className="font-mono text-[11px] text-ink-subtle">{complaint.id}</p>
      <h2 className="mt-1 font-display text-xl text-ink">{complaint.title}</h2>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <SeverityBadge severity={complaint.severity} />
        <StatusBadge status={complaint.status} />
      </div>
      <p className="mt-3 text-sm text-ink-muted">{complaint.locationLabel}</p>
      <p className="mt-2 text-sm text-ink-muted">{complaint.department}</p>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{complaint.description}</p>
      <Link to={complaintPath(complaint.id)} className="mt-4 inline-block text-sm text-brand hover:underline">
        Open full case
      </Link>
    </aside>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-wide text-ink-subtle uppercase">{label}</dt>
      <dd className="mt-1 font-display text-3xl text-ink">{value}</dd>
    </div>
  )
}

function ChartBlock({
  title,
  caption,
  children,
}: {
  title: string
  caption: string
  children: ReactNode
}) {
  return (
    <section>
      <h2 className="text-sm font-medium text-ink">{title}</h2>
      <p className="mt-1 mb-3 text-xs text-ink-subtle">{caption}</p>
      {children}
    </section>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(
        '-mb-px border-b-2 px-3 py-2 text-sm',
        active ? 'border-brand text-ink' : 'border-transparent text-ink-muted',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function severityFill(name: string): string {
  switch (name) {
    case 'critical':
      return '#9b1c1c'
    case 'high':
      return '#c2410c'
    case 'medium':
      return '#a16207'
    default:
      return '#3f6212'
  }
}
