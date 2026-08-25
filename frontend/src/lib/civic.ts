import type { AnalysisPreview, IssueCategoryId } from '@/types/civic'
import { issueCategories } from '@/data/issue-categories'

export function categoryLabel(id: IssueCategoryId): string {
  return issueCategories.find((category) => category.id === id)?.label ?? id
}

export function analysisForCategory(category: IssueCategoryId): AnalysisPreview {
  const table: Record<IssueCategoryId, AnalysisPreview> = {
    potholes: {
      detected: 'Pothole',
      confidence: 94,
      safetyRisk: 'Potential',
      suggestedDepartment: 'Road & Infrastructure',
      nearbyDuplicates: 3,
    },
    garbage: {
      detected: 'Uncollected waste',
      confidence: 91,
      safetyRisk: 'Low',
      suggestedDepartment: 'Sanitation',
      nearbyDuplicates: 2,
    },
    streetlights: {
      detected: 'Streetlight outage',
      confidence: 96,
      safetyRisk: 'Potential',
      suggestedDepartment: 'Public Lighting',
      nearbyDuplicates: 1,
    },
    water: {
      detected: 'Water leakage',
      confidence: 89,
      safetyRisk: 'Elevated',
      suggestedDepartment: 'Water Services',
      nearbyDuplicates: 2,
    },
    road: {
      detected: 'Pavement failure',
      confidence: 87,
      safetyRisk: 'Potential',
      suggestedDepartment: 'Road & Infrastructure',
      nearbyDuplicates: 4,
    },
    drainage: {
      detected: 'Blocked drain',
      confidence: 93,
      safetyRisk: 'Elevated',
      suggestedDepartment: 'Water Services',
      nearbyDuplicates: 2,
    },
    traffic: {
      detected: 'Signal fault',
      confidence: 90,
      safetyRisk: 'Elevated',
      suggestedDepartment: 'Traffic Operations',
      nearbyDuplicates: 1,
    },
    property: {
      detected: 'Damaged fixture',
      confidence: 85,
      safetyRisk: 'Low',
      suggestedDepartment: 'Parks & Property',
      nearbyDuplicates: 0,
    },
  }

  return table[category]
}

export function complaintPath(id: string): string {
  return `/complaints/${id}`
}
