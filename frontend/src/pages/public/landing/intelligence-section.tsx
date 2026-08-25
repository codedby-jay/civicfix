import { Reveal } from '@/components/common/reveal'
import { SectionHeader } from '@/components/common/page-header'

const capabilities = [
  {
    title: 'Issue classification',
    body: 'Automatically identify and categorize reported problems so city teams start from a consistent record.',
  },
  {
    title: 'Duplicate detection',
    body: 'Identify potentially duplicate reports from nearby locations before they clutter the queue.',
  },
  {
    title: 'Priority intelligence',
    body: 'Help authorities understand which issues require attention first, based on severity and clustering.',
  },
]

export function IntelligenceSection() {
  return (
    <section className="border-b border-line">
      <div className="container-wide py-20">
        <Reveal>
          <SectionHeader
            eyebrow="Intelligence"
            title="Quiet tools that keep the queue honest"
            description="Classification, clustering, and priority support sit behind the workflow — not in front of the citizen."
          />
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {capabilities.map((item) => (
            <Reveal key={item.title}>
              <article className="border-l border-brand/30 pl-5">
                <h3 className="text-base font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
