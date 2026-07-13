# Challenge Requirements Audit

## Implemented mandatory requirements

| Requirement | Implementation | Verification |
| --- | --- | --- |
| React client-server architecture | React frontend calls Express JSON API with cookies | Frontend production build |
| Registration/login/JWT | bcrypt password hashes, HTTP-only JWT cookie, `/api/auth/me` persistence, and `409` duplicate-email response | Auth/Postman tests |
| Role authorization | Conditional Admin nav, frontend route guard, Express `requireAdmin` | Guest `401`, user `403` cases |
| Movie search/filter/pagination | `GET /api/movies` query parameters and pagination metadata | Postman movie data cases |
| Movie/showtime/hall admin CRUD | Protected CRUD routes and Admin UI | Admin CRUD cases |
| Booking ownership | Booking user comes from verified JWT | User A/User B ownership cases |
| Seat conflict prevention | Atomic showtime seat reservation and `409 unavailableSeats` | Two-user booking conflict case |
| My Bookings/cancellation | Owner-scoped data, soft cancellation, released seats | Cancellation and reload case |
| Dashboard/all bookings | `/api/admin/stats` and `/api/admin/bookings` | Admin dashboard/API case |
| Seed readiness | `npm run seed` creates demo users, movies, and showtimes | Seed command |
| API test deliverable | `postman/Cinema-Booking-System.postman_collection.json` | Import into Postman |

## Booking integrity flow

1. The browser sends only `showtimeId` and selected seat labels; it never supplies a booking owner or trusted total price.
2. Express takes the owner from the verified JWT, loads the showtime, validates the seat format, and calculates `selectedSeats × showtime.price`.
3. MongoDB atomically adds the selected seats only when none is already in that show's `bookedSeats` list.
4. A collision returns `409` with `unavailableSeats`; the client removes those selections and reloads the seat map.
5. Cancelling a confirmed booking changes its status to `cancelled` and removes only its seats from that same showtime.

## Bonus features retained

- Mock QRIS payment session
- Ticket QR code, PDF download, and email delivery
- Hall management

## Demo accounts

Run `npm run seed` in `backend/`, then use `SEED_DEMO_PASSWORD` (default: `ChallengePass123!`):

- `admin@beatrix.test` - admin
- `user1@beatrix.test` - user
- `user2@beatrix.test` - user

## Required API reference

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Authenticated |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/movies` | Public |
| GET | `/api/movies/:idOrSlug` | Public |
| GET | `/api/movies/:movieId/showtimes` | Public |
| GET | `/api/showtimes/:id/seats` | Public |
| POST/PUT/DELETE | `/api/movies` and `/api/movies/:idOrSlug` | Admin |
| POST/PUT/DELETE | `/api/showtimes` and `/api/showtimes/:id` | Admin |
| POST | `/api/bookings` | Authenticated |
| GET | `/api/bookings/me` | Authenticated |
| GET/DELETE | `/api/bookings/:id` | Owner/Admin |
| GET | `/api/admin/stats` | Admin |
| GET | `/api/admin/bookings` | Admin |
