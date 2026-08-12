# Express + PostgreSQL Relational Schema API

A REST API built with **Express** and **PostgreSQL**, using **Knex.js** for migrations and seed data, and documented with **Swagger (OpenAPI 3.0)**.

## Schema

One-to-many relational schema:

- **users** (`id`, `name`, `email`, `created_at`, `updated_at`)
- **posts** (`id`, `title`, `body`, `user_id` → FK to `users.id`, `created_at`, `updated_at`)

## Project Structure

```
express-pg-project/
├── migrations/              # SQL schema migrations (Knex)
│   ├── 20260101000000_create_users_table.js
│   └── 20260101000001_create_posts_table.js
├── seeds/                   # Seed data
│   ├── 01_users.js
│   └── 02_posts.js
├── src/
│   ├── routes/
│   │   ├── users.js         # /api/users CRUD + Swagger annotations
│   │   └── posts.js         # /api/posts CRUD + Swagger annotations
│   ├── app.js                # Express app, middleware, route mounting
│   ├── db.js                  # Knex/PostgreSQL connection
│   ├── server.js              # Entry point
│   └── swagger.js             # swagger-jsdoc config
├── knexfile.js                # DB config for migrations/seeds
├── .env.example                # Environment variable template
└── package.json
```

## Prerequisites

- Node.js 18+
- A PostgreSQL database (local install, Docker, or a free hosted DB like [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Render](https://render.com))

## Setup Commands

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd express-pg-project
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `DATABASE_URL` (or the individual `PG*` fields) to point at your PostgreSQL instance.
   If your provider requires SSL (Neon, Supabase, Render, etc.), set `PGSSL=true`.

3. **Run migrations** (creates the `users` and `posts` tables)
   ```bash
   npm run migrate
   ```

4. **Run seed data** (inserts sample users and posts)
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm start
   # or, for auto-reload during development:
   npm run dev
   ```

6. **View the API**
   - Base URL: `http://localhost:3000`
   - Swagger docs: `http://localhost:3000/api-docs`
   - Health check: `http://localhost:3000/health`

## API Endpoints

| Method | Endpoint          | Description                          |
|--------|-------------------|---------------------------------------|
| GET    | /api/users        | List all users                        |
| GET    | /api/users/:id    | Get a user + their posts              |
| POST   | /api/users        | Create a user                         |
| PUT    | /api/users/:id    | Update a user                         |
| DELETE | /api/users/:id    | Delete a user (cascades to posts)     |
| GET    | /api/posts        | List all posts (with author name)     |
| GET    | /api/posts/:id    | Get a single post                     |
| POST   | /api/posts        | Create a post                         |
| PUT    | /api/posts/:id    | Update a post                         |
| DELETE | /api/posts/:id    | Delete a post                         |

Full interactive documentation (request/response schemas, try-it-out) is available at `/api-docs` once the server is running.

## Useful Knex Commands

```bash
npm run migrate            # apply all pending migrations
npm run migrate:rollback   # undo the last migration batch
npm run seed                # re-run all seed files
```

## Deployment Notes

- Set `DATABASE_URL` and `PGSSL=true` as environment variables on your host (Render/Railway/Fly.io/etc.).
- Run `npm run migrate && npm run seed` once against the production database (most hosts let you run a one-off shell command, or run it locally pointed at the production `DATABASE_URL`).
- Start command: `npm start`.
