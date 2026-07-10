# Showtime Backend Module

Owner: `Isi nama kamu`

This module owns showtime CRUD, showtime detail, and seat availability.

## Files

- `showtime.model.js` - Mongoose schema for movie, date, time, studio, price, and booked seats.
- `showtime.controller.js` - list, detail, seat availability, create, update, and delete logic.
- `showtime.routes.js` - `/api/showtimes` routes.
- `seatValidation.js` - seat layout, seat ID normalization, duplicate checks, and availability building.

## Endpoints

- `GET /api/movies/:movieId/showtimes`
- `GET /api/showtimes/:id`
- `GET /api/showtimes/:id/seats`
- `POST /api/showtimes`
- `PUT /api/showtimes/:id`
- `DELETE /api/showtimes/:id`
