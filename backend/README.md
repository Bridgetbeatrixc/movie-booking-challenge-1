# Beatrix Movie Backend

Express + MongoDB backend for the Beatrix Movie booking system.

The backend handles movie data, seat locking, booking checkout, Xendit-style QRIS payment simulation, paid ticket generation, ticket PDF generation, and ticket email delivery.

## Tech Stack

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Nodemailer for email delivery
- QRCode for ticket QR image generation
- PDFKit for PDF ticket generation

## Project Structure

```txt
backend/
  src/
    config/
      db.js
    data/
      sampleMovies.js
    models/
      Booking.js
      Movie.js
    routes/
      bookings.js
      movies.js
    scripts/
      pingMongo.js
    services/
      seedMovies.js
      ticketService.js
      xenditMock.js
    server.js
  .env.example
  package.json
```

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
```

Starts the API with Node watch mode.

```bash
npm start
```

Starts the API normally.

```bash
npm run mongo:ping
```

Tests the MongoDB connection with a ping command.

## Environment Variables

Create `backend/.env` from `.env.example`.

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

### MongoDB

The backend currently uses the non-SRV Atlas URI format because some networks block `mongodb+srv` DNS SRV lookup.

If your password is `avada123`, your URI should look like:

```env
MONGODB_URI=mongodb://avada:avada123@ac-oo7mq6k-shard-00-00.mvool1e.mongodb.net:27017,ac-oo7mq6k-shard-00-01.mvool1e.mongodb.net:27017,ac-oo7mq6k-shard-00-02.mvool1e.mongodb.net:27017/beatrix_movie?ssl=true&replicaSet=atlas-uas4cy-shard-0&authSource=admin&retryWrites=true&w=majority&appName=avada-kadavra
```

### Email

For real email delivery, configure SMTP:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM="Beatrix Movie" <your_email@gmail.com>
```

If SMTP variables are empty, the backend uses Nodemailer's Ethereal test SMTP. In that mode, email is still generated and sent to a test mailbox, and the API returns a `previewUrl`.

## Startup Behavior

When the server starts:

1. Loads environment variables.
2. Connects to MongoDB.
3. Pings MongoDB to verify the connection.
4. Seeds sample movies if the movie collection is empty.
5. Starts the Express API.

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

If another user tries to book the same seat for the same movie, cinema, and showtime, the backend returns:

```json
{
  "message": "One or more selected seats are already booked. Please choose another seat."
}
```

## API Routes

### Health Check

```http
GET /
```

Response:

```json
{
  "message": "Beatrix Movie API is running"
}
```

## Movies

### Get Movies

```http
GET /api/movies
```

Returns all movies sorted by status and year.

Example response:

```json
[
  {
    "_id": "movie_id",
    "title": "Arrival",
    "shortTitle": "Arrival",
    "slug": "arrival",
    "poster": "/assets/arrival.png",
    "genres": ["Sci-Fi", "Drama"],
    "runtime": "1h 56m",
    "rating": 7.9,
    "year": 2016,
    "status": "showing",
    "price": 35000
  }
]
```

### Get Movie by ID

```http
GET /api/movies/:id
```

### Create Movie

```http
POST /api/movies
Content-Type: application/json
```

Example request:

```json
{
  "title": "New Movie",
  "shortTitle": "New Movie",
  "slug": "new-movie",
  "poster": "/assets/new-movie.png",
  "genres": ["Action"],
  "runtime": "1h 45m",
  "rating": 8.1,
  "year": 2026,
  "status": "showing",
  "price": 35000
}
```

## Bookings

### Get Bookings

```http
GET /api/bookings
```

Returns bookings sorted by newest first.

### Get Occupied Seats

```http
GET /api/bookings/occupied?movieId=<movie_id>&cinema=Beatrix%20Movieplex%20-%20Central%20World&showtime=2026-06-21T13:30:00.000Z
```

Response:

```json
{
  "occupiedSeats": ["A1", "A2", "C5"]
}
```

### Create Raw Booking

```http
POST /api/bookings
```

This route creates a booking directly. The normal frontend flow should use `/checkout`.

### Checkout Booking

```http
POST /api/bookings/checkout
Content-Type: application/json
```

Example request:

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

What it does:

1. Validates selected seats.
2. Checks if seats are already taken.
3. Creates a booking with `paymentStatus: "pending"`.
4. Creates a mock Xendit QRIS invoice.
5. Returns booking and payment data.

Example response:

