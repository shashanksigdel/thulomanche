# Deploy (Frontend) — Railway / Static hosting

This repo is now **frontend-only** (React + Vite). Backend deployment steps were removed.

## Recommended approach

Use a static hosting provider (Netlify/Vercel/Railway static) to host the built assets.

### Option A: Deploy the built frontend assets
1. Build the app locally:
   ```bash
   npm install
   npm run build
   ```
2. Deploy the `dist/` folder to your hosting provider.

Railway typically needs:
- Build command: `npm run build`
- Output directory: `dist/`

## Environment variables

If your frontend uses Vite env vars, define them in the hosting provider’s environment settings.
For example:
- `VITE_*`

## Notes

- Since backend code has been removed, there are no `/api/*` or `/admin` routes to deploy.
