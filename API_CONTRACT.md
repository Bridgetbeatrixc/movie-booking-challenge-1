# API Contract

This document is the shared API reference for the 5 feature owners. Keep it updated whenever a route, request body, or response shape changes.

Base URL:

```txt
http://localhost:5000
```

## Authentication and Security

Status: placeholder.

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

Status: active basic endpoints.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/movies` | Public | List movies |
| POST | `/api/movies` | Admin later | Create movie |
| GET | `/api/movies/:movieId/showtimes` | Public | List showtimes for one movie |

## Showtime and Seat Selection

Status: active.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/movies/:movieId/showtimes` | Public | Showtime list for one movie |
| GET | `/api/showtimes/:id` | Public | Showtime detail |
| GET | `/api/showtimes/:id/seats` | Public | Latest seat availability |
| POST | `/api/showtimes` | Admin later | Create showtime |
| PUT | `/api/showtimes/:id` | Admin later | Update showtime |
| DELETE | `/api/showtimes/:id` | Admin later | Delete showtime |

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

Status: active basic endpoints, full ownership/conflict flow planned.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/bookings` | Authenticated later | Create booking |
| GET | `/api/bookings` | Temporary/basic | List bookings |
| GET | `/api/bookings/me` | Authenticated | Planned user booking history |
| GET | `/api/bookings/:id` | Owner/Admin | Planned booking detail |
| DELETE | `/api/bookings/:id` | Owner/Admin | Planned cancellation and seat release |

Conflict rule:

- If seats are already booked, return `409` with `unavailableSeats`.
- Backend must recalculate total price from showtime price.

## Administration

Status: placeholder.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/admin/bookings` | Admin | All bookings |
| POST | `/api/movies` | Admin later | Create movie |
| POST | `/api/showtimes` | Admin later | Create showtime |
| PUT | `/api/showtimes/:id` | Admin later | Update showtime |
| DELETE | `/api/showtimes/:id` | Admin later | Delete showtime |
