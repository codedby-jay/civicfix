import { Reveal } from '@/components/common/reveal'
import { SectionHeader } from '@/components/common/page-header'
import { DemoBanner } from '@/components/common/demo-banner'

const capabilities = [
  {
    title: 'AI issue classification',
    body: 'Identify and categorize reported problems so city teams start from a consistent record.',
  },
  {
    title: 'Duplicate detection',
    body: 'Surface nearby reports that may describe the same problem before they clutter the queue.',
  },
  {
    title: 'Priority intelligence',
    body: 'Help authorities see which issues need attention first, from severity and clustering.',
  },
]

export function IntelligenceSection() {
  return (
    <section className="border-b border-line">
      <div className="container-wide py-16">
        <Reveal>
          <SectionHeader
            eyebrow="Intelligence"
            title="Quiet tools that keep the queue honest"
            description="Classification, clustering, and priority sit behind the workflow — not in front of the citizen."
          />
          <DemoBanner className="mt-4 max-w-xl">
            These capabilities are described here for product design. They are not connected to a
            live model in this phase.
          </DemoBanner>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {capabilities.map((item) => (
            <Reveal key={item.title}>
              <article className="border-l border-brand/35 pl-5">
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
