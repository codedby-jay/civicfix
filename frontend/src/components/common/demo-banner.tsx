import { demoDataNotice } from '@/constants/demo'
import { cn } from '@/lib/utils'

export function DemoBanner({
  children = demoDataNotice,
  className,
}: {
  children?: string
  className?: string
}) {
  return (
    <p
      className={cn(
        'border-l-2 border-brand/40 pl-3 text-xs leading-relaxed text-ink-subtle',
        className,
      )}
    >
      {children}
    </p>
  )
}
