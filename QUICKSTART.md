# Quick Start Guide

## Installation & Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your settings:
# - MONGODB_URI: Your MongoDB connection string (default: mongodb://localhost:27017/thulomanche)
# - JWT_SECRET: A strong secret key (change in production!)
# - Cloudinary credentials (optional, for image uploads)

# Start the development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 🎯 Ready-to-Use Features

### ✅ Authentication
- User registration & login
- JWT-based authentication
- Admin role support
- Protected routes

### ✅ Post Management (Admin Only)
- Create new posts with title, content, excerpt
- Add featured images
- Organize with categories & tags
- Publish immediately or save as draft
- Auto-generated URL slugs

### ✅ Public Features
- View all published posts
- Read full articles
- See post metadata (author, date, views)
- Search & filter by categories/tags

### ✅ Comments System
- Authenticated users can comment
- Comments are moderated (default: approved)
- Comment count tracking
- Delete own comments

### ✅ Admin Dashboard
- Centralized post management
- Quick publish interface
- View all your posts
- Track metrics (views, comments)

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  bio: String,
  avatar: String (URL),
  role: 'user' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  title: String,
  slug: String (auto-generated),
  content: String,
  excerpt: String,
  author: ObjectId (ref: User),
  categories: [String],
  tags: [String],
  featuredImage: String (URL),
  published: Boolean,
  viewCount: Number,
  commentCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  content: String,
  author: ObjectId (ref: User),
  post: ObjectId (ref: Post),
  isApproved: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Posts
- `GET /api/posts` - Get all published posts (query params: category, tag, search)
- `GET /api/posts/:slug` - Get single post by slug
- `POST /api/posts` - Create post (admin only)
- `PUT /api/posts/:id` - Update post (admin only)
- `DELETE /api/posts/:id` - Delete post (admin only)

### Comments
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments` - Create comment (requires auth)
- `DELETE /api/comments/:id` - Delete comment (own or admin only)

---

## 🎨 Design Philosophy

The site follows a **clean & minimal design** (inspired by Medium):
- Simple, readable typography
- Ample whitespace
- Focus on content
- Responsive on all devices
- Fast load times

---

## 📝 Next Steps to Deploy

1. **Set up MongoDB Atlas** (free cloud database)
2. **Configure environment variables** for production
3. **Set up media hosting** (Cloudinary, AWS S3, etc.)
4. **Deploy backend** (Heroku, Railway, Render, AWS, etc.)
5. **Deploy frontend** (Vercel, Netlify, AWS S3 + CloudFront)
6. **Add custom domain** to your deployment

---

## 🚀 Production Checklist

- [ ] Change JWT_SECRET to a strong value
- [ ] Set NODE_ENV to 'production'
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Set up HTTPS on domain
- [ ] Add rate limiting to API
- [ ] Set up email notifications
- [ ] Add visual post editor (TinyMCE, Quill, etc.)
- [ ] Implement admin moderation for comments
- [ ] Add analytics (Google Analytics, etc.)
- [ ] Set up backups for MongoDB

---

## 💡 Ideas for Future Enhancements

- Rich text editor (WYSIWYG)
- Social sharing buttons
- Reading time estimate
- Related posts
- Newsletter subscription
- User profiles
- Follow/subscribe features
- Post analytics dashboard
- Markdown support
- Dark mode
- Search with Elasticsearch
- SEO optimization
- Image optimization & lazy loading

---

## ❓ Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running locally: `mongod`
- Or update MONGODB_URI to your MongoDB Atlas connection string

### CORS Errors
- Ensure FRONTEND_URL in backend .env matches your frontend URL
- Backend CORS is already configured in server.js

### Auth Token Not Working
- Clear localStorage and try logging in again
- Check JWT_SECRET is the same in .env and being used

---

Enjoy building! 🚀
