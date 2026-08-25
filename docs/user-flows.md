# CivicFix user flows (Phase 1)

These flows describe the interface that exists today. Authentication, persistence, and intelligence are not live.

## Citizen — discover

1. Land on `/`.
2. Read how CivicFix works, issue types, map, and tracking.
3. Choose **Report an Issue** or **Explore Civic Issues**.

## Citizen — report (scaffolded)

1. Open `/report` from the navbar, hero, footer, or final CTA.
2. See the report form structure (disabled until the API exists).
3. Return later in Phase 2 to upload a photo, attach a location, and submit.

## Citizen — track (scaffolded)

1. Open `/complaints` to see the empty tracking list.
2. Open `/dashboard` for the citizen home placeholder.
3. Open `/map` for the civic map surface.

## Authentication UI

### Sign in (`/login`)

1. Enter email and password.
2. Optionally check Remember me.
3. Submit.
4. Client validation runs. On success, a toast explains that auth is not connected.
5. Forgot password explains the same.

### Register (`/register`)

1. Enter name, email, password, confirm password, and location.
2. Submit.
3. Client validation runs (including password match).
4. A toast explains that account creation is not connected.

## Operations

`/admin` is a structural placeholder for queue, assignment, and priority tools.

## Navigation notes

Public nav links to in-page anchors on the landing page: How It Works, Explore Issues, About. From other routes those links return to `/#...`.

Protected application screens share a left navigation (desktop) and a compact top navigation (mobile).
