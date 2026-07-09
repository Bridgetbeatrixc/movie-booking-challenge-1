# Beatrix Movie Frontend

React + Vite frontend for the Beatrix Movie booking UI.

The frontend loads movies from the backend API when available, falls back to local sample data if the API is offline, and sends checkout requests to the backend mock Xendit payment flow.

## Setup

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Environment

Optional:

```bash
VITE_API_URL=http://localhost:5000
```
