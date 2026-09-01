# ShibaSolver

A study-help Q&A platform for university students — ask a question, get answers from
classmates, and mark the one that actually solved it.

Built as the term project for **2110423: Team Project**, First Semester, Academic Year 2025,
Department of Computer Engineering, Chulalongkorn University.

**Live demo:** https://shiba-solver.vercel.app  ·  **API:** https://shibasolver.onrender.com  ·  **API docs:** https://shibasolver.onrender.com/api-docs

> The API is hosted on a free tier that sleeps when idle — the first request after a quiet
> period can take up to a minute to wake up. Later requests are fast.

---

## Features

**Questions and answers**
- Post a question with a title, description, image, and topic tags
- Threaded comments with replies
- Mark a comment as the accepted solution; solved questions are flagged in the feed
- Like / dislike on both posts and comments
- Bookmark posts to read later

**Discovery**
- Home feed of recent questions with author, tags, score, and the top-rated answer inline
- Full-text search over posts and users, backed by PostgreSQL trigram indexes
- Filter by one or more tags

**Accounts**
- Sign in with Google (Google Identity Services), sessions held in httpOnly JWT cookies
- Public profiles with bio, education level, interested subjects, and post/comment history
- Profile editing with avatar upload

**Moderation**
- Report posts, comments, or users
- Admin dashboard for the report queue, with accept/reject and an audit log of admin actions
- Ban, unban, and suspend accounts
- Separate admin authentication, rate-limited against brute force

**Other**
- In-app notifications for replies, mentions, and moderation events
- Cookie consent tracking

---

## Tech stack

| | |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, MUI 7, Tailwind CSS 4 |
| **Backend** | Node.js, Express 5, PostgreSQL (`pg`) |
| **Auth** | Google Identity Services, JWT in httpOnly cookies, bcrypt for admin accounts |
| **Security** | Helmet, CORS allowlist, XSS sanitiser, HPP, rate limiting |
| **Media** | Cloudinary (browser-direct unsigned upload) |
| **Docs** | OpenAPI via `swagger-ui-express` |
| **Hosting** | Vercel (frontend) · Render (API) · Neon (PostgreSQL) |

## Architecture

```
  Browser
     │
     ├──────────────► Cloudinary            images upload directly from the
     │                                      browser; the API never sees them
     │
     ├──────────────► Google Identity       returns an ID token
     │                Services
     │
     └──────────────► Next.js (Vercel)
                          │
                          │  fetch(credentials: 'include')
                          ▼
                      Express API (Render)  ── verifies the Google ID token,
                          │                    issues a JWT session cookie
                          ▼
                      PostgreSQL (Neon)
```

The API is stateless — no session store and no local disk — so it scales horizontally and
survives restarts. It does bind a port and needs an always-on host; it is not deployable to
a serverless platform as-is.

---

## Getting started

### Prerequisites

