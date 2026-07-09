# Beatrix Movie Frontend

React + Vite frontend for the Beatrix Movie booking UI.

## Setup

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Showtime Feature Files

- `src/components/booking/SeatSelectionPage.jsx` - showtime loading, selected showtime, selected seats
- `src/components/booking/ShowtimeList.jsx` - showtime list grouped by date
- `src/components/booking/SeatGrid.jsx` - seat map and booked/selected state
- `src/components/booking/SeatLegend.jsx` - seat status legend
- `src/components/booking/BookingSummary.jsx` - movie, showtime, seats, and total estimate
- `src/services/showtimeApi.js` - backend API integration with local fallback data
- `src/data/showtimes.js` - local demo showtime and booked seat data
