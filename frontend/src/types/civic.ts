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

export type PriorityLevel = 'urgent' | 'standard' | 'watch'

export interface IssueCategory {
  id: IssueCategoryId
  label: string
  description: string
}

export interface AnalysisPreview {
  detected: string
  confidence: number
  safetyRisk: string
  suggestedDepartment: string
  nearbyDuplicates: number
}

export interface TimelineEvent {
  status: ComplaintStatus
  atLabel: string
  note: string
}

export interface ActivityEvent {
  atLabel: string
  actor: string
  note: string
}

export interface ComplaintRecord {
  id: string
  title: string
  description: string
  category: IssueCategoryId
  severity: SeverityLevel
  status: ComplaintStatus
  priority: PriorityLevel
  department: string
  locationLabel: string
  reportedAtLabel: string
  assignedTo: string | null
  reporterName: string
  isMine: boolean
  x: number
  y: number
  analysis: AnalysisPreview
  timeline: TimelineEvent[]
  activity: ActivityEvent[]
  similarIds: string[]
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
