# TraceBack — React Frontend

This is a full React (Vite) rebuild of the original TraceBack HTML/CSS/JS portal.
Same look, same interactions — now componentized, routable, and ready to wire up
to your Express/MongoDB backend.

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build      # production build -> dist/
```

## Project structure

```
src/
├── styles.css          Full original design system CSS (ported as-is)
├── extra.css             A few additions: toasts, scroll-top button, case-type buttons
├── App.jsx                Routes
├── main.jsx                Entry point
├── data/
│   └── mockCases.js        Seed data, police stations, case types — used until backend is live
├── lib/
│   ├── api.js               *** THE API CONTRACT — see below ***
│   ├── complaint.js          Complaint text generation, WhatsApp/print/poster helpers
│   └── format.js             initials(), timeAgo(), formatDate(), age-group helpers
├── hooks/
│   ├── useAuth.jsx            Auth context (login/register/logout)
│   ├── useBookmarks.js        Bookmark state (localStorage)
│   ├── useToast.jsx            Toast notifications
│   └── useReveal.js            Scroll-reveal animation (IntersectionObserver)
├── components/               Shared UI: Navbar, Ticker, Footer, EmergencyStrip,
│                               Modal, CaseDetailModal, SuccessModal, PosterModal,
│                               CaseListItem, StatusBadge, ParticleCanvas, CustomCursor...
│   └── report/                 The 4-step missing-person form + general complaint form
└── pages/
    ├── Home.jsx
    ├── Report.jsx
    ├── Search.jsx
    ├── Tracker.jsx
    ├── Bookmarks.jsx
    ├── Login.jsx
    ├── Analytics.jsx           Chart.js via react-chartjs-2
    └── Dashboard.jsx            Police-only case management
```

## Wiring up your real backend

Everything the frontend needs from a server goes through **`src/lib/api.js`**.
Right now `USE_MOCK = true`, so every function resolves with data from
`src/data/mockCases.js` and nothing leaves the browser.

To connect it to your `traceback-v3` Express backend:

1. Set `USE_MOCK = false` in `src/lib/api.js`.
2. Set `VITE_API_BASE` in a `.env` file (or edit the fallback directly):
   ```
   VITE_API_BASE=http://localhost:3000/api
   ```
3. Each function in `api.js` already matches your existing routes:

   | Frontend function | Backend route |
   |---|---|
   | `fetchCases(filters)` | `GET /api/cases` |
   | `fetchCaseStats()` | `GET /api/cases/stats` |
   | `fetchCaseById(id)` | `GET /api/cases/:id` |
   | `createCase(payload)` | `POST /api/cases` |
   | `updateCaseStatus(id, status)` | `PATCH /api/cases/:id/status` |
   | `deleteCase(id)` | `DELETE /api/cases/:id` |
   | `login(email, password)` | `POST /api/auth/login` |
   | `register(fields)` | `POST /api/auth/register` |
   | `fetchMe()` | `GET /api/auth/me` |

4. Double check field names line up between the `payload` objects built in
   `src/pages/Report.jsx` and your Mongoose `Case` schema — matched to the
   fields in your original `models/Case.js`, but worth a diff.

5. The JWT token is stored in `localStorage` under `tb_token` and sent as
   `Authorization: Bearer <token>` automatically by the `request()` helper —
   no extra work needed once you flip `USE_MOCK` off.

## Known gaps to close when you wire the backend

- **CORS**: your Express server currently allows `origin: '*'` — fine for dev,
  tighten it for production.
- **No pagination** on `fetchCases` — add `?page=&limit=` support server-side
  when case volume grows, and extend `api.js` to pass params through.
- **Photo upload**: the form currently stores the photo as a base64 data URL in
  the payload. For production, swap this for multipart upload to disk/S3 and
  store a URL instead.
- **`POST /api/cases` had no auth requirement** in the original backend — decide
  if anonymous filing is intentional before going live.
