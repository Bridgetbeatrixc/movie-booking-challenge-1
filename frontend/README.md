# Beatrix Movie Frontend

React + Vite frontend for the Beatrix Movie booking UI.

The frontend loads movies from the backend API when available, falls back to local sample data if the API is offline, and sends checkout requests to the backend QRIS payment flow.

## Setup

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Environment

Optional:

```bash
VITE_API_URL=http://localhost:5000
```

## Main Feature Areas

- Home movie catalogue
- Booking and seat selection
- QRIS sandbox payment page
- Paid ticket popup modal
- Ticket PDF download
- Ticket email delivery through backend

## Showtime Feature Files

- `src/components/booking/SeatSelectionPage.jsx` - showtime loading, selected showtime, selected seats
- `src/components/booking/ShowtimeList.jsx` - showtime list grouped by date
- `src/components/booking/SeatGrid.jsx` - seat map and booked/selected state
- `src/components/booking/SeatLegend.jsx` - seat status legend
- `src/components/booking/BookingSummary.jsx` - shared booking summary for checkout and showtime views
- `src/services/showtimeApi.js` - backend API integration with local fallback data
- `src/data/showtimes.js` - local demo showtime and booked seat data
