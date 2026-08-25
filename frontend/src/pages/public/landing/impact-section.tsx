import { Reveal } from '@/components/common/reveal'
import { DemoResolutionTrend } from '@/components/civic/demo-resolution-trend'
import { demoDataNotice, demoImpactStats } from '@/constants/demo'

export function ImpactSection() {
  return (
    <section className="border-b border-line bg-surface">
      <div className="container-wide py-14">
        <Reveal>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-xs font-medium tracking-[0.16em] text-brand uppercase">
              Live civic impact
            </p>
            <p className="text-xs text-ink-subtle">{demoDataNotice}</p>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-0">
            {demoImpactStats.map((stat, index) => (
              <div
                key={stat.label}
                className={
                  index === 0
                    ? ''
                    : 'lg:border-l lg:border-line lg:pl-8'
                }
              >
                <dt className="text-xs tracking-wide text-ink-subtle uppercase">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-display text-4xl tracking-tight text-ink sm:text-[2.75rem]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <DemoResolutionTrend />
        </Reveal>
      </div>
    </section>
  )
}
