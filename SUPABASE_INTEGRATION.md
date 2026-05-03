# Supabase Setup Instructions

This document is **no longer applicable as written**, because this repo is now **frontend-only** (React + Vite). The backend (Express/MongoDB) that previously talked to Supabase has been removed, along with the admin/auth/post APIs.

## What you can still do

- Keep the Supabase SQL/table setup notes if you plan to reintroduce a backend later.
- Use this as a reference for schema/policies when rebuilding backend integration.

## Next steps if you plan to add a backend again

1. Recreate the backend service that implements the REST API.
2. Point the backend to your Supabase project (SUPABASE_URL + SUPABASE keys).
3. Wire the frontend to the backend’s endpoints (and keep VITE env vars consistent).

## Previous backend testing steps (removed)

Commands like:
]]></content>
- Visiting `http://localhost:5001`
- Using `/admin`
- Listing backend API endpoints

…have been removed because they won’t work without the backend code.
