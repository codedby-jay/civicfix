import { CivicMapPreview } from '@/components/civic/civic-map-preview'
import { PageHeader } from '@/components/common/page-header'
import { getConfiguredTileUrl, leafletDefaults } from '@/lib/leaflet'

export function MapPage() {
  const tileUrl = getConfiguredTileUrl()

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Map"
        title="Civic map"
        description={
          tileUrl
            ? `Leaflet-ready surface using configured tiles. Default view ${String(leafletDefaults.center)}.`
            : 'A designed map surface, architecturally ready for React Leaflet. No tile API keys are used in this phase.'
        }
      />
      <CivicMapPreview className="mt-8 min-h-[28rem]" />
    </div>
  )
}
