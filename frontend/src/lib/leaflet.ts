import type { LatLngExpression } from 'leaflet'

/** Defaults for the React Leaflet map. Wired in a later phase when tiles are configured. */
export const leafletDefaults = {
  center: [37.7749, -122.4194] as LatLngExpression,
  zoom: 13,
}

export function getConfiguredTileUrl(): string | undefined {
  const value = import.meta.env.VITE_MAP_TILE_URL
  return typeof value === 'string' && value.length > 0 ? value : undefined
}
