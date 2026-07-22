# Beatrix Movie: Run and Docker Guide

This runbook covers local development and the Docker Compose stack.

## Architecture

```text
Browser :5173 -> frontend (Nginx :80) -> /api/* -> backend (Express :5000) -> mongo :27017
```

Compose creates three services on a private network: `frontend`, `backend`, and `mongo`. The backend uses the hostname `mongo` for database discovery. MongoDB persists data in the named `mongo-data` volume.

## Run without Docker

Prerequisites: Node.js 20+, npm, and MongoDB locally or Atlas.

In PowerShell, configure and run the backend:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Set `MONGODB_URI` and `JWT_SECRET` in `backend/.env`. The API runs at `http://localhost:5000`.

In a second terminal, run the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

Seed demo data explicitly:

```powershell
cd backend
npm run seed
```

Demo accounts use `SEED_DEMO_PASSWORD` from `.env`:

```text
admin@beatrix.test
user1@beatrix.test
user2@beatrix.test
```

## Run with Docker

Prerequisites:

```powershell
docker --version
docker compose version
docker run hello-world
```

From the repository root:

```powershell
Copy-Item .env.docker.example .env.docker
```

Set at least `JWT_SECRET` in `.env.docker`. OMDb, Xendit, and SMTP variables are optional. Never commit `.env.docker` or real credentials.

Build and start all services:

```powershell
docker compose up -d --build
docker compose ps
```

URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/health`

Seed the Docker database only when needed:

```powershell
docker compose exec backend npm run seed
```

View logs:

```powershell
docker compose logs -f backend
docker compose logs -f mongo
```

Stop containers while preserving data:

```powershell
docker compose down
docker compose up -d
```

Delete the database volume only for a deliberate reset:

```powershell
docker compose down -v
```

## Docker setup explained

### Backend

`backend/Dockerfile` uses Node 20 Alpine, copies package manifests first for build caching, installs production dependencies with `npm ci --omit=dev`, and starts `src/server.js` on port 5000. The API listens on `0.0.0.0` and retries MongoDB while the database is becoming ready.

### Frontend

`frontend/Dockerfile` builds React/Vite in a Node stage and serves `dist` from Nginx. `frontend/nginx.conf` provides SPA fallback routing and proxies `/api/` to `http://backend:5000`, keeping API calls same-origin for HTTP-only cookies.

### Compose networking and storage

`docker-compose.yml` maps host port 5173 to Nginx port 80 and host port 5000 to Express port 5000. Services communicate through `beatrix-net`. MongoDB is reached as `mongodb://mongo:27017/beatrix_movie`; `localhost` inside the backend container would be incorrect. The `mongo-data` volume survives `docker compose down`.

## Troubleshooting

- **Docker unavailable:** start Docker Desktop and verify `docker info`.
- **Port in use:** stop the process using 5173/5000 or change the host-side mapping.
- **Login fails:** set a non-empty `JWT_SECRET`, then recreate the backend.
- **Mongo still starting:** inspect `docker compose logs -f backend mongo`; retry is automatic.
- **No movies:** run `docker compose exec backend npm run seed`.

## Verification checklist

1. `docker compose config` passes.
2. `docker compose ps` shows all services running.
3. `/health` reports `database: connected`.
4. Frontend loads on port 5173.
5. Login, movies, showtimes, booking, conflicts, and cancellation work.
6. Data remains after `docker compose down` and `docker compose up -d`.


## Direct container testing from Windows Command Prompt

Run these commands from the repository root in cmd.exe.

### Validate and start

~~~cmd
docker compose config
docker --version
docker compose version
docker info
docker compose up -d --build
docker compose ps
docker ps
~~~

Expected containers: frontend mapped to 5173, backend mapped to 5000, and mongo running on the private Compose network.

If one is stopped:

~~~cmd
docker compose ps -a
docker compose logs backend
docker compose logs frontend
docker compose logs mongo
~~~

### Test MongoDB directly

Open the Mongo shell inside the database container:

~~~cmd
docker compose exec mongo mongosh
~~~

At the mongosh prompt:

~~~javascript
db.adminCommand({ ping: 1 })
show dbs
use beatrix_movie
show collections
db.movies.countDocuments()
db.showtimes.countDocuments()
db.halls.countDocuments()
db.bookings.countDocuments()
exit
~~~

