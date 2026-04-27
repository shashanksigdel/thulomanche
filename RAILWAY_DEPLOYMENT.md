# Deploy Backend to Railway

## Prerequisites

1. A [Railway](https://railway.app) account
2. Your project should be pushed to GitHub

## Railway Deployment Steps

### 1. Connect GitHub to Railway

1. **Go to Railway**: [railway.app](https://railway.app)
2. **Sign in** with your GitHub account
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Search and select** your `thulomanche` repository
5. **Configure the deployment**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`

### 2. Add Environment Variables

In your Railway project settings, add these environment variables:

```
SUPABASE_URL=https://oqzevoapwgrtssmzawap.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
PORT=8080
```

### 3. Database Setup

Before deploying, run these setup scripts locally:

```bash
cd backend
npm install
node setup-db.js
node setup-auth.js
```

### 4. Deploy

Railway will automatically build and deploy your backend. You'll get a URL like:
`https://thulomanche-backend.up.railway.app`

## Update Frontend Environment Variables

Once your backend is deployed, update your Netlify environment variables:

**In Netlify Site Settings → Environment variables:**

```
VITE_API_URL=https://your-railway-backend-url/api
```

## Testing

1. **Test backend**: Visit `https://your-backend-url/api/posts`
2. **Test frontend**: Your Netlify site should now work with the backend
3. **Test admin**: Try logging in to `/admin`

## Troubleshooting

### Build Fails
- Check that `backend/package.json` has the correct start script
- Ensure all environment variables are set

### API Not Working
- Verify the backend URL in Netlify environment variables
- Check Railway logs for errors
- Make sure Supabase keys are correct

### Admin Not Accessible
- Run `node setup-auth.js` to create admin user
- Check that JWT_SECRET is set and consistent