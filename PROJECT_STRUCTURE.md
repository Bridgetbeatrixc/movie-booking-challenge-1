# Project Structure

This repository is split into two application folders:

```text
movie-booking-challenge-1/
|-- backend/   # Express, MongoDB, booking API, ticket/email/PDF services
`-- frontend/  # React + Vite cinema booking UI
```

## Frontend

The frontend uses a route-first React structure:

```text
frontend/src/
|-- app/          # App setup, route selection, top-level composition
|-- pages/        # Route-level screens
|-- features/     # Business/domain code grouped by feature
|   |-- bookings/
|   |   |-- api/
|   |   `-- storage/
|   |-- movies/
|   |   |-- api/
|   |   |-- data/
|   |   `-- hooks/
|   `-- showtimes/
|       |-- api/
|       |-- components/
|       `-- data/
|-- components/   # Generic reusable UI
|-- hooks/        # Generic reusable hooks
|-- services/     # App-wide clients/services
|-- utils/        # Generic helpers
|-- main.jsx
`-- index.css
```

Guidelines:

- Put route screens in `pages`.
- Put movie, booking, payment, ticket, seat, and showtime business code inside the matching `features/<feature>` folder.
- Put reusable generic UI in `components`.
- Keep `services/apiClient.js` generic. Endpoint-specific API calls belong in feature `api` folders.
- Keep imports flowing upward: `pages` compose `features`, and `features` may use shared `components`, `services`, `hooks`, and `utils`.

## Backend

The backend uses a module-first Express structure:

```text
backend/src/
|-- config/    # Database and environment configuration
|-- data/      # Seed/sample data
|-- modules/   # API modules grouped by business area
|   |-- admin/
|   |-- auth/
|   |-- bookings/
|   |-- movies/
|   `-- showtimes/
|-- scripts/   # CLI/dev scripts
|-- shared/    # Cross-module middleware, services, and utilities
`-- server.js
```

Guidelines:

- Keep route/controller/model files inside their owning `modules/<module>` folder.
- Put cross-cutting backend services in `shared/services`.
- Avoid parallel legacy folders such as root-level `controllers`, `models`, `routes`, or generic `services`.