One-line ping:

~~~cmd
docker compose exec mongo mongosh --quiet --eval "db.adminCommand({ ping: 1 })"
~~~

Inspect the persistent volume:

~~~cmd
docker volume ls
docker volume inspect movie-booking-challenge-1_mongo-data
~~~

After seeding, prove data survives container recreation:

~~~cmd
docker compose down
docker compose up -d
docker compose exec mongo mongosh beatrix_movie --quiet --eval "db.movies.countDocuments()"
~~~

Do not use docker compose down -v for this test because -v deletes the volume.

### Test the backend directly

Inspect logs:

~~~cmd
docker compose logs --tail=100 backend
~~~

Test host endpoints:

~~~cmd
curl.exe -i http://localhost:5000/
curl.exe -i http://localhost:5000/health
curl.exe -i http://localhost:5000/api/movies
~~~

Expected results: root 200, health 200 with database connected, and movies 200 with JSON data.

Test from inside the backend container:

~~~cmd
docker compose exec backend node -e "fetch('http://localhost:5000/health').then(async r => console.log(r.status, await r.text()))"
~~~

Test backend-to-Mongo DNS:

~~~cmd
docker compose exec backend node -e "import('mongoose').then(async ({default:m}) => { await m.connect('mongodb://mongo:27017/beatrix_movie'); console.log('mongo DNS and connection OK'); await m.disconnect(); })"
~~~

### Test the frontend and Nginx proxy

~~~cmd
docker compose logs --tail=100 frontend
curl.exe -i http://localhost:5173/
curl.exe -i http://localhost:5173/api/movies
curl.exe -i http://localhost:5173/admin
~~~

The first and third requests should return React HTML. The API request should return the same movie JSON as port 5000.

Validate Nginx configuration:

~~~cmd
docker compose exec frontend nginx -t
docker compose exec frontend cat /etc/nginx/conf.d/default.conf
~~~

### Test authentication cookies

Register a temporary user:

~~~cmd
curl.exe -i -c cookies.txt -H "Content-Type: application/json" -d "{\"name\":\"Docker Tester\",\"email\":\"docker-tester@example.test\",\"password\":\"ChallengePass123!\",\"confirmPassword\":\"ChallengePass123!\"}" http://localhost:5000/api/auth/register
~~~

Log in and save the HTTP-only cookie:

~~~cmd
curl.exe -i -c cookies.txt -b cookies.txt -H "Content-Type: application/json" -d "{\"email\":\"docker-tester@example.test\",\"password\":\"ChallengePass123!\"}" http://localhost:5000/api/auth/login
~~~

Check the current user and then log out:

~~~cmd
curl.exe -i -b cookies.txt http://localhost:5000/api/auth/me
curl.exe -i -b cookies.txt -c cookies.txt -X POST http://localhost:5000/api/auth/logout
curl.exe -i -b cookies.txt http://localhost:5000/api/auth/me
~~~

The final request should return HTTP 401.

### Seed and test recovery

~~~cmd
docker compose exec backend npm run seed
docker compose exec mongo mongosh beatrix_movie --quiet --eval "db.movies.countDocuments()"
docker compose exec mongo mongosh beatrix_movie --quiet --eval "db.showtimes.countDocuments()"
docker compose restart mongo
docker compose logs -f backend
docker compose restart backend
curl.exe -i http://localhost:5000/health
docker compose restart frontend
curl.exe -i http://localhost:5173/
~~~

The backend should retry MongoDB during a database restart, and the health endpoint should return connected after recovery.

### End-to-end booking test

1. Open http://localhost:5173.
2. Log in as user1@beatrix.test.
3. Select a movie, showtime, and available seats.
4. Confirm the booking and open My Bookings.
5. Cancel it and verify the seats are released.
6. With user2@beatrix.test, attempt a seat already booked for the same showtime.
7. Confirm the API returns HTTP 409 and an unavailableSeats list.

Watch requests while testing:

~~~cmd
docker compose logs -f backend
~~~

### Cleanup

~~~cmd
docker compose down
~~~

This preserves MongoDB data. To intentionally delete the database:

~~~cmd
docker compose down -v
~~~

Avoid docker system prune -a during development because it removes unrelated images and caches.

