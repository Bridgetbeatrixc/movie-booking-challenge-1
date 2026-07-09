# Beatrix Movie Backend

Express + MongoDB backend for the movie booking app.

It connects to MongoDB Atlas, seeds the sample movie catalogue when the database is empty, saves bookings, and creates a sandbox-style Xendit mock invoice for checkout.

## Setup

```bash
cp .env.example .env
npm install
npm run mongo:ping
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Routes

- `GET /api/movies`
- `POST /api/movies`
- `GET /api/bookings`
- `POST /api/bookings`
- `POST /api/bookings/checkout`
- `PATCH /api/bookings/:id/mock-paid`

## Environment

Use `.env.example` as the template. The real `.env` is ignored by git and contains:

- `MONGODB_URI`
- `CLIENT_URL`
- `XENDIT_API_KEY`

The current Atlas URI uses the non-SRV Atlas format to avoid DNS SRV lookup issues:

```bash
mongodb://avada:<db_password>@ac-oo7mq6k-shard-00-00.mvool1e.mongodb.net:27017,ac-oo7mq6k-shard-00-01.mvool1e.mongodb.net:27017,ac-oo7mq6k-shard-00-02.mvool1e.mongodb.net:27017/beatrix_movie?ssl=true&replicaSet=atlas-uas4cy-shard-0&authSource=admin&retryWrites=true&w=majority&appName=avada-kadavra
```
