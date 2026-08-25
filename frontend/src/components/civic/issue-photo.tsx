import { categoryIcons } from '@/lib/icons'
import type { IssueCategoryId } from '@/types/civic'
import { cn } from '@/lib/utils'

const scenes: Record<IssueCategoryId, { ground: string; accent: string }> = {
  potholes: { ground: '#8b8680', accent: '#4a453f' },
  garbage: { ground: '#9aa392', accent: '#5c6356' },
  streetlights: { ground: '#2c3340', accent: '#d4c48a' },
  water: { ground: '#6d7f88', accent: '#3d5c6e' },
  road: { ground: '#7a7670', accent: '#3f3c38' },
  drainage: { ground: '#6a756c', accent: '#2f4a52' },
  traffic: { ground: '#5c5c5c', accent: '#b42318' },
  property: { ground: '#8a917e', accent: '#4d5344' },
}

export function IssuePhoto({
  category,
  title,
  className,
}: {
  category: IssueCategoryId
  title: string
  className?: string
}) {
  const Icon = categoryIcons[category]
  const scene = scenes[category]

  return (
    <div
      className={cn('relative overflow-hidden rounded-md bg-paper-deep', className)}
      role="img"
      aria-label={`Photo placeholder for ${title}`}
    >
      <svg viewBox="0 0 160 100" className="size-full" aria-hidden>
        <rect width="160" height="100" fill={scene.ground} />
        <rect y="62" width="160" height="38" fill="#5c5854" />
        <path d="M0 62 H160" stroke="#6e6964" strokeWidth="2" />
        <ellipse cx="78" cy="74" rx="28" ry="10" fill={scene.accent} opacity="0.85" />
        <rect x="118" y="18" width="8" height="46" fill="#2b2b2b" />
        <circle cx="122" cy="16" r="7" fill={scene.accent} />
      </svg>
      <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-sm bg-ink/70 px-1.5 py-0.5 text-[10px] text-paper">
        <Icon className="size-3" />
        Sample photo
      </span>
    </div>
  )
}
