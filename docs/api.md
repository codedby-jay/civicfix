# CivicFix API

Base URL (local): `http://localhost:5000`

All JSON responses use a consistent envelope.

Success:

```json
{
  "success": true,
  "data": {}
}
```

List endpoints also include `pagination`.

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Enter a valid email address" }]
}
```

Authentication uses HTTP-only cookies (`civicfix_access`, `civicfix_refresh`). Do not store tokens in `localStorage`. Send `credentials: "include"` from the browser. A `Bearer` access token is also accepted on the `Authorization` header for API clients.

Roles: `citizen`, `authority`, `admin`.

---

## Health

### GET `/api/health`

Authentication: none

Request body: none

Query parameters: none

Response `200`:

```json
{
  "success": true,
  "message": "CivicFix API is running",
  "timestamp": "2026-08-25T17:00:00.000Z",
  "data": { "database": "connected" }
}
```

Errors: none expected when the process is running.

---

## Authentication

### POST `/api/auth/register`

Authentication: none (rate limited)

Request body:

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| name | string | yes | minimum 2 characters |
| email | string | yes | valid email, unique, stored lowercase |
| password | string | yes | minimum 8 characters |
| phone | string | no | |
| location | string or object | no | string maps to `{ city }`; object may include `address`, `city`, `state`, `postalCode`, `latitude`, `longitude` |

Response `201`: public user object. Sets access and refresh cookies.

Errors:

- `400` validation failed
- `409` email already registered

### POST `/api/auth/login`

Authentication: none (rate limited)

Request body:

| Field | Type | Required |
| --- | --- | --- |
| email | string | yes |
| password | string | yes |

Response `200`: public user object. Sets cookies.

Errors:

- `400` validation failed
- `401` `Invalid email or password` (same message whether the email exists or not)

### POST `/api/auth/logout`

Authentication: optional (increments `tokenVersion` when a valid access cookie is present)

Request body: none

Response `200`: `{ "loggedOut": true }`. Clears cookies.

Errors: none for a successful cookie clear.

### GET `/api/auth/me`

Authentication: required

Request body: none

Response `200`: public user object (no password).

Errors:

- `401` missing, invalid, or expired token

### POST `/api/auth/refresh`

Authentication: refresh cookie

Request body: none

Response `200`: public user object. Rotates cookies.

Errors:

- `401` missing or invalid refresh token

---

## Users

Passwords are never returned.

### GET `/api/users/me`

Authentication: required

Response `200`: current user.

Errors: `401`

### PATCH `/api/users/me`

Authentication: required

Request body (all optional): `name`, `phone`, `location` (object), `avatar`

Response `200`: updated user.

Errors: `400`, `401`

### GET `/api/users`

Authentication: admin

Response `200`: array of users (capped at 100).

Errors: `401`, `403`

### GET `/api/users/:id`

Authentication: required. Citizens may only read their own id. Admins may read any user.

Response `200`: user.

Errors: `401`, `403`, `404`

### PATCH `/api/users/:id`

Authentication: admin

Request body: profile fields plus optional `role`, `isActive`

Response `200`: updated user.

Errors: `400`, `401`, `403`, `404`

---

## Complaints

Public complaint ids look like `CF-1843`. Path `:id` accepts that value or a MongoDB ObjectId.

### POST `/api/complaints`

Authentication: required (any signed-in role)

Request body:

| Field | Type | Required |
| --- | --- | --- |
| title | string | yes (min 4) |
| description | string | yes (min 12) |
| category | enum | yes |
| severity | enum | yes |
| location | object | yes (`city` or `address`) |
| priority | enum | no (defaults to severity) |
| images | string[] | no (URL placeholders only) |
| department | string | no |

Categories: `pothole`, `garbage`, `streetlight`, `water-leakage`, `road-damage`, `drainage`, `traffic`, `public-property`, `other`

Severity / priority: `critical`, `high`, `medium`, `low`

Status values: `reported`, `under-review`, `assigned`, `in-progress`, `resolved`, `rejected`

Response `201`: complaint with initial timeline entry.

Errors: `400`, `401`

### GET `/api/complaints`

Authentication: required

Query parameters:

| Name | Default | Notes |
| --- | --- | --- |
| page | 1 | |
| limit | 20 | max 100 |
| status | | |
| severity | | |
| category | | |
| search | | title, description, complaintId |
| sort | `-createdAt` | prefix `-` for descending |
| scope | | citizens: omit for own, `public` for public list; authority: omit for assigned, `public`/`all` for broader list |

Citizens see their own complaints by default. Authorities see assigned complaints by default. Admins see all complaints.

Response `200`:

```json
{
  "success": true,
  "data": [],
  "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

Errors: `400`, `401`

### GET `/api/complaints/:id`

Authentication: required

Citizens may not read rejected complaints they do not own.

Response `200`: complaint.

Errors: `401`, `403`, `404`

### PATCH `/api/complaints/:id`

Authentication: `authority` or `admin`

Authorities may only update complaints assigned to them. Admins may update any complaint.

Request body (all optional): `title`, `description`, `category`, `severity`, `priority`, `location`, `department`, `assignedTo`, `images`

Response `200`: complaint.

Errors: `400`, `401`, `403`, `404`

### PATCH `/api/complaints/:id/status`

Authentication: `authority` or `admin` (same assignment rules)

Request body: `{ "status": "in-progress", "message": "optional" }`

Response `200`: complaint with a new timeline entry.

Errors: `400`, `401`, `403`, `404`

### POST `/api/complaints/:id/timeline`

Authentication: `authority` or `admin` (same assignment rules)

Request body: `{ "message": "Repair work has started.", "status": "in-progress" }`

`status` is optional; when omitted the current status is kept.

Response `200`: complaint.

Errors: `400`, `401`, `403`, `404`

### DELETE `/api/complaints/:id`

Authentication: admin

Response `200`: `{ "deleted": true, "complaintId": "CF-1843" }`

Errors: `401`, `403`, `404`

---

## HTTP status codes

| Code | Meaning |
| --- | --- |
| 200 | Success |
| 201 | Created |
| 400 | Validation failed |
| 401 | Authentication required or invalid |
| 403 | Authenticated but not allowed |
| 404 | Route or resource not found |
| 409 | Duplicate key (typically email) |
| 429 | Rate limit |
| 500 | Unexpected server error (no stack traces in production) |
