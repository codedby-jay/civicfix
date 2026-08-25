export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  report: '/report',
  complaints: '/complaints',
  map: '/map',
  admin: '/admin',
} as const

export const landingAnchors = {
  howItWorks: '/#how-it-works',
  explore: '/#explore-issues',
  about: '/#about',
  map: '/#map-experience',
  tracking: '/#tracking',
} as const

export type AppRoute = (typeof routes)[keyof typeof routes]
