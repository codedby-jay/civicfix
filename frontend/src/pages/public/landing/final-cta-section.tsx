import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/reveal'
import { Button } from '@/components/ui/button'
import { routes } from '@/constants/routes'

export function FinalCtaSection() {
  return (
    <section className="bg-brand-ink text-paper">
      <div className="container-wide py-16">
        <Reveal>
          <h2 className="max-w-xl font-display text-3xl tracking-tight text-paper sm:text-4xl">
            See something that needs fixing?
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-paper/75">
            Report it. Track it. Help make your city better.
          </p>
          <Button
            size="lg"
            className="mt-7 bg-paper text-brand-ink hover:bg-paper-deep"
            asChild
          >
            <Link to={routes.report}>Report an Issue</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
