# Beatrix Movie Backend

Express + MongoDB backend for the Beatrix Movie booking system.

The backend supports:

- movie catalogue APIs
- showtime schedule APIs
- seat availability APIs
- booking checkout
- seat locking
- Xendit-style QRIS payment simulation
- paid ticket generation
- QR ticket generation
- PDF ticket download
- ticket email delivery with Nodemailer

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run mongo:ping
npm run dev
```

The API runs on:

```txt
http://localhost:5000
```

## Scripts

```bash
npm run dev
npm start
npm run mongo:ping
```

## Environment Variables

Use `.env.example` as the template.

```env
PORT=5000
MONGODB_URI=mongodb://avada:<db_password>@ac-oo7mq6k-shard-00-00.mvool1e.mongodb.net:27017,ac-oo7mq6k-shard-00-01.mvool1e.mongodb.net:27017,ac-oo7mq6k-shard-00-02.mvool1e.mongodb.net:27017/beatrix_movie?ssl=true&replicaSet=atlas-uas4cy-shard-0&authSource=admin&retryWrites=true&w=majority&appName=avada-kadavra
CLIENT_URL=http://localhost:5173
XENDIT_API_KEY=xnd_development_your_sandbox_key

MAIL_FROM="Beatrix Movie" <tickets@beatrixmovie.test>
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
```

If SMTP is not configured, the backend uses Nodemailer Ethereal test SMTP and returns a preview URL.

## Startup Behavior

When the API starts:

1. Loads environment variables.
2. Connects to MongoDB.
3. Pings MongoDB.
4. Seeds sample movies if the collection is empty.
5. Starts Express.

## Routes

### Health

```http
GET /
```

### Movies

```http
GET /api/movies
GET /api/movies/:id
GET /api/movies/:movieId/showtimes
POST /api/movies
```

### Showtimes

```http
GET /api/showtimes/:id
GET /api/showtimes/:id/seats
POST /api/showtimes
PUT /api/showtimes/:id
DELETE /api/showtimes/:id
```

Create/update showtime body:

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

### Bookings

```http
GET /api/bookings
GET /api/bookings/occupied
POST /api/bookings
POST /api/bookings/checkout
PATCH /api/bookings/:id/mock-paid
POST /api/bookings/:id/email
POST /api/bookings/:id/mock-email
GET /api/bookings/:id/ticket.pdf
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

## Checkout Request

```http
POST /api/bookings/checkout
Content-Type: application/json
```

```json
{
  "movieId": "movie_id",
  "movieTitle": "Arrival",
  "moviePoster": "/assets/arrival.png",
  "cinema": "Beatrix Movieplex - Central World",
  "showtime": "2026-06-21T13:30:00.000Z",
  "seats": ["B8", "C8"]
}
```

## Seat Locking

Seats are treated as occupied if they belong to a booking with:

```txt
paymentStatus = pending OR paid
```

If selected seats are already taken, checkout returns `409`.

## Ticket Email

```http
POST /api/bookings/:id/email
Content-Type: application/json
```

```json
{
  "email": "guest@example.com"
}
```

The backend sends an email with:

- ticket PDF attachment
- QR image attachment
- ticket information in HTML

If SMTP is empty, the response includes an Ethereal `previewUrl`.

## Ticket PDF

```http
GET /api/bookings/:id/ticket.pdf
```

The booking must be paid before a PDF can be downloaded.

## Xendit Simulation

The app does not create a real Xendit charge. It creates a Xendit-style mock QRIS object with:

- `externalId`
- `invoiceId`
- `invoiceUrl`
- `paymentMethod: "QRIS"`
- `qrString`
- `qrExpiresAt`
- `amount`
- `status`
- `apiKeyMode`

Payment success is simulated with:

```http
PATCH /api/bookings/:id/mock-paid
```

## Troubleshooting

### MongoDB `querySrv ECONNREFUSED`

Use the non-SRV URI from `.env.example` instead of `mongodb+srv://`.

### Email does not arrive

Check SMTP settings. For Gmail, use an app password. If SMTP is blank, use the returned Ethereal `previewUrl`.

### Seats still look available

Verify checkout was created successfully and the frontend is calling:

```http
GET /api/bookings/occupied
```
