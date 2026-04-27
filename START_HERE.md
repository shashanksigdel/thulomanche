Welcome to **Thulomanche** 👋

# Project Index & Getting Started

This is your complete guide to understanding and using the Thulomanche portfolio & blog platform.

---

## 📖 Documentation Files

### Start Here
1. **[README.md](README.md)** - High-level project overview
2. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - What's included & completed
3. **[QUICKSTART.md](QUICKSTART.md)** - Installation & running the project

### Development
4. **[DEVELOPMENT.md](DEVELOPMENT.md)** - Architecture, file structure, and development guide
5. **[FEATURES.md](FEATURES.md)** - Feature checklist, what's done, what's next

### Technical
6. **[backend/README.md](backend/README.md)** - Backend-specific documentation & API docs

---

## 🎯 Quick Navigation

### I want to...

**Get started quickly**
→ Read [QUICKSTART.md](QUICKSTART.md)

**Understand the project structure**
→ Read [DEVELOPMENT.md](DEVELOPMENT.md)

**See what features are included**
→ Read [FEATURES.md](FEATURES.md)

**Learn about the API**
→ Read [backend/README.md](backend/README.md)

**Contribute to development**
→ Read [DEVELOPMENT.md](DEVELOPMENT.md) → Development Workflow section

**Deploy to production**
→ Read [QUICKSTART.md](QUICKSTART.md) → Production Checklist section

---

## 📦 What You Got

### Backend (Node.js + Express + MongoDB)
- ✅ Express.js server with proper middleware
- ✅ MongoDB integration with Mongoose
- ✅ JWT authentication system
- ✅ Role-based access control
- ✅ CRUD APIs for posts, comments, users
- ✅ Password hashing & security
- ✅ Ready for deployment

### Frontend (React + Vite)
- ✅ Modern React with hooks
- ✅ Clean & minimal UI design
- ✅ React Router for navigation
- ✅ Global auth state management
- ✅ Axios API client
- ✅ Responsive layouts
- ✅ Admin dashboard
- ✅ Comments system

### Database
- ✅ User schema (with password hashing)
- ✅ Post schema (with auto-slug generation)
- ✅ Comment schema
- ✅ Proper indexing & relationships

### Documentation
- ✅ Setup guides
- ✅ API documentation
- ✅ Development guides
- ✅ Feature checklists
- ✅ Architecture diagrams

---

## 🚀 Getting Started in 3 Steps

### Step 1: Install & Setup
```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI

# Frontend
cd ../frontend
npm install
```

### Step 2: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 3: Visit App
Open browser to `http://localhost:3000` and start exploring!

---

## 📋 Core Features at a Glance

| Feature | Status | Access |
|---------|--------|--------|
| User Registration | ✅ Complete | Everyone |
| User Login | ✅ Complete | Everyone |
| View Posts | ✅ Complete | Everyone |
| Read Comments | ✅ Complete | Everyone |
| Write Comments | ✅ Complete | Logged In Users |
| Create Posts | ✅ Complete | Admins Only |
| Edit Posts | ✅ Complete | Admins Only |
| Delete Posts | ✅ Complete | Admins Only |
| Categories & Tags | ✅ Complete | Admins |
| Featured Images | ✅ Complete | Admins |
| Admin Dashboard | ✅ Complete | Admins Only |
| Search & Filter | ✅ Complete | Everyone |
| View Tracking | ✅ Complete | System |

---

## 🏗️ Architecture at a Glance

```
┌─ Frontend (React, Port 3000)
│  ├─ Auth (Login/Register)
│  ├─ Posts (List/Detail)
│  ├─ Comments
│  └─ Admin Dashboard
│
├─ API (Express, Port 5000)
│  ├─ /api/auth (register, login, me)
│  ├─ /api/posts (CRUD)
│  └─ /api/comments (CRUD)
│
└─ Database (MongoDB)
   ├─ Users
   ├─ Posts
   └─ Comments
```

---

## 🔐 Security Features

- ✅ JWT tokens for authentication
- ✅ Password hashing with bcryptjs
- ✅ Role-based access (admin/user)
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Input validation

---

## 📱 Responsive & Mobile-Ready

