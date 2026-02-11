# Ask Adit

A Next.js app for a personal collection of travel notes, outdoors thoughts, guides, and quotes.

## Stack

- **Next.js 14** (App Router)
- **SQLite** (via `better-sqlite3`) for server-side storage
- **API routes** for topics and quotes; admin routes protected by cookie auth

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment (optional)

- `ADMIN_USERNAME` – admin login username (default: `ahattikudur`)
- `ADMIN_PASSWORD` – admin login password (default: `test123`)

Create `.env.local` with these for production.

## Data

- SQLite file is created at `data/askadit.db` on first run.
- Default topics (countries, outdoors, guides) and quotes are seeded automatically when the database is empty.

## Scripts

- `npm run dev` – development server
- `npm run build` – production build
- `npm start` – run production server

## Deploy

You can deploy to Vercel, Railway, or any Node host. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in the environment. For SQLite to persist on serverless platforms you may need a file-based storage adapter or switch to a hosted database (e.g. Turso, PlanetScale).