- Node.js 20 or newer
- A PostgreSQL database — [Neon](https://neon.tech) works well and its free tier is enough
- A Google OAuth 2.0 client ID ([Cloud Console](https://console.cloud.google.com/apis/credentials))

### 1. Clone and install

```bash
git clone https://github.com/Zurusfig/ShibaSolver.git
cd ShibaSolver
(cd backend && npm install)
(cd frontend && npm install)
```

### 2. Create the schema

```bash
psql "$DATABASE_URL" -f backend/SQL_command/All_table.sql
```

This creates all 12 tables, the enum types, indexes, and the `pg_trgm` extension used by
search. Verify with `psql "$DATABASE_URL" -c "\dt"`.

### 3. Configure the backend

```bash
cp backend/config/config.env.example backend/config/config.env
```

Note the filename: the server loads `config/config.env`, **not** `.env`. Fill in:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | Postgres connection string, including the database name |
| `JWT_SECRET` | yes | `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `GOOGLE_CLIENT_ID` | yes | Must match the frontend's — it is verified as the token audience |
| `FRONTEND_ORIGIN` | yes | Exact origin, **no trailing slash** — CORS is an exact match |
| `NODE_ENV` | yes | `production` in deployment; gates `Secure` + `SameSite=None` cookies |
| `PORT` | no | Defaults to 5000; leave unset on hosts that inject it |
| `JWT_EXPIRES_IN` | no | Defaults to `7d` |
| `COOKIE_DOMAIN` | no | Leave unset unless the frontend and API share a parent domain |

### 4. Configure the frontend

```bash
cp frontend/.env.example frontend/.env.local
```

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend origin, no trailing slash and no `/api/v1` |
| `NEXT_PUBLIC_BACKEND_URL` | Same value — both are used across the codebase |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Same client ID as the backend |
| `NEXT_PUBLIC_USE_MOCK` | `1` serves mock data instead of calling the API |

`NEXT_PUBLIC_*` values are inlined at build time, so changing one requires a restart
locally and a redeploy in production. Add `http://localhost:3000` to your Google client's
authorised JavaScript origins, or sign-in will be rejected.

### 5. Seed demo data (optional)

```bash
psql "$DATABASE_URL" -f backend/SQL_command/seed.sql
```

Adds six users, ten tags, nine questions with answers and replies, ratings, and bookmarks,
so the feed has something in it. The script is safe to re-run and leaves real accounts alone.

### 6. Create an admin account

There is no admin signup endpoint — the first admin is inserted directly:

```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR_PASSWORD',10))"
psql "$DATABASE_URL" -c "INSERT INTO admins (name,email,password) VALUES ('Admin','you@example.com','PASTE_HASH');"
```

Quote the SQL with single quotes — a bcrypt hash contains `$` sequences that your shell
will otherwise expand.

### 7. Run

```bash
cd backend  && npm run dev    # http://localhost:5000
cd frontend && npm run dev    # http://localhost:3000
```

On macOS, port 5000 is taken by the AirPlay Receiver. Either set `PORT` to something else
(and update both frontend URLs to match) or turn AirPlay Receiver off in System Settings.

---

## API

All routes are under `/api/v1`. Interactive documentation is served at `/api-docs`.

| Resource | Purpose |
|---|---|
| `/auth` | Google sign-in, sign-out, current user |
| `/adminAuth` | Admin login and logout (rate limited) |
| `/users` | Profiles, user posts and comments |
| `/posts` | Create, read, update, delete questions |
| `/feeds` | Home feed with tags, scores, and top comment |
| `/comments` | Threaded comments and replies |
| `/ratings` | Likes and dislikes on posts and comments |
| `/search` | Post and user search (`?query=`, `?tags=`) |
| `/reports` | Submit and review reports |
| `/notifications` | Per-user notification list |
| `/admins` | Admin directory |

## Project structure

```
backend/
  controllers/    request handlers, one per resource
  routers/        route definitions
  middleware/     JWT verification for users and admins
  config/         database pool, environment file
  docs/           OpenAPI specification
  SQL_command/    schema per table, All_table.sql, seed.sql
frontend/
  src/app/        App Router pages
  src/components/ UI, grouped by feature
  src/hooks/      data fetching and state
  src/utils/      helpers, Cloudinary upload
```

## Deployment

The frontend deploys to Vercel with root directory `frontend`; the API deploys to any
always-on Node host (Render is used here) with root directory `backend`, build `npm install`
and start `npm start`. After the first deploy, set `FRONTEND_ORIGIN` on the API to the exact
frontend URL and add that URL to the Google client's authorised origins.

---

## About this fork

The upstream repository is the original coursework, developed by a team of 16 contributors
between August and November 2025. This fork exists to host a public demo and contains the
fixes required to deploy it — schema corrections, environment-driven configuration, and a
seed script.

My contribution to the original project was **153 of 604 commits**, the largest individual
share, concentrated on the frontend: the comment and reply system, user profiles and profile
editing, the moderation report log, and the data-fetching hooks behind them.

## Contributors

Ittichet Thongsang · Pornmongkolnano · ThanaponTh. · Mee1296 · tangenn · noraaamor ·
besttny · Phongsakorn Chimchoeysuwan · SuK014 · Pskn0714 · Meeee · PisitR ·
Thanayot Chalernpornlert

*(as recorded in the commit history)*