- ✅ Mobile-first design
- ✅ Responsive layouts
- ✅ Touch-friendly interface
- ✅ Fast performance

---

## 🎨 Design

- **Style**: Clean, minimal (Medium-inspired)
- **Colors**: Black text on white background
- **Typography**: System fonts for speed
- **Layout**: Single column, readable
- **Focus**: Content-first design

---

## 📊 Database Schema

### Users
```
- _id: ObjectId
- name: String
- email: String (unique)
- password: String (hashed)
- bio: String
- avatar: String (URL)
- role: 'user' | 'admin'
- createdAt: Date
- updatedAt: Date
```

### Posts
```
- _id: ObjectId
- title: String
- slug: String (auto-generated)
- content: String (HTML)
- excerpt: String
- author: ObjectId → User
- categories: [String]
- tags: [String]
- featuredImage: String (URL)
- published: Boolean
- viewCount: Number
- commentCount: Number
- createdAt: Date
- updatedAt: Date
```

### Comments
```
- _id: ObjectId
- content: String
- author: ObjectId → User
- post: ObjectId → Post
- isApproved: Boolean
- createdAt: Date
- updatedAt: Date
```

---

## 🔗 API Overview

### Authentication
```
POST   /api/auth/register          # Sign up
POST   /api/auth/login             # Sign in
GET    /api/auth/me                # Get user (protected)
```

### Posts
```
GET    /api/posts                  # List all published
GET    /api/posts/:slug            # Get one by slug
POST   /api/posts                  # Create (admin)
PUT    /api/posts/:id              # Update (admin)
DELETE /api/posts/:id              # Delete (admin)
```

### Comments
```
GET    /api/comments/post/:id      # Get for a post
POST   /api/comments               # Create (auth required)
DELETE /api/comments/:id           # Delete (owner/admin)
```

---

## 💻 Technology Stack

**Backend**
- Node.js - JavaScript runtime
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing

**Frontend**
- React 18 - UI library
- Vite - Build tool
- React Router - Navigation
- Axios - HTTP client
- CSS3 - Styling

---

## 🚀 Next Steps

1. **Read QUICKSTART.md** for setup instructions
2. **Start the servers** (backend & frontend)
3. **Explore the app** - create account, view posts
4. **Check DEVELOPMENT.md** to understand the code
5. **Make it your own** - customize colors, content, etc.
6. **Deploy** when ready (see QUICKSTART.md)

---

## 📞 Useful Commands

**Backend**
```bash
cd backend
npm run dev          # Start development server
npm install          # Install dependencies
npm start            # Start production server
```

**Frontend**
```bash
cd frontend
npm run dev          # Start development server
npm install          # Install dependencies
npm run build        # Build for production
npm run preview      # Preview production build
```

**Both**
```bash
./start.sh           # Start both servers together (macOS/Linux)
```

---

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [JWT Guide](https://jwt.io/introduction)

---

## 🐛 Troubleshooting

**MongoDB Connection Error?**
- Make sure MongoDB is running: `mongod`
- Or update MONGODB_URI to MongoDB Atlas URL

**CORS Error?**
- Check FRONTEND_URL in backend .env
- Should match your frontend URL

**Can't login?**
- Verify user exists in database
- Check JWT_SECRET is set correctly

**Need help?**
- Check the README files for more details
- Review code comments in source files
- Search for error message in docs

---

## 🎯 Your Journey

```
1. Setup → 2. Run → 3. Test → 4. Customize → 5. Deploy
```

You're at:  **Step 1 (Setup)** ✅

Next: Follow [QUICKSTART.md](QUICKSTART.md) to move to Step 2!

---

## 📝 Notes

- This is a **production-ready foundation**, not a final product
- Add a rich text editor for better post creation
- Implement image uploads to cloud storage
- Add email notifications for engagement
- Set up analytics to track readers

---

## 🎉 Ready?

**Start with [QUICKSTART.md](QUICKSTART.md)** and get your site running in minutes!

Questions? Check the documentation files, code comments are your friends.

Happy coding! 🚀

---

**Project**: Thulomanche v1.0  
**Last Updated**: April 23, 2026  
**Status**: ✅ Ready for Development
