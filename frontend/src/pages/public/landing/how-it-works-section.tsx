import { Reveal } from '@/components/common/reveal'
import { SectionHeader } from '@/components/common/page-header'

const steps = [
  { number: '01', title: 'Report', body: 'Upload a photo and location.' },
  { number: '02', title: 'Analyze', body: 'Category and severity are determined from the report.' },
  {
    number: '03',
    title: 'Prioritize',
    body: 'Nearby duplicates and urgency are identified for the queue.',
  },
  {
    number: '04',
    title: 'Resolve',
    body: 'Authorities track the issue until the work is closed.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-b border-line">
      <div className="container-wide py-16">
        <Reveal>
          <SectionHeader
            eyebrow="How it works"
            title="One path from sidewalk to resolution"
            description="Residents report. City teams classify, prioritize, and close — on a record that stays visible."
          />
        </Reveal>
        <Reveal className="mt-10">
          <ol className="grid gap-0 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li
                key={step.number}
                className="relative border-t border-line py-6 lg:border-t-0 lg:border-l lg:px-6 lg:py-0 lg:first:border-l-0 lg:first:pl-0"
              >
                <p className="font-mono text-xs text-brand">{step.number}</p>
                <h3 className="mt-3 font-display text-2xl text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
                {index < steps.length - 1 ? (
                  <span className="mt-4 hidden font-mono text-xs text-ink-subtle lg:block">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
