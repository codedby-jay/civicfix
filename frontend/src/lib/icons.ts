import {
  Cone,
  Droplets,
  Layers,
  Lightbulb,
  Recycle,
  Signpost,
  TrafficCone,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import type { IssueCategoryId, SeverityLevel } from '@/types/civic'

export const categoryIcons: Record<IssueCategoryId, LucideIcon> = {
  potholes: Cone,
  garbage: Recycle,
  streetlights: Lightbulb,
  water: Droplets,
  road: Layers,
  drainage: Waves,
  traffic: TrafficCone,
  property: Signpost,
}

export const severityMarkerClass: Record<SeverityLevel, string> = {
  critical: 'bg-critical',
  high: 'bg-high',
  medium: 'bg-medium',
  low: 'bg-low',
}
