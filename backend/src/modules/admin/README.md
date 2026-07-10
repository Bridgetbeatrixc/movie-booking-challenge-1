# Administration Backend Module

Owner: `Isi nama anggota 5`

This module is the placeholder for admin dashboard stats, all-bookings monitoring, and admin-only API coordination.

## Files

- `admin.controller.js` - placeholder admin handlers.
- `admin.routes.js` - placeholder `/api/admin` routes.

## Planned Endpoints

- `GET /api/admin/stats`
- `GET /api/admin/bookings`

## Integration

- Must use `authenticate` and `requireAdmin` from the Authentication module when auth is implemented.
- Reuses movie, showtime, and booking modules.