```json
{
  "booking": {
    "_id": "booking_id",
    "movieTitle": "Arrival",
    "moviePoster": "/assets/arrival.png",
    "cinema": "Beatrix Movieplex - Central World",
    "showtime": "2026-06-21T13:30:00.000Z",
    "seats": ["B8", "C8"],
    "totalPrice": 70000,
    "paymentStatus": "pending"
  },
  "payment": {
    "externalId": "booking-booking_id-123456789",
    "invoiceId": "xnd_mock_abc123",
    "invoiceUrl": "http://localhost:5173/#payment",
    "paymentMethod": "QRIS",
    "qrString": "BEATRIX-XENDIT-QRIS-MOCK",
    "amount": 70000,
    "status": "PENDING",
    "apiKeyMode": "development"
  }
}
```

### Simulate Payment Success

```http
PATCH /api/bookings/:id/mock-paid
```

What it does:

1. Marks booking payment as paid.
2. Updates payment status to `PAID`.
3. Generates ticket code.
4. Generates QR image data URL.

Example response:

```json
{
  "_id": "booking_id",
  "paymentStatus": "paid",
  "ticket": {
    "ticketCode": "BM-701D78-5A11",
    "qrString": "BEATRIX-TICKET|BM-701D78-5A11|Arrival|B8,C8",
    "qrImageDataUrl": "data:image/png;base64,...",
    "issuedAt": "2026-07-09T00:00:00.000Z"
  }
}
```

### Send Ticket Email

```http
POST /api/bookings/:id/email
Content-Type: application/json
```

Example request:

```json
{
  "email": "guest@example.com"
}
```

What it does:

1. Requires booking to be paid.
2. Ensures ticket exists.
3. Generates ticket PDF.
4. Sends email through configured SMTP or Ethereal test SMTP.
5. Attaches PDF ticket and QR image.

Example response:

```json
{
  "message": "Ticket email sent to guest@example.com",
  "previewUrl": "https://ethereal.email/message/...",
  "messageId": "<message-id>",
  "booking": {
    "_id": "booking_id",
    "ticket": {
      "emailSent": true,
      "emailTo": "guest@example.com"
    }
  }
}
```

Alias:

```http
POST /api/bookings/:id/mock-email
```

### Download Ticket PDF

```http
GET /api/bookings/:id/ticket.pdf
```

Requirements:

- Booking must exist.
- Booking must be paid.

Response:

```txt
Content-Type: application/pdf
Content-Disposition: attachment; filename="beatrix-ticket-BM-XXXXXX.pdf"
```

## Models

### Movie

Fields:

- `title`
- `shortTitle`
- `slug`
- `poster`
- `genres`
- `runtime`
- `rating`
- `year`
- `status`: `showing`, `coming-soon`, `advance-sale`
- `releaseDate`
- `price`

### Booking

Fields:

- `movie`
- `movieTitle`
- `moviePoster`
- `cinema`
- `showtime`
- `seats`
- `totalPrice`
- `paymentStatus`: `pending`, `paid`, `expired`, `failed`
- `paymentProvider`
- `payment`
- `ticket`

## Xendit Simulation

The app does not create a real Xendit charge. It creates a Xendit-style mock QRIS object:

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

## Ticket Generation

When payment is marked as paid:

1. A ticket code is generated.
2. A QR string is generated.
3. `qrcode` creates a real QR image data URL.
4. Ticket data is stored in MongoDB.

PDF tickets are generated with PDFKit on demand.

Emails are sent with Nodemailer.

## Troubleshooting

### MongoDB `querySrv ECONNREFUSED`

Use the non-SRV URI from `.env.example` instead of `mongodb+srv://`.

### MongoDB Network Access

In MongoDB Atlas:

1. Go to Network Access.
2. Add your current IP address.
3. For development only, you can temporarily allow `0.0.0.0/0`.

### Email does not arrive

Check:

- SMTP credentials are correct.
- Gmail requires an app password, not your normal password.
- `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are set.

If SMTP is empty, check the `previewUrl` returned from `/api/bookings/:id/email`.

### Seats still look available

Occupied seats only include bookings with:

```txt
paymentStatus = pending OR paid
```

Make sure checkout was created successfully and the frontend is calling:

```http
GET /api/bookings/occupied
```

## Development Notes

- Keep real credentials in `.env`.
- Do not commit `.env`.
- `.env.example` should contain placeholders only.
- The frontend default API URL is `http://localhost:5000`.
