# Feature Owners

Dokumen ini dipakai untuk menjelaskan pembagian kerja 5 anggota tim. Tujuannya agar reviewer bisa melihat siapa mengerjakan fitur apa, file mana yang menjadi tanggung jawabnya, dan titik integrasi antar fitur.

## Ringkasan Owner

| No | Fitur | Owner | Fokus Utama |
| --- | --- | --- | --- |
| 1 | Authentication and Security | Isi nama anggota 1 | Register, login, JWT, protected route, role access |
| 2 | Movie Catalogue | Isi nama anggota 2 | Movie list, movie detail, search, filter, pagination |
| 3 | Showtime and Seat Selection | Isi nama kamu | Showtime list, seat map, seat availability, booking summary |
| 4 | Booking System | Isi nama anggota 4 | Create booking, booking history, cancel booking, conflict handling |
| 5 | Administration | Isi nama anggota 5 | Dashboard, manage movies, manage showtimes, all bookings |

## 1. Authentication and Security

Owner: `Isi nama anggota 1`

Scope:

- Valid registration.
- Duplicate email rejection.
- Invalid email format.
- Missing email or password.
- Password confirmation mismatch.
- Password hash must not leak in API response.
- Admin role injection prevention.
- Valid login.
- Wrong password rejection.
- Unknown account rejection.
- NoSQL operator injection safety.
- Optional normal user access rejection for admin-only endpoint.
- Optional login rate-limit observation.
- Logout and access after logout.

Suggested frontend files:

- `frontend/src/features/auth`
- `frontend/src/features/auth/pages`
- `frontend/src/features/auth/components`
- `frontend/src/features/auth/services`

Current backend files:

- `backend/src/modules/auth/auth.model.js`
- `backend/src/modules/auth/auth.controller.js`
- `backend/src/modules/auth/auth.routes.js`
- `backend/src/modules/auth/auth.middleware.js`

Integration points:

- Provides authenticated user identity for Booking System.
- Provides admin role checking for Administration.

## 2. Movie Catalogue

Owner: `Isi nama anggota 2`

Scope:

- Movie list page.
- Movie card.
- Search and genre filter.
- Pagination.
- Movie detail page.
- Movie API used by public pages and admin.

Current frontend files:

- `frontend/src/features/movies`
- `frontend/src/features/movies/pages/HomePage.jsx`
- `frontend/src/features/movies/data/movies.js`

Current backend files:

- `backend/src/modules/movies/movie.model.js`
- `backend/src/modules/movies/movie.routes.js`

Integration points:

- Movie Detail needs showtimes from Showtime and Seat Selection.
- Admin Manage Movies depends on movie CRUD.

## 3. Showtime and Seat Selection

Owner: `Isi nama kamu`

Scope:

- Showtime list per movie.
- Showtime detail.
- Seat map with available, selected, and booked states.
- Latest seat availability.
- Booking summary before final confirmation.

Current frontend files:

- `frontend/src/features/showtimes/pages/SeatSelectionPage.jsx`
- `frontend/src/features/showtimes/components/ShowtimeList.jsx`
- `frontend/src/features/showtimes/components/SeatGrid.jsx`
- `frontend/src/features/showtimes/components/SeatLegend.jsx`
- `frontend/src/features/showtimes/components/BookingSummary.jsx`
- `frontend/src/features/showtimes/services/showtimeApi.js`
- `frontend/src/features/showtimes/data/showtimes.js`

Current backend files:

- `backend/src/modules/showtimes/showtime.model.js`
- `backend/src/modules/showtimes/showtime.controller.js`
- `backend/src/modules/showtimes/showtime.routes.js`
- `backend/src/modules/showtimes/seatValidation.js`
- `backend/src/modules/movies/movie.routes.js`

API endpoints:

- `GET /api/movies/:movieId/showtimes`
- `GET /api/showtimes/:id`
- `GET /api/showtimes/:id/seats`
- `POST /api/showtimes`
- `PUT /api/showtimes/:id`
- `DELETE /api/showtimes/:id`

Integration points:

- Uses movie data from Movie Catalogue.
- Provides selected showtime and seats to Booking System.
- Provides showtime CRUD endpoint for Administration.

## 4. Booking System

Owner: `Isi nama anggota 4`

Scope:

- Create booking.
- My bookings.
- Booking detail.
- Cancel booking.
- Double-booking prevention.
- Conflict response with unavailable seats.
- Seat release after cancellation.

Suggested frontend files:

Current frontend folder:

- `frontend/src/features/bookings`

Current or suggested backend files:

- `backend/src/modules/bookings/booking.model.js`
- `backend/src/modules/bookings/booking.controller.js`
- `backend/src/modules/bookings/booking.routes.js`

Integration points:

- Uses authenticated user identity from Authentication and Security.
- Uses showtime and seat validation from Showtime and Seat Selection.
- Provides populated booking data for Administration.

## 5. Administration

Owner: `Isi nama anggota 5`

Scope:

- Admin dashboard.
- Manage movies.
- Manage showtimes.
- View all bookings.
- Admin-only route protection.

Suggested frontend files:

Current frontend folder:

- `frontend/src/features/admin`

Current backend files:

- `backend/src/modules/admin/admin.controller.js`
- `backend/src/modules/admin/admin.routes.js`
- Reuses movie, showtime, and booking modules.

Integration points:

- Uses role checking from Authentication and Security.
- Uses movie CRUD from Movie Catalogue.
- Uses showtime CRUD from Showtime and Seat Selection.
- Uses booking query from Booking System.

## Naming and Folder Rules

- Keep shared logic in `shared`, `utils`, or `services`.
- Avoid putting all features into one large `App.jsx`.
- Each feature should have a small `README.md` when the feature becomes large.
- Before editing another owner's file, coordinate in the pull request or group chat.
- PR description should mention the owner, changed files, endpoint changes, and test result.
- Update `API_CONTRACT.md` when an endpoint changes.
- Update `RUNNING_GUIDE.md` when setup or run commands change.
