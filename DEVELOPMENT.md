# Development Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     THULOMANCHE.COM                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐        ┌──────────────────────┐  │
│  │   FRONTEND (React)   │        │  BACKEND (Express)   │  │
│  │   Port: 3000         ├────────┤  Port: 5000          │  │
│  ├──────────────────────┤        ├──────────────────────┤  │
│  │ • Pages              │        │ • API Routes         │  │
│  │ • Components         │        │ • Controllers        │  │
│  │ • Services (API)     │◄──────►│ • Models (Mongoose)  │  │
│  │ • Context (Auth)     │        │ • Middleware (Auth)  │  │
│  │ • Styles             │        │ • Config             │  │
│  └──────────────────────┘        └──────────────────────┘  │
│              │                              │                │
│              │                              ▼               │
│              │                    ┌──────────────────────┐  │
│              │                    │   MongoDB            │  │
│              │                    │   (Database)         │  │
│              │                    └──────────────────────┘  │
│              │                                              │
│              └──────────────────────────────────────────┘  │
│                         HTTP/REST API                       │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

### Backend (`/backend/src/`)

```
backend/
├── config/
│   └── database.js          # MongoDB connection setup
├── controllers/
│   ├── authController.js   # Auth logic (register, login, getCurrentUser)
│   ├── postController.js   # Post CRUD operations
│   └── commentController.js # Comment CRUD operations
├── middleware/
│   └── auth.js             # JWT verification & role authorization
├── models/
│   ├── User.js             # User schema with password hashing
│   ├── Post.js             # Post schema with slug generation
│   └── Comment.js          # Comment schema
├── routes/
│   ├── auth.js             # Auth endpoints
│   ├── posts.js            # Post endpoints
│   └── comments.js         # Comment endpoints
├── server.js               # Express app & middleware setup
├── package.json
├── .env.example
└── README.md
```

### Frontend (`/frontend/src/`)

```
frontend/
├── components/
│   ├── Header.jsx          # Navigation & user menu
│   ├── PostsList.jsx       # Home feed with all posts
│   ├── PostDetail.jsx      # Single post view with comments
│   ├── Login.jsx           # Login form
│   └── Register.jsx        # Registration form
├── pages/
│   ├── Home.jsx            # Home page wrapper
│   └── AdminDashboard.jsx  # Admin post creation & management
├── services/
│   └── api.js              # Axios instance & API calls
├── context/
│   └── AuthContext.jsx     # Global auth state management
├── styles/
│   ├── globals.css         # Global styles & utilities
│   ├── header.css          # Header styling
│   ├── posts.css           # Posts list styling
│   ├── post-detail.css     # Post detail & comments styling
│   └── auth.css            # Auth form styling
├── App.jsx                 # Main app with routing
├── main.jsx                # React DOM mount point
├── index.html
├── vite.config.js
├── package.json
└── tsconfig.json
```

## Data Flow

### Authentication Flow
```
User Input (Email/Password)
        ▼
Register/Login Form
        ▼
API Call (authService.register/login)
        ▼
Backend Validation
        ▼
Password Hash/Compare
        ▼
JWT Token Generated
        ▼
Token Stored in localStorage
        ▼
AuthContext Updated (user state)
        ▼
Protected Routes Accessible
```

### Post Creation Flow (Admin)
```
Admin Input (Title, Content, etc.)
        ▼
Form Submission
        ▼
API Call (postsService.createPost)
        ▼
Backend Validation
        ▼
Post Document Created in MongoDB
        ▼
Response with Post Data
        ▼
Dashboard Updated with New Post
        ▼
Post Published (if checked)
```

### Comment Flow
```
User Input (Comment Text)
        ▼
Comment Form Submission
        ▼
API Call (commentsService.createComment)
        ▼
Backend Validation & Auth Check
        ▼
Comment Document Created
        ▼
Post's commentCount Incremented
        ▼
Comment Added to UI
        ▼
Response to User
```

## Key Components Explained

### AuthContext (State Management)
- Manages global authentication state
- Provides `user`, `login()`, `register()`, `logout()` methods
- Persists token in localStorage
- Checks authentication on app load

### API Service
- Centralized axios instance
- Automatic token injection in headers
- Service methods for each resource (auth, posts, comments)
- Error handling with interceptors

### Protected Routes
- Components check `AuthContext.user`
- Redirect to home if not authenticated
- Only admins can access `/admin` route

### Components
- **Header**: Navigation, user menu, logout
- **PostsList**: Fetches & displays all published posts
- **PostDetail**: Shows single post with comments section
- **Login/Register**: Auth forms with validation
- **AdminDashboard**: Post creation & management interface

## Development Workflow

### 1. Adding a New Feature

**Example: Add "Like" functionality**

**Backend:**
1. Add `likes: [ObjectId]` to Post model
2. Create endpoint: `POST /api/posts/:id/like`
3. Add controller method to handle likes
4. Add route to posts.js

**Frontend:**
1. Add `likePost()` method to api.js service
2. Add like button to PostDetail component
3. Handle click & update UI

### 2. Adding Validation

**Backend Example:**
```javascript
// In controller
export const createPost = async (req, res) => {
  const { title, content } = req.body;
  
  if (!title || title.length < 5) {
    return res.status(400).json({ message: 'Title must be at least 5 characters' });
  }
  // ... rest of logic
};
```

**Frontend Example:**
```javascript
// In form component
const [error, setError] = useState('');

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (title.length < 5) {
    setError('Title must be at least 5 characters');
    return;
  }
  // ... submit
};
```

### 3. Adding Middleware

**Example: Admin-only endpoint**

```javascript
// routes/posts.js
router.post('/', 
  protect,                    // Check if logged in
  authorize(['admin']),       // Check if admin
  createPost                  // Handler
);
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "message": "Error description",
  "status": 400
}
```

## Environment Variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/thulomanche
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:5000/api
```

## Common Tasks

### Add a New API Endpoint

1. **Create route** in `routes/[resource].js`
2. **Create controller method** in `controllers/[resource]Controller.js`
3. **Add service method** in `frontend/src/services/api.js`
4. **Use in component** with try/catch error handling

### Add Form Validation

1. **Backend**: Add validation in controller or middleware
2. **Frontend**: Add client-side validation before submission
3. **Display errors** in UI with user-friendly messages

### Connect Database

1. Ensure MongoDB is running
2. Update `MONGODB_URI` in .env
3. Schemas will auto-create collections

### Deploy

1. Build frontend: `npm run build`
2. Set environment variables on host
3. Deploy backend & frontend separately
4. Update API URLs in frontend config

---

## Tips for Contributing

- Keep components small and focused
- Reuse components instead of duplicating
- Add error handling to all API calls
- Test forms with both valid and invalid inputs
- Use meaningful variable names
- Add comments to complex logic
- Follow existing code style
- Test after making changes

---

For more info, see [QUICKSTART.md](QUICKSTART.md) and individual README files.
