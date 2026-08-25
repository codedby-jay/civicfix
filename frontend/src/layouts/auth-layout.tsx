import { Outlet } from 'react-router-dom'
import { Logo } from '@/components/civic/logo'
import { SkipLink } from '@/components/layout/site-chrome'
import { brand } from '@/constants/brand'

export function AuthLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <SkipLink />
      <aside className="relative hidden overflow-hidden bg-brand-ink px-12 py-10 text-paper lg:flex lg:flex-col">
        <Logo className="text-paper [&_span:last-child]:text-paper" />
        <div className="mt-auto max-w-md pb-8">
          <p className="font-display text-4xl leading-tight text-paper">{brand.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-paper/75">
            A quieter way to make civic problems visible — from the sidewalk to the work order.
          </p>
        </div>
        <div className="pointer-events-none absolute inset-0 civic-map-grid opacity-20" />
      </aside>
      <div className="flex flex-col bg-paper">
        <div className="flex h-16 items-center px-5 lg:hidden">
          <Logo />
        </div>
        <main id="main" className="flex flex-1 items-center px-5 py-10 sm:px-10">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
