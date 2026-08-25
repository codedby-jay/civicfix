export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  report: '/report',
  complaints: '/complaints',
  complaintDetail: '/complaints/:id',
  map: '/map',
  admin: '/admin',
  profile: '/profile',
} as const

export const landingAnchors = {
  howItWorks: '/#how-it-works',
  explore: '/#explore-issues',
  about: '/#about',
  map: '/#map-experience',
  tracking: '/#tracking',
} as const

export type AppRoute = (typeof routes)[keyof typeof routes]
