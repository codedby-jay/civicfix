export const complaintStatuses = [
  'reported',
  'reviewed',
  'assigned',
  'in_progress',
  'resolved',
] as const

export type ComplaintStatus = (typeof complaintStatuses)[number]

export const severityLevels = ['critical', 'high', 'medium', 'low'] as const

export type SeverityLevel = (typeof severityLevels)[number]

export type IssueCategoryId =
  | 'potholes'
  | 'garbage'
  | 'streetlights'
  | 'water'
  | 'road'
  | 'drainage'
  | 'traffic'
  | 'property'

export interface IssueCategory {
  id: IssueCategoryId
  label: string
  description: string
}

export interface CivicIssuePreview {
  id: string
  title: string
  category: IssueCategoryId
  severity: SeverityLevel
  status: ComplaintStatus
  locationLabel: string
  reportedAtLabel: string
  x: number
  y: number
}
