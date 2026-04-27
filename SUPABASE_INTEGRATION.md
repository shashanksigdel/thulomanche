# Supabase Setup Instructions

## Step 1: Create Database Tables in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `oqzevoapwgrtssmzawap`
3. Go to **SQL Editor**
4. Copy the entire content from `SUPABASE_SETUP.sql` file
5. Paste it into the SQL Editor
6. Click **Run** to create all tables

The SQL will create:
- `posts` table
- `comments` table
- `categories` table
- RLS policies for public access
- Indexes for performance

## Step 2: Insert Sample Data (Optional)

If you want to seed your blog with initial posts, run this SQL:

```sql
INSERT INTO posts (title, slug, content, excerpt, categories, tags, featured_image, author_name) VALUES
(
  'Welcome to Thulomanche: A Journey Begins',
  'welcome-to-thulomanche-a-journey-begins',
  '<h2>Hello World</h2><p>Welcome to my digital space...</p>',
  'Welcome to Thulomanche. A space for ideas, stories, and perspectives.',
  ARRAY['Personal', 'Introduction'],
  ARRAY['welcome', 'start', 'journey'],
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
  'Thulomanche'
);
```

## Step 3: Enable Storage for Images (Optional)

If you want to upload images from your admin panel:
1. Go to **Storage** in Supabase
2. Create a new bucket called `blog-images`
3. Go to **Storage** > **Policies**
4. Add policy: Allow Public SELECT

## Step 4: Test the Backend

```bash
cd backend
npm run dev
```

The server should start on http://localhost:5001

## Step 5: Test the Frontend

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000 - it will now fetch real data from Supabase!

## Step 6: Using the Admin Dashboard

1. Go to http://localhost:3000/admin
2. Create new blog posts with:
   - Title
   - Content (markdown or HTML)
   - Featured Image URL
   - Categories
   - Tags

Posts are now saved to Supabase!

## Backend API Endpoints

- `GET /api/posts` - Get all posts
- `GET /api/posts/:slug` - Get post by slug
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/category/:category` - Get posts by category
- `GET /api/posts/:postId/comments` - Get post comments
- `POST /api/posts/:postId/comments` - Add comment

## Troubleshooting

**Posts not showing?**
- Make sure RLS policies are enabled in Supabase
- Check browser console for API errors

**Can't create posts?**
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in backend .env
- Check Supabase SQL audit log for errors

**Images not loading?**
- Use full URLs (https://...) for image links
- Or set up Supabase Storage bucket

