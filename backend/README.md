# Beatrix Movie Backend

Express + MongoDB API for the movie booking app.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Module Structure

- `src/modules/auth` - placeholder auth model, controller, routes, and middleware
- `src/modules/movies` - movie model, controller, and routes
- `src/modules/showtimes` - showtime model, controller, routes, and seat validation
- `src/modules/bookings` - booking model, checkout controller, ticket/payment routes
- `src/modules/admin` - placeholder admin controller and routes
- `src/services` - seed movies, ticket generation, and Xendit mock helpers
- `src/shared` - shared middleware and utilities

## Current Routes

Authentication placeholders:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Movies:

- `GET /api/movies`
- `GET /api/movies/:id`
- `POST /api/movies`
- `GET /api/movies/:movieId/showtimes`

Showtimes:

- `GET /api/showtimes/:id`
- `GET /api/showtimes/:id/seats`
- `POST /api/showtimes`
- `PUT /api/showtimes/:id`
- `DELETE /api/showtimes/:id`

Bookings and payment mock:

- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/bookings/occupied`
- `POST /api/bookings/checkout`
- `PATCH /api/bookings/:id/mock-paid`
- `POST /api/bookings/:id/email`
- `POST /api/bookings/:id/mock-email`
- `GET /api/bookings/:id/ticket.pdf`

Admin placeholders:

- `GET /api/admin/stats`
- `GET /api/admin/bookings`

## Showtime Request Example

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
