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
- `src/features/movies` - movie catalogue UI and movie API loading
- `src/features/showtimes` - showtime and seat selection UI
- `src/features/bookings` - checkout, payment mock, and ticket UI
- `src/features/admin` - admin dashboard and management UI
- `src/shared` - shared layout, API helpers, hooks, and utilities

## Important Files

- `src/app/App.jsx` - app-level route switching
- `src/shared/hooks/useHashRoute.js` - hash route handling for home, booking, and payment
- `src/features/movies/hooks/useMovies.js` - loads movies from backend with local fallback
- `src/features/movies/pages/HomePage.jsx` - movie catalogue home UI
- `src/features/showtimes/pages/SeatSelectionPage.jsx` - showtime loading and seat selection demo flow
- `src/features/showtimes/components/BookingSummary.jsx` - shared summary for showtime and checkout flows
- `src/features/bookings/pages/BookingPage.jsx` - checkout flow with occupied seat loading
- `src/features/bookings/pages/PaymentPage.jsx` - Xendit-style QRIS mock payment and ticket view
- `src/shared/api/api.js` - booking, payment, ticket, and movie API calls
- `src/features/bookings/services/checkoutStorage.js` - local checkout session persistence
