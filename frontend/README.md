# Beatrix Movie Frontend

React + Vite frontend for the Beatrix Movie booking UI.

## Setup

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Feature Structure

- `src/app` - app shell and route constants
- `src/features/auth` - login, register, protected route UI
- `src/features/movies` - movie catalogue UI
- `src/features/showtimes` - showtime and seat selection UI
- `src/features/bookings` - booking confirmation and history UI
- `src/features/admin` - admin dashboard and management UI
- `src/shared` - shared UI, API helpers, and utilities

## Showtime Feature Files

- `src/app/App.jsx` - app-level page switching
- `src/app/routes.jsx` - route constants and route notes
- `src/features/movies/pages/HomePage.jsx` - movie catalogue home UI
- `src/features/movies/data/movies.js` - local movie data
- `src/features/showtimes/pages/SeatSelectionPage.jsx` - showtime loading, selected showtime, selected seats
- `src/features/showtimes/components/ShowtimeList.jsx` - showtime list grouped by date
- `src/features/showtimes/components/SeatGrid.jsx` - seat map and booked/selected state
- `src/features/showtimes/components/SeatLegend.jsx` - seat status legend
- `src/features/showtimes/components/BookingSummary.jsx` - movie, showtime, seats, and total estimate
- `src/features/showtimes/services/showtimeApi.js` - backend API integration with local fallback data
- `src/features/showtimes/data/showtimes.js` - local demo showtime and booked seat data
- `src/shared/utils/formatters.js` - shared date, time, and currency helpers
