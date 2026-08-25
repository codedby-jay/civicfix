import {
  Cone,
  Droplets,
  Layers,
  Lightbulb,
  Recycle,
  Signpost,
  TrafficCone,
  Waves,
} from 'lucide-react'
import { issueCategories } from '@/data/issue-categories'
import type { IssueCategoryId } from '@/types/civic'

const icons: Record<IssueCategoryId, typeof Cone> = {
  potholes: Cone,
  garbage: Recycle,
  streetlights: Lightbulb,
  water: Droplets,
  road: Layers,
  drainage: Waves,
  traffic: TrafficCone,
  property: Signpost,
}

export function IssueCategoryList() {
  return (
    <ul className="grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
      {issueCategories.map((category) => {
        const Icon = icons[category.id]
        return (
          <li
            key={category.id}
            className="flex items-start gap-3 border-t border-line py-5"
          >
            <Icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            <div>
              <p className="text-sm font-medium text-ink">{category.label}</p>
              <p className="mt-1 text-sm text-ink-muted">{category.description}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
