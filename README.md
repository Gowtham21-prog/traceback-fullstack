# TraceBack — Full Stack

Missing persons & complaint portal. React frontend + Spring Boot/MySQL backend.

```
traceback-fullstack/
├── frontend/     React (Vite) — see frontend/README.md
└── backend/      Spring Boot + MySQL — see backend/README.md
```

## Quick start

**1. Backend** (needs Java 17+, Maven, MySQL running)
```bash
cd backend
cp .env.example .env   # edit with your MySQL credentials, set a real JWT_SECRET
export $(cat .env | xargs)   # or otherwise load .env into your shell
mvn spring-boot:run
```
Comes up on `http://localhost:8080`. Flyway creates tables and `DataSeeder`
seeds demo data on first run. **The app will refuse to start without a
`JWT_SECRET` of at least 32 characters** — see backend/README.md for why,
or run with `--spring.profiles.active=dev` to auto-generate a throwaway one
for local development only.

**2. Frontend** (needs Node 18+)
```bash
cd frontend
npm install
```
Create `frontend/.env`:
```
VITE_API_BASE=http://localhost:8080/api
```
Then in `frontend/src/lib/api.js`, flip:
```js
const USE_MOCK = false;
```
```bash
npm run dev
```
Comes up on `http://localhost:5173`, now talking to the real backend.

## What changed in this pass

Since the last drop, the backend picked up:
- **Pagination** on `GET /api/cases` (`?page=&size=`, backward compatible)
- **Rate limiting** on login/register and case filing (in-memory, per-IP)
- **Flyway migrations** replacing auto-DDL — real versioned SQL schema
- **JWT secret enforcement** — refuses to start with a missing/weak secret
  instead of shipping a hardcoded placeholder
- **Real photo upload endpoint** (`POST /api/uploads/photo`) — the frontend
  now uploads files properly instead of embedding base64 blobs in JSON
- **Real endpoint tests** (register/login flows, case CRUD, auth boundaries,
  pagination shape) — not just a context-load smoke test
- A **filter double-registration bug** introduced during this same pass was
  caught and fixed before shipping (see backend/README.md's project
  structure notes on `JwtAuthFilter`/`RateLimitFilter`)

Full details, reasoning, and what's still open are in `backend/README.md`.

## Important: this has not been compiled or run

I do not have access to Maven Central or a MySQL instance in the environment
I built this in, so **none of the Java code has actually been compiled**,
and the frontend↔backend integration has never been executed end-to-end.
Everything was written and manually reviewed for correctness, but "reviewed"
is not "verified." Your first step should be:

```bash
cd backend
mvn clean test
```

If that passes, you have real confidence the backend compiles and the core
flows work. If it doesn't, the error output will tell us exactly what to
fix next — that's a much faster path than me continuing to review blind.

## Details

Each project has its own README with full setup, architecture notes, and
things to double-check before production — read those for anything beyond
the basics above.
