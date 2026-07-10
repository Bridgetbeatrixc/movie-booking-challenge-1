# Beatrix Movie

Clean two-folder project structure:

- `frontend/` - React + Vite movie booking UI
- `backend/` - Express + Mongoose MongoDB API template
- `FEATURE_OWNERS.md` - pembagian owner fitur untuk 5 anggota tim
- `API_CONTRACT.md` - shared API contract antar fitur
- `RUNNING_GUIDE.md` - panduan menjalankan project lokal
- `SHOWTIME_GUIDE.md` - guide for the Showtime and Seat Selection role

## Code Structure

Frontend:

```txt
frontend/src/
  app/
    App.jsx
    routes.jsx
  features/
    auth/
      pages/
      components/
      services/
      README.md
    movies/
      pages/
      components/
      services/
      data/
      README.md
    showtimes/
      pages/
      components/
      services/
      data/
      README.md
    bookings/
      pages/
      components/
      services/
      README.md
    admin/
      pages/
      components/
      services/
      README.md
  shared/
    components/
    utils/
    api/
```

Backend:

```txt
backend/src/
  server.js
  config/
  modules/
    auth/
      auth.model.js
      auth.controller.js
      auth.routes.js
      auth.middleware.js
    movies/
      movie.model.js
      movie.controller.js
      movie.routes.js
    showtimes/
      showtime.model.js
      showtime.controller.js
      showtime.routes.js
      seatValidation.js
    bookings/
      booking.model.js
      booking.controller.js
      booking.routes.js
    admin/
      admin.controller.js
      admin.routes.js
  shared/
    middleware/
    utils/
```

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

## Run backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Frontend default: `http://localhost:5173`
Backend default: `http://localhost:5000`

## Team Documentation

- `FEATURE_OWNERS.md` explains who owns each feature, the scope, and the main files.
- `API_CONTRACT.md` explains endpoint ownership and request/response rules.
- `RUNNING_GUIDE.md` explains how to run the app locally.
- `SHOWTIME_GUIDE.md` explains the Showtime and Seat Selection feature in more detail.
