# Ask Adit

A Next.js app for a personal collection of travel notes, outdoors thoughts, guides, and quotes. Built for **GitHub Pages** at **askadit.com**. **Admin works everywhere** (including on the live site) via Supabase auth and database.

## Stack

- **Next.js 14** (App Router, static export)
- **Supabase** — Postgres database + auth; content and admin login work on the static site
- **GitHub Actions** — build and deploy to GitHub Pages on every push to `main`

## Setup

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the contents of **`supabase/schema.sql`** (creates `topics` and `quotes` tables, RLS, and seed data).
3. In **Authentication → Users**, add a user (email + password) for admin login.
4. In **Project Settings → API**, copy the **Project URL** and **anon public** key.

### 2. Environment variables

Create **`.env.local`** (for local dev) and add your Supabase keys to the **GitHub repo** (Settings → Secrets and variables → Actions) so the static site can talk to Supabase from the browser:

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key  

For GitHub Pages, these must be available at **build time** so they’re baked into the client bundle. Add them as **repository variables** (or **Actions variables**) and reference them in the deploy workflow when running `npm run build` (e.g. pass them as env to the build step).

### 3. GitHub Actions (build with env)

In **`.github/workflows/deploy.yml`**, ensure the build step has access to the Supabase env vars. For example:

```yaml
- name: Build
  run: npm run build
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ vars.NEXT_PUBLIC_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ vars.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

Add **Settings → Secrets and variables → Actions → Variables**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Local development

```bash
cp .env.example .env.local   # add your Supabase URL and anon key
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in with your Supabase user to use Admin.

## Deploy to askadit.com (GitHub Pages)

1. **Pages source**  
   **Settings → Pages → Build and deployment → Source**: **GitHub Actions**.

2. **Push to `main`**  
   Each push runs the workflow, builds the static export (with Supabase env vars), adds `CNAME` for askadit.com, and deploys. The site is live at **https://askadit.com**.

3. **Admin on the live site**  
   Go to **https://askadit.com/login/** and sign in with your Supabase email/password. The Admin link appears in the nav when logged in; edits are stored in Supabase and show up immediately.

## Scripts

- `npm run dev` — local dev server  
- `npm run build` — static export into `out/`
