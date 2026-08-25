import { Reveal } from '@/components/common/reveal'
import { DemoBanner } from '@/components/common/demo-banner'
import { DemoResolutionTrend } from '@/components/civic/demo-resolution-trend'
import { demoImpactStats } from '@/constants/demo'

export function ImpactSection() {
  return (
    <section className="border-b border-line bg-surface">
      <div className="container-wide py-10">
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-xs font-medium tracking-[0.16em] text-brand uppercase">
              Live civic impact
            </p>
            <DemoBanner className="sm:max-w-sm sm:border-l-0 sm:pl-0 sm:text-right" />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4 lg:gap-0">
            {demoImpactStats.map((stat, index) => (
              <div key={stat.label} className={index === 0 ? '' : 'lg:border-l lg:border-line lg:pl-8'}>
                <dt className="text-[11px] tracking-wide text-ink-subtle uppercase">{stat.label}</dt>
                <dd className="mt-1 font-display text-3xl tracking-tight text-ink sm:text-[2.25rem]">
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
