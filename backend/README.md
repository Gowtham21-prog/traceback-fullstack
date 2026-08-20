# TraceBack Backend — Spring Boot + MySQL

REST API for the TraceBack missing-persons / complaint portal. Built to match
the API contract defined in the React frontend's `src/lib/api.js`.

## Requirements

- Java 17+
- Maven 3.8+
- MySQL 8+ running locally (or reachable via env vars)

## Setup

1. **Create a database** (or let the app create it):
   ```sql
   CREATE DATABASE tracebackdb;
   ```
   `createDatabaseIfNotExist=true` is set in the JDBC URL, so the app will
   create it automatically on first run if your MySQL user has permission.
   Schema itself (tables, indexes) is created by **Flyway** migrations in
   `src/main/resources/db/migration` — not by Hibernate. See "Schema &
   migrations" below.

2. **Set a JWT secret.** The app will refuse to start without one — see
   "JWT secret" below for why and how.

3. **Set the rest of the environment variables** (or edit
   `application.properties` directly):
   ```bash
   export DB_HOST=localhost
   export DB_PORT=3306
   export DB_NAME=tracebackdb
   export DB_USER=root
   export DB_PASSWORD=yourpassword
   export JWT_SECRET=some-long-random-string-at-least-32-characters
   export CORS_ORIGINS=http://localhost:5173
   ```

4. **Run it:**
   ```bash
   mvn spring-boot:run
   ```
   Or build a jar:
   ```bash
   mvn clean package
   java -jar target/traceback-backend-1.0.0.jar
   ```

The API comes up on `http://localhost:8080`. On first boot, `DataSeeder`
populates 5 demo cases and two demo accounts:

| Role | Email | Password |
|---|---|---|
| Police | `police@traceback.demo` | `police123` |
| Reporter | `reporter@traceback.demo` | `reporter123` |

Delete `src/main/java/com/traceback/config/DataSeeder.java` once you have
real data and don't want demo rows anymore.

## JWT secret

`app.jwt.secret` has **no default value**. On startup,
`JwtSecretEnvironmentPostProcessor` checks it before any bean is created:

- **Missing or under 32 characters** → the app refuses to start, with an
  error telling you to set `JWT_SECRET`.
- **Running with `--spring.profiles.active=dev`** (or
  `SPRING_PROFILES_ACTIVE=dev`) → a random secret is generated in memory
  for that process only. Convenient for local development; tokens won't
  survive a restart, and this must never be used outside local dev.

This replaces an earlier version of this file that shipped a hardcoded
placeholder secret in `application.properties` — anyone who read the
source could have forged valid tokens against it. Generate a real secret
for anything beyond your own laptop, e.g.:
```bash
openssl rand -base64 48
```

## Schema & migrations

Table creation is owned by **Flyway**, not Hibernate. Migrations live in
`src/main/resources/db/migration/`:

- `V1__init_schema.sql` — `users` and `cases` tables
- `V2__add_indexes.sql` — indexes on the columns the frontend actually
  filters/searches on (`status`, `case_type`, `created_at`, `full_name`,
  `last_seen_location`)

`spring.jpa.hibernate.ddl-auto=validate` means Hibernate checks the JPA
entities match what Flyway created and **fails fast on drift** instead of
silently altering your production tables.

**To make a schema change:** add a new `V3__description.sql` file (never
edit an already-applied migration) and update the matching JPA entity.
Flyway applies new migrations automatically on the next startup.

## Rate limiting

`RateLimitFilter` is a simple in-memory, per-IP fixed-window limiter applied
to the endpoints most exposed to abuse:

- `POST /api/auth/login` and `/register` — 10 requests/minute per IP
  (brute-force protection)
- `POST /api/cases` — 5 requests/minute per IP (spam protection, since
  filing is intentionally anonymous — see below)

It's process-local — fine for a single instance, but won't coordinate
across multiple instances behind a load balancer. Swap for a Redis-backed
limiter (e.g. Bucket4j + Redis) if you scale horizontally.

## Photo uploads

Photos are handled by a real multipart upload endpoint, not a base64 blob
embedded in the case JSON:

```
POST /api/uploads/photo   (multipart/form-data, field name "file")
→ { success: true, data: { url: "/uploads/<uuid>.jpg" } }
```

Files are validated (JPEG/PNG/WEBP/GIF only, 8MB max), saved to
`app.upload.dir` (default: `./uploads`), and served back at
`app.upload.public-path` (default: `/uploads/**`) via `FileUploadConfig`.

The frontend's `Report.jsx` flow: upload the photo first, get a URL back,
then include that URL as `photo` in the `POST /api/cases` payload. This
replaces the earlier approach of reading the file as a base64 data URL
client-side and stuffing it into the case JSON, which bloated both the
request payload and the database row.

**Production note:** local disk storage won't survive a redeploy on most
PaaS platforms (Heroku, Railway, etc.) and won't work at all across
multiple instances. Swap `FileStorageService` for S3/GCS/Azure Blob when
you deploy somewhere that isn't a single persistent VM — the method
signature (`store(MultipartFile) -> URL`) is designed to make that a
localized change.

