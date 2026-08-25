import { landingAnchors, routes } from '@/constants/routes'

export const publicNavLinks = [
  { label: 'How It Works', to: landingAnchors.howItWorks },
  { label: 'Explore Issues', to: landingAnchors.explore },
  { label: 'About', to: landingAnchors.about },
] as const

export const appNavLinks = [
  { label: 'Dashboard', to: routes.dashboard },
  { label: 'Report', to: routes.report },
  { label: 'My complaints', to: routes.complaints },
  { label: 'Civic map', to: routes.map },
  { label: 'Admin', to: routes.admin },
] as const
