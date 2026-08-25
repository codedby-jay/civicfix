import { Outlet } from 'react-router-dom'
import { SiteFooter, SiteHeader, SkipLink } from '@/components/layout/site-chrome'

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-paper">
      <SkipLink />
      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
