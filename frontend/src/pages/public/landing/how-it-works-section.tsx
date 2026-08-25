import { Reveal } from '@/components/common/reveal'
import { SectionHeader } from '@/components/common/page-header'

const steps = [
  {
    number: '01',
    title: 'Report',
    body: 'Upload a photo and location.',
  },
  {
    number: '02',
    title: 'Analyze',
    body: 'CivicFix analyzes the issue and determines category and severity.',
  },
  {
    number: '03',
    title: 'Prioritize',
    body: 'Potential duplicate reports and priority are identified.',
  },
  {
    number: '04',
    title: 'Resolve',
    body: 'Authorities track and update the issue until resolution.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-b border-line">
      <div className="container-wide py-20">
        <Reveal>
          <SectionHeader
            eyebrow="How it works"
            title="Four steps from sidewalk to resolution"
            description="A single path for citizens and city teams, without the noise of a typical ticketing tool."
          />
        </Reveal>
        <Reveal className="relative mt-12">
          <div
            className="absolute top-[1.15rem] right-0 left-0 hidden h-px bg-line lg:block"
            aria-hidden
          />
          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            {steps.map((step) => (
              <li key={step.number} className="relative">
                <p className="font-mono text-xs text-brand">{step.number}</p>
                <h3 className="mt-4 font-display text-2xl text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
