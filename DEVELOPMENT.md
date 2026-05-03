# Development Guide

## Overview

This project is now **frontend-only** (React + Vite). All backend code (and the `backend/` directory) has been removed.

## How to run locally

```bash
npm install
npm run dev
```

Then open the URL shown in your terminal (typically http://localhost:3000).

## Routes / Pages

- `/` – Home page
- `/tools/unicode-to-preeti` – Unicode → Preeti converter tool

## Key frontend pieces

- `src/App.jsx` – React Router routes
- `src/pages/Home.jsx` – Home page
- `src/pages/tools/UnicodeToPreetiConverter.jsx` – Converter tool UI
- `src/services/api.js` – Axios client (currently may not be used for backend calls)

## Environment Variables

No backend `.env` is required anymore.

If you use Vite env vars for the frontend, configure them via:
- `.env` (Vite-supported) at repo root

Example (optional):
```bash
VITE_API_URL=
```
(If present, it will be used by any remaining axios calls in the frontend code.)

## Notes

If you previously relied on backend functionality (login/admin/posts/comments), that functionality has been removed along with the backend.
