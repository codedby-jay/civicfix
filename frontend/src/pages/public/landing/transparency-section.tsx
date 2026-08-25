import { Reveal } from '@/components/common/reveal'
import { SectionHeader } from '@/components/common/page-header'
import { complaintStatuses } from '@/types/civic'
import { StatusBadge } from '@/components/civic/status-badges'

const copy: Record<(typeof complaintStatuses)[number], string> = {
  reported: 'A citizen files a photo, location, and description.',
  reviewed: 'The report is checked for completeness and category.',
  assigned: 'A responsible team is attached to the work.',
  in_progress: 'Crews update status as the repair moves forward.',
  resolved: 'The record stays visible after the work is done.',
}

export function TransparencySection() {
  return (
    <section id="tracking" className="scroll-mt-20 border-b border-line bg-surface">
      <div className="container-wide py-20">
        <Reveal>
          <SectionHeader
            eyebrow="Transparency"
            title="Every complaint has a public path"
            description="CivicFix does not hide work in inboxes. Status is visible from first report to last update."
          />
        </Reveal>
        <Reveal>
          <ol className="mt-12 grid gap-0 md:grid-cols-5">
            {complaintStatuses.map((status, index) => (
              <li
                key={status}
                className="relative border-t border-line py-6 md:border-t-0 md:border-l md:px-5 md:first:border-l-0 md:first:pl-0"
              >
                <p className="font-mono text-xs text-ink-subtle">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <div className="mt-3">
                  <StatusBadge status={status} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{copy[status]}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
