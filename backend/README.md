# Beatrix Movie Backend

Express + MongoDB backend for the Beatrix Movie booking system.

The backend handles movie data, showtime schedules, seat locking, booking checkout, Xendit-style QRIS payment simulation, paid ticket generation, ticket PDF generation, and ticket email delivery.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run mongo:ping
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Routes

Movies:

- `GET /api/movies`
- `POST /api/movies`
- `GET /api/movies/:id`
- `GET /api/movies/:movieId/showtimes`

Showtimes:

- `GET /api/showtimes/:id`
- `GET /api/showtimes/:id/seats`
- `POST /api/showtimes`
- `PUT /api/showtimes/:id`
- `DELETE /api/showtimes/:id`

Bookings:

- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/bookings/occupied`
- `POST /api/bookings/checkout`
- `PATCH /api/bookings/:id/mock-paid`
- `POST /api/bookings/:id/email`
- `GET /api/bookings/:id/ticket.pdf`

## Environment

Use `.env.example` as the template. The real `.env` is ignored by git and contains:

- `MONGODB_URI`
- `CLIENT_URL`
- `XENDIT_API_KEY`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` for real email delivery

If SMTP is not configured, the backend uses Nodemailer's Ethereal test SMTP and returns a preview URL.

The current Atlas URI uses the non-SRV Atlas format to avoid DNS SRV lookup issues:

```bash
mongodb://avada:<db_password>@ac-oo7mq6k-shard-00-00.mvool1e.mongodb.net:27017,ac-oo7mq6k-shard-00-01.mvool1e.mongodb.net:27017,ac-oo7mq6k-shard-00-02.mvool1e.mongodb.net:27017/beatrix_movie?ssl=true&replicaSet=atlas-uas4cy-shard-0&authSource=admin&retryWrites=true&w=majority&appName=avada-kadavra
```

## Showtime Request Example

```json
{
  "movieId": "replace-with-movie-object-id",
  "date": "2026-07-10",
  "time": "19:40",
  "studio": "Hall IMAX",
  "price": 40000,
  "bookedSeats": ["A1", "A2"]
}
```

## Booking Flow

```txt
Choose movie and seats
  -> POST /api/bookings/checkout
  -> Backend checks seat conflicts
  -> Backend creates booking with pending payment
  -> Backend creates mock Xendit QRIS payment
  -> Frontend opens payment page
  -> PATCH /api/bookings/:id/mock-paid
  -> Backend marks payment as paid
  -> Backend generates ticket code and QR
  -> User can view ticket, download PDF, or send email
```

## Seat Locking

Seats are considered occupied if they belong to a booking with:

```txt
paymentStatus = pending OR paid
```

This means seats are taken immediately after checkout is created, even before payment is simulated.

## Ticket and Email

When payment is marked as paid:

1. A ticket code is generated.
2. A QR string is generated.
3. `qrcode` creates a real QR image data URL.
4. Ticket data is stored in MongoDB.

PDF tickets are generated with PDFKit on demand.

Emails are sent with Nodemailer. If SMTP is empty, check the `previewUrl` returned from `/api/bookings/:id/email`.
