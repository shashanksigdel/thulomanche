# Deploying to Netlify

## Prerequisites

1. A [Netlify](https://netlify.com) account
2. Your Supabase project URL and anon key

## Deployment Steps

### 1. Get Supabase Credentials

From your Supabase dashboard:
- Go to Settings → API
- Copy your Project URL
- Copy your anon/public key

### 2. Deploy to Netlify

#### Option A: Connect GitHub Repository
1. Go to [Netlify](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

#### Option B: Manual Deploy
1. Build the project locally:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Drag and drop the `dist` folder to Netlify's deploy area

### 3. Configure Environment Variables

In your Netlify site settings, go to "Environment variables" and add:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Update Supabase RLS Policies

Make sure your Supabase tables have proper Row Level Security policies for public access to posts, settings, etc. You may need to update the policies in your Supabase dashboard.

### 5. Deploy

Click "Deploy site" on Netlify. Your site should be live!

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Posts are displayed
- [ ] Authentication works (login/register)
- [ ] Admin panel is accessible (if user is admin)
- [ ] Social media links work
- [ ] Contact forms work (if any)

## Troubleshooting

### Build Errors
- Check that all environment variables are set
- Ensure Supabase URL and keys are correct
- Check build logs in Netlify

### Authentication Issues
- Verify Supabase auth settings
- Check RLS policies allow necessary operations

### Content Not Loading
- Check Supabase table permissions
- Verify environment variables are accessible in the browser (they start with `VITE_`)

## Custom Domain (Optional)

To use a custom domain:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS records as instructed

## Performance Tips

- Enable Netlify's asset optimization
- Consider using Netlify Functions for any server-side logic
- Use Netlify's CDN for global performance