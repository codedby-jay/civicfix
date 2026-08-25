# CivicFix

**Report. Track. Fix.**

CivicFix is a civic-tech platform for reporting, tracking, and resolving neighborhood infrastructure issues. Phase 3 connects the existing frontend to a production-shaped Express API with MongoDB and cookie-based authentication.

## Architecture

```
civicfix/
├── frontend/     React + Vite + TypeScript UI
├── backend/      Express + MongoDB API
├── docs/         Design system, flows, and API reference
└── README.md
```

The frontend and backend are separate packages. The Vite dev server proxies `/api` to `http://127.0.0.1:5000` so session cookies stay same-origin.

## Tech stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS

**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod, Helmet, CORS, express-rate-limit, cookie-parser

## Local setup

Requires Node.js 22+.

```bash
git clone <repository-url>
cd civicfix
npm install --prefix frontend
npm install --prefix backend
```

Copy environment templates (never commit real `.env` files):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Set `JWT_SECRET` in `backend/.env` to a long random string.

### MongoDB

Option A — local MongoDB:

```
MONGODB_URI=mongodb://127.0.0.1:27017/civicfix
```

Option B — in-process MongoDB for development (no separate install):

```
MONGODB_URI=memory
```

The API loads environment variables, validates them, connects to MongoDB, then starts Express. Connection failures exit the process without binding the port.

### Seed data

```bash
npm run seed --prefix backend
```

Creates 8 demo users and 24 complaints (including CF-1843, CF-1821, and CF-1798). Every seed account uses password `CivicFix123!`.

| Email | Role |
| --- | --- |
| maya.chen@civicfix.dev | citizen |
| alex.rivera@civicfix.dev | authority |
| chris.brooks@civicfix.dev | admin |

### Run

From the repository root:

```bash
npm run dev:frontend
npm run dev:backend
```

Or start both:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health: http://localhost:5000/api/health

### Environment variables

**Backend** (`backend/.env`):

| Name | Purpose |
| --- | --- |
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | Mongo connection string, or `memory` |
| `JWT_SECRET` | Signing secret (minimum 16 characters) |
| `JWT_EXPIRES_IN` | Access token lifetime (default `15m`) |
| `CLIENT_URL` | Allowed frontend origin for CORS |
| `NODE_ENV` | `development`, `test`, or `production` |

**Frontend** (`frontend/.env`):

| Name | Purpose |
| --- | --- |
| `VITE_API_URL` | API base. Default `/api` (Vite proxy). |

Production CORS allows only `CLIENT_URL`. It does not use `Access-Control-Allow-Origin: *`.

## Development commands

| Command | Where | Action |
| --- | --- | --- |
| `npm run dev` | frontend / backend | Watch mode |
| `npm run build` | frontend / backend | Production build |
| `npm run lint` | frontend / backend | Typecheck / oxlint |
| `npm start` | backend | Run compiled `dist/server.js` |
| `npm run seed` | backend | Insert demo data |
| `npm test` | backend | API tests (in-memory MongoDB) |

Root scripts: `npm run lint`, `npm run build`, `npm test`, `npm run seed`, `npm run dev:frontend`, `npm run dev:backend`.

## API overview

Documented in [docs/api.md](docs/api.md).

| Area | Endpoints |
| --- | --- |
| Health | `GET /api/health` |
| Auth | `POST /api/auth/register`, `login`, `logout`, `refresh`; `GET /api/auth/me` |
| Users | `GET/PATCH /api/users/me`, `GET /api/users/:id`, admin list/update |
| Complaints | `POST/GET /api/complaints`, `GET/PATCH/DELETE /api/complaints/:id`, status and timeline |

Session cookies are HTTP-only. Passwords are hashed with bcrypt and stripped from JSON.

## Documentation

- [API reference](docs/api.md)
- [Design system](docs/design-system.md)
- [UI architecture](docs/ui-architecture.md)
- [User flows](docs/user-flows.md)
