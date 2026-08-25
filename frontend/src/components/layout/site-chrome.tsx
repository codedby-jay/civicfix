import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from '@/components/civic/logo'
import { Button } from '@/components/ui/button'
import { brand } from '@/constants/brand'
import { landingAnchors, routes } from '@/constants/routes'
import { publicNavLinks } from '@/components/navigation/nav-links'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const onHome = location.pathname === routes.home

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-sm">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {publicNavLinks.map((link) => (
            <a
              key={link.label}
              href={onHome ? link.to.replace(routes.home, '') : link.to}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="sm" asChild>
            <NavLink to={routes.login}>Sign In</NavLink>
          </Button>
          <Button size="sm" asChild>
            <NavLink to={routes.report}>Report an Issue</NavLink>
          </Button>
        </div>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md border border-line lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-paper lg:hidden">
          <nav className="container-wide flex flex-col gap-1 py-3" aria-label="Mobile">
            {publicNavLinks.map((link) => (
              <a
                key={link.label}
                href={onHome ? link.to.replace(routes.home, '') : link.to}
                className="rounded-md px-2 py-2 text-sm text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              to={routes.login}
              className="rounded-md px-2 py-2 text-sm text-ink"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Button className="mt-2" asChild>
              <Link to={routes.report} onClick={() => setOpen(false)}>
                Report an Issue
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
      <span className="sr-only">{brand.tagline}</span>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-deep/60">
      <div className="container-wide grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-ink-muted">{brand.tagline}</p>
        </div>
        <FooterColumn
          title="Product"
          links={[
            { label: 'Report Issue', to: routes.report },
            { label: 'Explore Issues', to: routes.map },
            { label: 'Track Complaints', to: routes.complaints },
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            { label: 'About', to: landingAnchors.about },
            { label: 'Contact', to: landingAnchors.about },
          ]}
        />
        <div>
          <p className="text-xs font-medium tracking-[0.14em] text-ink-subtle uppercase">
            Developer
          </p>
          <a
            href={brand.githubUrl}
            className="mt-3 inline-block text-sm text-ink-muted hover:text-ink"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="container-wide border-t border-line py-5 text-xs text-ink-subtle">
        CivicFix is a civic-tech platform in active development.
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; to: string }[]
}) {
  return (
    <div>
      <p className="text-xs font-medium tracking-[0.14em] text-ink-subtle uppercase">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            {link.to.startsWith('http') || link.to.includes('#') ? (
              <a href={link.to} className="text-sm text-ink-muted hover:text-ink">
                {link.label}
              </a>
            ) : (
              <Link to={link.to} className="text-sm text-ink-muted hover:text-ink">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SkipLink() {
  return (
    <a
      href="#main"
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50',
        'rounded-md bg-brand px-3 py-2 text-sm text-white',
      )}
    >
      Skip to content
    </a>
  )
}
