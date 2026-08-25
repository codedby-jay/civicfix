import type { IssueCategory } from '@/types/civic'

export const issueCategories: IssueCategory[] = [
  {
    id: 'potholes',
    label: 'Potholes',
    description: 'Surface breaks and unsafe road cavities',
  },
  {
    id: 'garbage',
    label: 'Garbage',
    description: 'Overflowing bins and uncollected waste',
  },
  {
    id: 'streetlights',
    label: 'Streetlights',
    description: 'Outages that leave streets unlit',
  },
  {
    id: 'water',
    label: 'Water leakage',
    description: 'Burst pipes, hydrants, and standing water',
  },
  {
    id: 'road',
    label: 'Road damage',
    description: 'Cracks, sinkage, and failed pavement',
  },
  {
    id: 'drainage',
    label: 'Drainage',
    description: 'Blocked drains and flooding risk',
  },
  {
    id: 'traffic',
    label: 'Traffic',
    description: 'Signal faults and unsafe intersections',
  },
  {
    id: 'property',
    label: 'Public property',
    description: 'Damaged benches, signs, and fixtures',
  },
]
