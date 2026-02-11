# Ask Adit

A Next.js app for a personal collection of travel notes, outdoors thoughts, guides, and quotes. Built for **GitHub Pages** at **askadit.com**.

## Stack

- **Next.js 14** (App Router, static export)
- **SQLite** (via `better-sqlite3`) at build time — content is baked into the static site
- **GitHub Actions** — build and deploy to GitHub Pages on every push to `main`

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin and login work locally (with API routes); to get them back for local use you’d need to restore the API routes and run a Node server.

## Deploy to askadit.com (GitHub Pages)

1. **Use GitHub Actions for Pages**  
   In the repo: **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.

2. **Push to `main`**  
   Each push to `main` runs the workflow: it builds the static export, adds `CNAME` for askadit.com, and deploys to GitHub Pages. With DNS already pointing to GitHub Pages, the site will be live at **https://askadit.com**.

Content is generated at build time from the seeded SQLite data. To change content, update the seed in `lib/db.ts` (or add a build step that reads from another source) and push; the next run will publish the new content.

## Scripts

- `npm run dev` — local dev server (no static export)
- `npm run build` — static export into `out/`
- `npm start` — not used for Pages; use the workflow deploy instead

## Note on admin

The Admin and Login pages are included in the static export but **do not work on GitHub Pages** (no backend). They are only functional when running the app locally with a server and API (e.g. `npm run dev` with API routes restored).
