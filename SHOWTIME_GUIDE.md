# Showtime and Seat Selection Guide

This is the working guide for the Showtime and Seat Selection role.

## Scope

- Show movie showtimes by selected movie.
- Show showtime detail: date, time, studio, and ticket price.
- Show seat map with `available`, `selected`, and `booked` states.
- Show booking summary before the booking owner creates the final booking.
- Keep final price validation on the backend booking flow.

## Backend Ownership

Main files:

- `backend/src/models/Showtime.js`
- `backend/src/controllers/showtimeController.js`
- `backend/src/routes/showtimes.js`
- `backend/src/utils/seatValidation.js`
- `backend/src/routes/movies.js`
- `backend/src/server.js`

Endpoints:

- `GET /api/movies/:movieId/showtimes`
- `GET /api/showtimes/:id`
- `GET /api/showtimes/:id/seats`
- `POST /api/showtimes`
- `PUT /api/showtimes/:id`
- `DELETE /api/showtimes/:id`

Seat layout:

- Rows: `A` to `F`
- Seats per row: `1` to `8`
- Valid examples: `A1`, `A2`, `B1`, `F8`
- Invalid examples: `Z1`, `A0`, `A99`

## Frontend Ownership

Main files:

- `frontend/src/components/booking/SeatSelectionPage.jsx`
- `frontend/src/components/booking/ShowtimeList.jsx`
- `frontend/src/components/booking/SeatGrid.jsx`
- `frontend/src/components/booking/SeatLegend.jsx`
- `frontend/src/components/booking/BookingSummary.jsx`
- `frontend/src/services/showtimeApi.js`
- `frontend/src/data/showtimes.js`

The frontend currently has local fallback data, so the feature can be demoed before MongoDB has showtime seed data.

## Minimum Test Checklist

- List showtimes for the selected movie.
- Show no-showtime state when a movie has no schedule.
- Disable past showtimes.
- Load latest booked seats for a selected showtime.
- Allow available seats to be selected.
- Allow selected seats to be unselected.
- Prevent booked seats from being clicked.
- Update total estimate when selected seat count changes.
- Reset selected seats after changing showtime.

## Integration Notes

- Coordinate with Movie Catalogue for `GET /api/movies/:movieId/showtimes`.
- Coordinate with Booking System for final conflict handling and `409 unavailableSeats`.
- Coordinate with Administration for create, update, and delete showtime UI.
- The authentication checklist from the screenshot belongs to the Authentication and Security role, not this showtime role.
