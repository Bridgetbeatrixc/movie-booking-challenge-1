# Beatrix Movie Backend

Express + MongoDB API for the movie booking app.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Current Routes

Movies:

- `GET /api/movies`
- `POST /api/movies`
- `GET /api/movies/:movieId/showtimes`

Showtimes:

- `GET /api/showtimes/:id`
- `GET /api/showtimes/:id/seats`
- `POST /api/showtimes`
- `PUT /api/showtimes/:id`
- `DELETE /api/showtimes/:id`

Bookings:

- `GET /api/bookings`
- `POST /api/bookings`

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
