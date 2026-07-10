# Showtime Frontend Feature

Owner: `Isi nama kamu`

This folder contains the public showtime and seat selection flow.

## Files

- `pages/SeatSelectionPage.jsx` - page state for showtime loading, seat loading, selected seats, and summary actions.
- `components/ShowtimeList.jsx` - schedule list grouped by date.
- `components/SeatGrid.jsx` - visual seat map with available, selected, and booked states.
- `components/SeatLegend.jsx` - seat status legend.
- `components/BookingSummary.jsx` - selected movie, showtime, seats, and estimated total.
- `services/showtimeApi.js` - API calls with local fallback data.
- `data/showtimes.js` - local showtime and booked-seat demo data.

## Integration

- Reads movie data from `../movies`.
- Reads shared format helpers from `../../shared`.
- Sends selected showtime and seats to the Booking feature when the final booking flow is connected.
