import { Reveal } from '@/components/common/reveal'

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 border-b border-line">
      <div className="container-wide grid gap-10 py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.16em] text-brand uppercase">About</p>
          <h2 className="mt-3 font-display text-[1.75rem] tracking-tight text-ink sm:text-[2rem]">
            Built for public trust, not for dashboards that look busy.
          </h2>
        </Reveal>
        <Reveal>
          <p className="text-sm leading-relaxed text-ink-muted">
            CivicFix is an intelligent civic issue management platform. Residents report
            infrastructure problems. City teams classify, prioritize, cluster, and close them
            with a record that remains visible. Contact for this phase is through the project
            GitHub repository.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
