import { CivicMapPreview } from '@/components/civic/civic-map-preview'
import { Reveal } from '@/components/common/reveal'
import { SectionHeader } from '@/components/common/page-header'

export function MapExperienceSection() {
  return (
    <section id="map-experience" className="scroll-mt-20 border-b border-line">
      <div className="container-wide py-20">
        <Reveal>
          <SectionHeader
            eyebrow="Civic map"
            title="See what is happening on the ground"
            description="Markers, severity, and a live preview of each report — ready for a full Leaflet map in a later phase."
          />
        </Reveal>
        <Reveal className="mt-10">
          <CivicMapPreview className="min-h-[28rem] sm:min-h-[32rem]" />
        </Reveal>
      </div>
    </section>
  )
}
