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
- `src/pages` - route-level screens
- `src/components` - shared layout and reusable UI
- `src/services` - app-wide clients such as `apiClient.js`
- `src/hooks` - app-wide reusable hooks
- `src/utils` - shared formatting and asset helpers

## Important Files

- `src/app/App.jsx` - app-level route switching
- `src/hooks/useHashRoute.js` - hash route handling for home, booking, and payment
- `src/features/movies/hooks/useMovies.js` - loads movies from backend with local fallback
- `src/pages/HomePage.jsx` - movie catalogue home UI
- `src/pages/SeatSelectionPage.jsx` - showtime loading and seat selection demo flow
- `src/features/showtimes/components/BookingSummary.jsx` - shared summary for showtime and checkout flows
- `src/pages/BookingPage.jsx` - checkout flow with occupied seat loading
- `src/pages/PaymentPage.jsx` - Xendit-style QRIS mock payment and ticket view
- `src/services/apiClient.js` - generic API client
- `src/features/movies/api/movieApi.js` - movie API calls
- `src/features/bookings/api/bookingApi.js` - booking, payment, and ticket API calls
- `src/features/bookings/storage/checkoutStorage.js` - local checkout session persistence
