# API Contract

This document is the shared API reference for the 5 feature owners. Keep it updated whenever a route, request body, or response shape changes.

Base URL:

```txt
http://localhost:5000
```

## Authentication and Security

Status: implemented.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| POST | `/api/auth/logout` | Authenticated | Logout user |
| GET | `/api/auth/me` | Authenticated | Get current user |

Important rules:

- API responses must not include password or password hash.
- Registration must ignore role injection from public users.
- Admin-only routes must return `401` for guest and `403` for non-admin users.

## Movie Catalogue

Status: active public endpoints with search, filter, sort, and pagination.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/movies` | Public | List movies |
| GET | `/api/movies?search=arrival&genre=Sci-Fi&status=showing&page=1&limit=8&sort=rating` | Public | Search, filter, sort, and paginate movies |
| GET | `/api/movies/genres` | Public | List available genres |
| GET | `/api/movies/:idOrSlug` | Public | Movie detail |
| POST | `/api/movies` | Admin | Create movie |
| PUT | `/api/movies/:idOrSlug` | Admin | Update movie |
| DELETE | `/api/movies/:idOrSlug` | Admin | Delete movie if no showtimes exist |
| GET | `/api/movies/:movieId/showtimes` | Public | List showtimes for one movie |

## Showtime and Seat Selection

Status: active.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/showtimes` | Public | List showtimes with optional `movieId`, `date`, `from`, `studio`, `page`, and `limit` query |
| GET | `/api/movies/:movieId/showtimes` | Public | Showtime list for one movie |
| GET | `/api/showtimes/:id` | Public | Showtime detail |
| GET | `/api/showtimes/:id/seats` | Public | Latest seat availability |
| POST | `/api/showtimes` | Admin | Create showtime |
| PUT | `/api/showtimes/:id` | Admin | Update showtime |
| DELETE | `/api/showtimes/:id` | Admin | Delete showtime |

Create showtime request:

```json
{
  "movieId": "replace-with-movie-object-id",
  "date": "2026-07-10",
  "time": "19:40",
  "studio": "Hall IMAX",
  "price": 40000,
  "bookedSeats": ["A1", "A2"]
}
```

Seat IDs:

- Valid examples: `A1`, `A2`, `B1`, `F8`
- Invalid examples: `A0`, `A99`, `Z1`

## Booking System

Status: implemented with ownership, seat validation, and conflict protection.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/bookings` | Authenticated | Create validated booking |
| POST | `/api/bookings/checkout` | Authenticated | Backward-compatible mock QRIS checkout alias |
| GET | `/api/bookings/me` | Authenticated | Current user's booking history |
| GET | `/api/bookings/:id` | Owner/Admin | Booking detail |
| DELETE | `/api/bookings/:id` | Owner/Admin | Cancel booking and release seats |
| PATCH | `/api/bookings/:id/mock-paid` | Owner/Admin | Mark mock QRIS booking as paid and issue a ticket |
| POST | `/api/bookings/:id/email` | Owner/Admin | Send the mock ticket email after payment |
| GET | `/api/bookings/:id/ticket.pdf` | Owner/Admin | Download ticket PDF after payment |

Conflict rule:

- If seats are already booked, return `409` with `unavailableSeats`.
- Backend must recalculate total price from showtime price.
- Cancellation soft-marks the booking as `cancelled` and releases only its seats from that showtime.

Create booking request (client-provided prices, roles, and user IDs are ignored):

```json
{
  "showtimeId": "replace-with-showtime-object-id",
  "seats": ["A1", "A2"]
}
```

## Administration

Status: implemented.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/admin/bookings` | Admin | All bookings |
| POST | `/api/movies` | Admin | Create movie |
| POST | `/api/showtimes` | Admin | Create showtime |
| PUT | `/api/showtimes/:id` | Admin | Update showtime |
| DELETE | `/api/showtimes/:id` | Admin | Delete showtime |
