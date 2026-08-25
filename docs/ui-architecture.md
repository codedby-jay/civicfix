# CivicFix UI architecture

Phase 1 is frontend-only. The application lives in `frontend/` so a backend can be added at the repository root later without rewriting the client.

## Stack

- React 19, Vite, TypeScript (strict)
- Tailwind CSS 4
- React Router 7
- TanStack Query (provider installed; no remote queries yet)
- Radix primitives for dialog, select, dropdown, checkbox, tooltip, avatar
- Lucide React, Framer Motion, Recharts
- React Leaflet and Leaflet are installed and defaulted in `src/lib/leaflet.ts`. The visible map in this phase is `CivicMapPreview` so no tile API keys are required.

## Folder map

```
frontend/src/
  assets/          reserved for brand assets
  components/
    ui/            primitive controls
    layout/        public chrome
    common/        headers and states
    civic/         logo, badges, map preview
  pages/
    public/        landing
    auth/          login, register
    citizen/       dashboard, report, complaints, map
    admin/         admin placeholder
  layouts/         public, auth, app shells
  routes/          router and protected-route architecture
  hooks/
  lib/
  types/
  constants/
  data/            static demo content, labeled as sample data
  providers/
```

## Routing

| Path | Shell | Notes |
| --- | --- | --- |
| `/` | Public | Landing |
| `/login`, `/register` | Auth | Client-side validation only |
| `/dashboard`, `/report`, `/complaints`, `/map` | App + ProtectedRoute | Placeholders |
| `/admin` | App + ProtectedRoute | Placeholder |

`ProtectedRoute` is in place. `PHASE1_ALLOW_UNAUTHENTICATED_APP_ROUTES` keeps these screens visitable until real auth exists.

## Auth

`AuthProvider` currently returns `user: null` and `isAuthenticated: false`. Forms do not call an API and do not invent session state.

## Data

TanStack Query is configured with conservative defaults. No fetchers, mocks, or fake REST clients are included in this phase.

## Map

`CivicMapPreview` is the production UI for Phase 1. `getConfiguredTileUrl()` reads `VITE_MAP_TILE_URL` when a later phase enables tiles. Do not commit keys.
