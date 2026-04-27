# Thulomanche - Blog & Portfolio Website

A clean & minimal blogging platform with admin dashboard, built with **Node.js + Express + MongoDB** backend and **React** frontend.

## Features

✨ **For Everyone:**
- View published blog posts
- Read detailed articles with rich content
- Leave comments on posts
- Browse by categories and tags

👤 **For Registered Users:**
- Create account & login
- Write & publish posts (admin only)
- Comment on articles
- Manage your profile

🔐 **For Admins:**
- Secure admin dashboard
- Create, edit, delete posts
- Add media & featured images
- Organize posts with categories/tags
- Manage comments

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB (Mongoose ODM)
- JWT Authentication
- Bcryptjs for password hashing

**Frontend:**
- React 18
- React Router v6
- Axios for API calls
- Vite for fast development

## Project Structure

```
thulomanche/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/      # Auth & validation
│   │   ├── config/         # Database config
│   │   └── server.js       # Express app
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Page components
    │   ├── services/       # API client
    │   ├── context/        # React context (Auth)
    │   ├── styles/         # CSS files
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and settings
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

## API Documentation

See [backend/README.md](backend/README.md) for complete API documentation.

---

Made with ❤️
# thulomanche
