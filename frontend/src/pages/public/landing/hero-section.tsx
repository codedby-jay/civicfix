import { Link } from 'react-router-dom'
import { CivicMapPreview } from '@/components/civic/civic-map-preview'
import { Reveal } from '@/components/common/reveal'
import { Button } from '@/components/ui/button'
import { brand } from '@/constants/brand'
import { routes } from '@/constants/routes'

export function HeroSection() {
  return (
    <section className="border-b border-line">
      <div className="container-wide grid items-center gap-12 py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:py-24">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.18em] text-brand uppercase">
            Civic issue management
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
            {brand.tagline}
          </h1>
          <p className="mt-5 max-w-md font-display text-xl text-ink-muted">
            Turn everyday civic problems into visible, trackable action.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-muted">
            {brand.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to={routes.report}>Report an Issue</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to={routes.map}>Explore Civic Issues</Link>
            </Button>
          </div>
        </Reveal>
        <Reveal>
          <CivicMapPreview className="aspect-[5/4] min-h-80" />
        </Reveal>
      </div>
    </section>
  )
}
