import { Link } from 'react-router-dom'
import { CivicMapPreview } from '@/components/civic/civic-map-preview'
import { Reveal } from '@/components/common/reveal'
import { Button } from '@/components/ui/button'
import { brand } from '@/constants/brand'
import { routes } from '@/constants/routes'

export function HeroSection() {
  return (
    <section className="border-b border-line">
      <div className="container-wide grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:py-14">
        <Reveal>
          <p className="text-sm font-semibold tracking-tight text-brand">{brand.name}</p>
          <h1 className="mt-2 font-display text-[2.5rem] leading-[1.08] tracking-tight text-ink sm:text-5xl">
            {brand.tagline}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
            Turn everyday civic problems into visible, trackable action — for residents and the
            teams who close the work.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-subtle">
            {brand.description}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <Link to={routes.report}>Report an Issue</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to={routes.map}>Explore Civic Issues</Link>
            </Button>
          </div>
          <p className="mt-5 text-xs text-ink-subtle">
            Photo, location, and a public status trail — from the sidewalk to the work order.
          </p>
        </Reveal>
        <Reveal>
          <CivicMapPreview className="aspect-[16/11] min-h-72 lg:min-h-0" />
        </Reveal>
      </div>
    </section>
  )
}
