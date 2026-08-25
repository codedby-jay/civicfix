import { LayoutDashboard, Map, Plus, Shield, FolderOpen } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { routes } from '@/constants/routes'
import { cn } from '@/lib/utils'

const items = [
  { to: routes.dashboard, label: 'Home', icon: LayoutDashboard },
  { to: routes.complaints, label: 'Cases', icon: FolderOpen },
  { to: routes.report, label: 'Report', icon: Plus, prominent: true },
  { to: routes.map, label: 'Map', icon: Map },
  { to: routes.admin, label: 'Ops', icon: Shield },
]

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Primary mobile"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 py-2 text-[11px]',
                    isActive ? 'text-brand' : 'text-ink-subtle',
                  )
                }
              >
                <span
                  className={cn(
                    'flex items-center justify-center',
                    item.prominent
                      ? 'size-9 -mt-1 rounded-full bg-brand text-white'
                      : '',
                  )}
                >
                  <Icon className="size-4" />
                </span>
                {item.label}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
