# Fullstack Authentication & Profile Management System

A production-grade, secure **Authentication & Profile Management System** built with **React (Vite)**, **Node.js/Express**, and a connected relational **SQLite database**.

---

## ✨ Features

- 🔐 **User Registration (Sign Up)**:
  - Full name, email, password, optional phone number, and location.
  - Live password strength indicator (Weak / Medium / Strong).
  - Secure password hashing using **bcryptjs** (10 salt rounds).
  - Validation to ensure email uniqueness and password requirements.
- 🔑 **User Authentication (Sign In)**:
  - Secure credential verification.
  - JSON Web Token (**JWT**) generation with 7-day expiration.
  - Persistent login session via `localStorage` with token verification on startup.
  - One-click demo credentials fill button.
- 👤 **Profile Management (Update Profile)**:
  - Users can view and update their profile details:
    - **Full Name**
    - **Phone Number**
    - **Location**
    - **Bio / About Me**
  - Instant synchronization with the SQLite database.
  - Security section for changing password (requires verifying current password before hashing new password).
- 🗄️ **Connected Database (SQLite 3)**:
  - Stored in `server/auth.db`.
  - Zero-configuration relational database with **WAL concurrency mode**.
  - Built-in **Database Explorer** tab in the UI allowing you to inspect real-time user records stored in SQLite.
- 🎨 **Modern Sleek UI**:
  - Dark mode glassmorphism theme with **Tailwind CSS**.
  - Responsive layout for desktop, tablet, and mobile.
  - Lucide React icon library.
  - Interactive toast notification banners for feedback.

---

## 🏗️ Architecture & Tech Stack

```
task 1/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Navbar, Toast, etc.
│   │   ├── context/            # AuthContext (state, JWT management)
│   │   ├── pages/              # Login, Register, Profile, Dashboard, DatabaseView
│   │   ├── services/           # Axios API client with auth interceptors
│   │   ├── App.jsx             # Main application container
│   │   └── index.css           # Tailwind CSS styles
│   ├── package.json
│   └── vite.config.js          # Vite config with API proxy to port 5000
│
├── server/                     # Backend API & Database (Node/Express)
│   ├── routes/
│   │   └── auth.js             # /register, /login, /me, /profile, /change-password
│   ├── middleware/
│   │   └── auth.js             # JWT bearer verification middleware
│   ├── database.js             # SQLite initialization & prepared queries
│   ├── seed.js                 # Database seeder with demo account
│   ├── test-api.js             # Automated API integration tests
│   ├── auth.db                 # SQLite database file
│   ├── server.js               # Express application entrypoint
│   └── package.json
│
├── run-dev.js                  # Concurrent runner script
├── package.json                # Root package with startup scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **npm**

### 2. Start Both Frontend and Backend with One Command
From the project root (`task 1/`), run:

```bash
node run-dev.js
```
*(Or `npm start`)*

This launches:
- **Frontend (React UI)** at: [http://localhost:3000](http://localhost:3000)
- **Backend API** at: [http://localhost:5000](http://localhost:5000)

---

### Alternative: Running in Separate Terminals

#### Terminal 1 — Start Backend Server:
```bash
cd server
npm start
```

#### Terminal 2 — Start Frontend Client:
```bash
cd client
npm run dev
```

---

## 🧪 Pre-seeded Demo Credentials

For quick testing, a demo account is already seeded into the SQLite database:

| Field | Value |
|---|---|
| **Email** | `alex.rivera@example.com` |
| **Password** | `Password123!` |

You can also click the **"Fill Demo Credentials"** button on the Sign In page to automatically fill these details.

---

## 📡 API Reference

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server & SQLite connection status |
| `POST` | `/api/auth/register` | Public | Register new user, store in DB, issue JWT |
| `POST` | `/api/auth/login` | Public | Authenticate user, issue JWT |
| `GET` | `/api/auth/me` | Bearer Token | Fetch current authenticated user profile |
| `PUT` | `/api/auth/profile` | Bearer Token | Update user profile fields in SQLite |
| `PUT` | `/api/auth/change-password` | Bearer Token | Verify old password & update to new hash |
| `GET` | `/api/auth/users` | Public | List all user records (for database inspector) |

---

## 🗃️ Database Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password TEXT NOT NULL,
  bio TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  location TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