## Pagination

`GET /api/cases` is backward compatible: called with no `page`/`size`
params, it returns the full matching list under `data`, exactly as before.

Pass `page` and/or `size` to opt into pagination instead:
```
GET /api/cases?status=missing&page=0&size=20
```
```json
{
  "success": true,
  "data": {
    "items": [ /* ...cases... */ ],
    "total_items": 143,
    "total_pages": 8,
    "page": 0,
    "size": 20,
    "has_next": true
  }
}
```
Page size is capped at 100 server-side regardless of what's requested.

## Anonymous case filing — intentional, not an oversight

`POST /api/cases` requires no authentication, matching the behavior of the
original Node prototype this was ported from. Walk-in / anonymous
complaints are a real use case for a missing-persons portal, so this was
kept deliberately rather than "fixed." It's now rate-limited (see above) to
bound spam risk. If you'd rather require login to file a report, change:
```java
.requestMatchers("POST", "/api/cases").permitAll()
```
to `.authenticated()` in `SecurityConfig`.

## Connecting the React frontend

In `frontend/`, create a `.env`:
```
VITE_API_BASE=http://localhost:8080/api
```
And in `frontend/src/lib/api.js`, flip:
```js
const USE_MOCK = false;
```
Every function in `api.js`, including `uploadPhoto()`, already targets the
routes this backend implements.

## Running the tests

```bash
mvn test
```
Tests run against an in-memory H2 database (no MySQL required) and the
`dev` Spring profile (so the JWT secret check doesn't block the test run).
Covered:

- `TracebackBackendApplicationTests` — application context boots cleanly
- `AuthControllerTest` — register → login round trip, wrong password (401),
  duplicate email (409), weak password validation (400)
- `CaseControllerTest` — anonymous case creation, validation errors, public
  listing with status filter, pagination shape, status update authorization
  (403 unauthenticated / 200 as police), delete + subsequent 404, stats

## API surface

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create account, returns JWT |
| POST | `/api/auth/login` | public | Returns JWT |
| GET | `/api/auth/me` | JWT required | Current user info |
| GET | `/api/cases` | public | List/search/filter cases (`?status=&case_type=&q=&page=&size=`) |
| GET | `/api/cases/stats` | public | Aggregate counts for Home/Analytics |
| GET | `/api/cases/{id}` | public | Single case detail |
| POST | `/api/cases` | public, rate-limited | File a new complaint |
| PATCH | `/api/cases/{id}/status` | police/admin only | Update case status |
| DELETE | `/api/cases/{id}` | police/admin only | Delete a case |
| POST | `/api/uploads/photo` | public, rate-limited via case-filing flow | Upload a case photo, returns a URL |
| GET | `/uploads/{filename}` | public | Serves uploaded photos |
| GET | `/api/health` | public | Liveness check |

All responses follow `{ success, data, message? }`.

## Project structure

```
src/main/java/com/traceback/
├── TracebackBackendApplication.java
├── config/
│   ├── SecurityConfig.java                       CORS + JWT + rate-limit filter chain + route auth rules
│   ├── JwtSecretEnvironmentPostProcessor.java      Fails fast on missing/weak JWT secret (see above)
│   ├── FileUploadConfig.java                        Serves /uploads/** as static files
│   └── DataSeeder.java                                Demo data on first boot (delete when ready)
├── controller/
│   ├── AuthController.java
│   ├── CaseController.java
│   ├── UploadController.java
│   └── HealthController.java
├── dto/                                                Request/response shapes (snake_case JSON via @JsonProperty)
│   └── PagedResponse.java                              Pagination envelope for GET /api/cases
├── entity/
│   ├── User.java
│   └── Case.java                                        Single table covering missing-person + general-complaint fields
├── exception/
│   ├── ApiException.java
│   └── GlobalExceptionHandler.java                      Returns {success:false, message} on errors
├── repository/                                          Spring Data JPA repositories
├── security/
│   ├── JwtUtil.java                                      Token generation/parsing
│   ├── JwtAuthFilter.java                                 Reads Bearer token per-request
│   ├── RateLimitFilter.java                                Per-IP rate limiting on sensitive endpoints
│   └── AuthenticatedUser.java                               Principal stored in SecurityContext
└── service/
    ├── AuthService.java
    ├── CaseService.java                                    Report number generation, filtering, pagination, stats
    └── FileStorageService.java                              Validates and saves uploaded photos

src/main/resources/
├── application.properties
└── db/migration/
    ├── V1__init_schema.sql
    └── V2__add_indexes.sql
```

## Still worth doing before a real production deploy

- **Horizontal scaling**: both `RateLimitFilter` and local-disk photo
  storage are process-local. Fine for one instance, not for several behind
  a load balancer — see notes above for the swap-in replacements.
- **CI**: `mvn test` works standalone now, but there's no GitHub
  Actions/CI config wired up yet to run it automatically on push.
- **Observability**: no structured logging, metrics, or error tracking
  (Sentry/similar) configured.
- **API documentation**: no OpenAPI/Swagger UI exposed yet — the tables in
  this README are the only reference.
