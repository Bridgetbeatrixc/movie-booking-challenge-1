# Running Guide

Use this guide to run the project locally.

## 1. Install Dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd backend
npm install
```

## 2. Configure Backend Environment

Create `backend/.env` from `backend/.env.example`.

```bash
cd backend
cp .env.example .env
```

Set `MONGODB_URI` inside `.env`.

Example:

```txt
MONGODB_URI=mongodb://127.0.0.1:27017/movie-booking
PORT=5000
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174
```

## 3. Run Backend

```bash
cd backend
npm run dev
```

Default backend URL:

```txt
http://localhost:5000
```

## 4. Run Frontend

```bash
cd frontend
npm run dev
```

Default frontend URL:

```txt
http://localhost:5173
```

If port `5173` is busy, Vite may use another port such as `5174`.

## 5. Seed Challenge Data

Seed data is optional but recommended before demoing the movie and showtime flow.

```bash
cd backend
npm run seed
```

If `OMDB_API_KEY` is available, the seed script imports movie catalog data from OMDb. If it is not available, the script still works by using local sample movies, then creates halls, stable showtimes, and demo accounts. `SEED_BASE_DATE` can be used to control the deterministic showtime calendar.

## 6. Current Demo Flow

- Open the frontend.
- Pick a movie.
- Use search, genre, status, or sort filters if needed.
- Click `Choose seats`.
- Pick a showtime loaded from MongoDB when available.
- Select available seats from the latest seat availability.
- Review the showtime booking summary.

Movie and showtime data are loaded from the backend API. Run `npm run seed` in the backend if the movie list or showtime list is empty.

## 7. Team Workflow

- Work in your own branch.
- Keep feature code inside your feature folder or module.
- Update `FEATURE_OWNERS.md` and `API_CONTRACT.md` when your scope changes.
- Run `npm run build` in `frontend` before pushing frontend changes.
- Run a backend syntax or smoke check before pushing backend changes.
