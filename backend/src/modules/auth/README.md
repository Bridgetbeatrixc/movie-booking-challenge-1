# Authentication Backend Module

Owner: `Isi nama anggota 1`

This module is the placeholder for registration, login, JWT/session handling, protected routes, and role access.

## Files

- `auth.model.js` - placeholder user schema.
- `auth.controller.js` - placeholder auth handlers.
- `auth.routes.js` - placeholder `/api/auth` routes.
- `auth.middleware.js` - placeholder `authenticate` and `requireAdmin` middleware.

## Planned Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Required Tests

- Valid registration.
- Duplicate email rejection.
- Invalid email format.
- Missing email or password.
- Password confirmation mismatch.
- Password hash does not leak in API response.
- Admin role injection prevention.
- Valid login.
- Wrong password rejection.
- Unknown account rejection.
- NoSQL operator login safety.
- Optional login rate-limit observation.
- Logout and access after logout.
