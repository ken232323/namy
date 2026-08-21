# NAMY Backend

A small Express API that stores workshops, news, stats, and seminars in a
JSON file (`data/db.json`) — no database server to install. Protects writes
with a simple admin login (JWT).

## Setup

```bash
npm install
cp .env.example .env
```

Open `.env` and set `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` to
your own values.

```bash
npm run seed   # populates starter data (safe to run once)
npm run dev    # starts the server on http://localhost:4000
```

## Endpoints

Each of `workshops`, `news`, `stats`, `seminars` supports:

| Method | Path                  | Auth required |
|--------|-----------------------|---------------|
| GET    | `/api/<resource>`     | No            |
| GET    | `/api/<resource>/:id` | No            |
| POST   | `/api/<resource>`     | Yes           |
| PUT    | `/api/<resource>/:id` | Yes           |
| DELETE | `/api/<resource>/:id` | Yes           |

`POST /api/auth/login` with `{ "username": "...", "password": "..." }`
returns `{ "token": "..." }`. Send it as `Authorization: Bearer <token>`
on write requests.

## Security note

This is set up for local development and small deployments. Before putting
it on the public internet: run it behind HTTPS, and consider swapping the
plain-text `.env` password check in `routes/auth.js` for a hashed password
(e.g. with `bcryptjs`).

## Swapping in a real database later

Everything reads/writes through the five functions in `db.js`
(`getAll`, `getById`, `create`, `update`, `remove`). To move to Postgres,
MongoDB, etc., you only need to rewrite that one file — every route stays
the same.
