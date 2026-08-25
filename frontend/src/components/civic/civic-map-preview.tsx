import { CivicMap } from '@/components/civic/civic-map'
import { demoMapIssues } from '@/data/demo-issues'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CivicMapPreviewProps {
  className?: string
  showPanel?: boolean
}

export function CivicMapPreview({ className, showPanel = true }: CivicMapPreviewProps) {
  const [activeId, setActiveId] = useState(demoMapIssues[0]?.id ?? 'CF-1843')

  return (
    <CivicMap
      issues={demoMapIssues}
      selectedId={activeId}
      onSelect={setActiveId}
      showPanel={showPanel}
      className={cn('min-h-80', className)}
    />
  )
}
