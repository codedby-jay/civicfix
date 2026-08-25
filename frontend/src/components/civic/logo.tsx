import { Link } from 'react-router-dom'
import { brand } from '@/constants/brand'
import { routes } from '@/constants/routes'
import { cn } from '@/lib/utils'

interface LogoProps {
  compact?: boolean
  className?: string
  to?: string
}

export function Logo({ compact = false, className, to = routes.home }: LogoProps) {
  return (
    <Link to={to} className={cn('inline-flex items-center gap-2.5 text-ink', className)}>
      <span
        className="inline-flex size-7 items-center justify-center rounded-md bg-brand text-[0.7rem] font-semibold tracking-tight text-paper"
        aria-hidden
      >
        CF
      </span>
      {compact ? (
        <span className="sr-only">{brand.name}</span>
      ) : (
        <span className="text-[0.95rem] font-semibold tracking-tight">{brand.name}</span>
      )}
    </Link>
  )
}
