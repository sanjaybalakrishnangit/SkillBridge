# Local Worker Connector — Complete Workflow Guide

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Setup & Running](#3-setup--running)
4. [User Roles & Access](#4-user-roles--access)
5. [Page-by-Page Workflow](#5-page-by-page-workflow)
6. [API Reference](#6-api-reference)
7. [Data Models](#7-data-models)
8. [Authentication Flow](#8-authentication-flow)
9. [Admin Workflow](#9-admin-workflow)
10. [Client Workflow](#10-client-workflow)
11. [File Structure](#11-file-structure)

---

## 1. Project Overview

**Local Worker Connector** is a full-stack MERN platform that:
- Lets **admins/family members** register daily wage workers (plumbers, electricians, painters, etc.)
- Lets **clients** browse workers by skill/location and contact them directly
- Lets **clients** post job requirements for workers to find

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 · Vite · Tailwind CSS v3   |
| Backend   | Node.js · Express                   |
| Database  | MongoDB · Mongoose                  |
| Auth      | JWT · bcryptjs                      |
| Uploads   | Multer (local disk, `/uploads/`)    |
| Forms     | React Hook Form                     |
| Toasts    | React Hot Toast                     |
| Icons     | React Icons (Feather + Material)    |

---

## 2. Architecture Diagram

```
Browser (React + Vite)  :5173
        │
        │  HTTP (proxied)
        ▼
Express Server          :5000
   ├── /api/auth        ──► authController  ──► User model
   ├── /api/workers     ──► workerController ──► Worker model
   ├── /api/jobs        ──► jobController   ──► Job model
   └── /uploads         ──► static files (Multer uploads)
        │
        ▼
MongoDB (local or Atlas)
   ├── users
   ├── workers
   └── jobs
```

### Request / Response Flow

```
Client Action
  │
  ├─► React Hook Form validates input (frontend)
  │
  ├─► Axios sends request with JWT Bearer token
  │
  ├─► authMiddleware.js  →  verifies JWT, loads req.user
  ├─► adminMiddleware.js →  checks role === 'admin'
  │
  ├─► Controller handles logic + talks to Mongoose model
  │
  ├─► errorHandler.js   →  catches all errors, formats JSON
  │
  └─► JSON response → React state update → UI re-renders
```

---

## 3. Setup & Running

### Prerequisites
- **Node.js 18+**
- **MongoDB** running locally (`mongod`) OR a MongoDB Atlas connection string

### Step 1 — Clone / Open the project
```
s:\PROJECT\Local Worker Connector\
```

### Step 2 — Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Step 3 — Environment variables

The `server/.env` file is already created with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/local-worker-connector
JWT_SECRET=lwc_super_secret_jwt_key_change_in_production
NODE_ENV=development
```
Edit `MONGO_URI` if using Atlas.

### Step 4 — Seed the database (first time only)

```bash
cd server
npm run seed
```

Output:
```
✅ Connected to MongoDB
✅ Admin user created  →  phone: 9999999999  |  password: admin123
✅ 8 sample workers seeded
🎉 Seeding done!
```

### Step 5 — Start both servers

```bash
# Terminal 1 — Backend
cd server
npm run dev          # nodemon, auto-restarts on changes
                     # Server: http://localhost:5000

# Terminal 2 — Frontend
cd client
npm run dev          # Vite HMR
                     # App: http://localhost:5173
```

---

## 4. User Roles & Access

| Role   | Register? | Browse Workers | Browse Jobs | Post Job | Admin Dashboard |
|--------|-----------|----------------|-------------|----------|-----------------|
| Guest  | —         | ✅              | ✅           | ✅        | ❌               |
| Client | ✅         | ✅              | ✅           | ✅        | ❌               |
| Admin  | ✅         | ✅              | ✅           | ✅        | ✅               |

> **Post a Job is open to everyone — no account needed.**
> Any household/employer can post a job requirement without registering.
> Admin role is assigned in the database. Normal registration creates a `client`.
> To promote a user: update their `role` field to `"admin"` in MongoDB,
> or use the pre-seeded admin account (phone: 9999999999 / password: admin123).

---

## 5. Page-by-Page Workflow

### 5.1 Home Page  `/`

**Purpose:** Browse and search for workers.

**Flow:**
```
User lands on /
  │
  ├─► Hero section loads (teal gradient, stats strip)
  │
  ├─► GET /api/workers  ──► 8 seeded workers displayed in grid
  │       └── WorkerCard shows:
  │             name · skill badge (color-coded) · location
  │             star rating · availability dot · verified ✓ badge
  │             [Call Now] → tel: link
  │
  ├─► Skill filter pills (All / Plumber / Electrician / Painter / ...)
  │       └── Click pill → GET /api/workers?skill=Plumber
  │
  ├─► Location search bar
  │       └── Type city → click Search → GET /api/workers?location=Mumbai
  │
  └─► [Clear filters] → resets to all workers
```

**Skill Badge Colors:**
| Skill       | Color       |
|-------------|-------------|
| Plumber     | Blue        |
| Electrician | Yellow      |
| Painter     | Purple      |
| Carpenter   | Orange      |
| Driver      | Green       |
| Gardener    | Emerald     |
| Mason       | Stone       |
| Welder      | Red         |

---

### 5.2 Jobs Page  `/jobs`

**Purpose:** Browse job postings by clients/employers.

**Flow:**
```
User navigates to /jobs
  │
  ├─► GET /api/jobs  ──► all jobs displayed in 3-column grid
  │       └── JobCard shows:
  │             title · description (line-clamp) · time-ago
  │             payment badge (💵 Paid / 🍱 Food / 💵🍱 Paid+Food)
  │             working hours · location
  │             [Contact Employer] → tel: link
  │
  ├─► Empty state if no jobs → "No jobs posted yet" with CTA
  │
  └─► [+ Post a Job] button (top-right)
          ├── Logged in  → /post-job
          └── Not logged in → /login
```

---

### 5.3 Post a Job  `/post-job`  *(Open to everyone — no login needed)*

**Purpose:** Any client, household, or employer can post a job requirement publicly.
Workers or their families browse `/jobs` and contact the employer directly.

**Why no login?** Friction kills adoption. A homeowner who just needs a quick plumber
shouldn't have to create an account just to post one requirement.

**Flow:**
```
Anyone navigates to /post-job  (guest OR logged-in user)
  │
  ├─► Form is shown immediately — no auth check
  │
  ├─► Form fields:
  │     Job Title *       (required)
  │     Description *     (required, min 20 chars)
  │     Location *        (required)
  │     Working Hours *   (required, e.g. "9 AM – 5 PM")
  │     Payment Type *    (radio: 💵 Money / 🍱 Food / 💵🍱 Both)
  │     Phone *           (required, pattern validated)
  │     Image             (optional, max 5 MB, image/* only)
  │
  ├─► React Hook Form validates on submit
  │
  ├─► FormData sent to POST /api/jobs (public endpoint, no JWT needed)
  │       └── postedBy is saved only if user is logged in (optional FK)
  │
  ├─► Success → toast "Job posted successfully!" → 2.5s → redirect /jobs
  │
  └─► Error → toast with server error message
```

---

### 5.4 Login  `/login`

**Flow:**
```
Enter phone + password → click Sign In
  │
  ├─► POST /api/auth/login
  │       ├── Server finds user by phone
  │       ├── bcrypt.compare(password, hash)
  │       └── Returns { _id, name, phone, role, token }
  │
  ├─► loginUser(userData, token)
  │       ├── localStorage.setItem('lwc_token', token)
  │       └── localStorage.setItem('lwc_user', JSON.stringify(userData))
  │
  ├─► role === 'admin' → redirect /admin
  └─► role === 'client' → redirect /
```

**Demo credentials:**
```
Phone:    9999999999
Password: admin123
```

---

### 5.5 Register  `/register`

**Flow:**
```
Enter name + phone + password + confirm password → Create Account
  │
  ├─► Frontend validates:
  │     name (min 2 chars) · phone (pattern) · password (min 6) · confirm match
  │
  ├─► POST /api/auth/register
  │       ├── Checks duplicate phone
  │       ├── User.create() → pre-save hook hashes password (bcrypt 10 rounds)
  │       └── Returns { _id, name, phone, role: 'client', token }
  │
  └─► loginUser() → redirect /
```

---

### 5.6 Admin Dashboard  `/admin`  *(Admin only)*

**Flow:**
```
Navigate to /admin
  │
  ├─► ProtectedRoute: not logged in → /login
  ├─► ProtectedRoute: role ≠ 'admin' → /  (403 redirect)
  │
  ├─► GET /api/workers → populate stats + table
  │
  ├─► Stats Cards (live, update on every action):
  │     Total Workers · Verified · Available · Unverified
  │
  ├─► Search bar → filters table client-side (name / skill / location)
  │
  ├─► [+ Add Worker] → opens WorkerModal (blank form)
  │       └── POST /api/workers (multipart/form-data)
  │
  ├─► [✏ Edit] → opens WorkerModal (pre-filled form)
  │       └── PUT /api/workers/:id (multipart/form-data)
  │
  ├─── [✓ Verify / Verified] → toggle button per row
  │       └── PATCH /api/workers/:id/verify
  │               ├── Unverified → "Verified" (green badge)
  │               └── Verified → "Verify" (grey, hover shows action)
  │
  └─── [🗑 Delete] → window.confirm() → DELETE /api/workers/:id
```

#### Worker Modal Fields:
| Field        | Required | Notes                       |
|--------------|----------|-----------------------------|
| Full Name    | Yes      |                             |
| Skill        | Yes      | Dropdown with 12 options    |
| Phone        | Yes      |                             |
| Location     | Yes      |                             |
| Rating       | No       | 0–5, step 0.1               |
| Availability | No       | Available / Not Available   |
| Experience   | No       | Free text                   |
| Photo        | No       | Image file, max 5 MB        |

---

## 6. API Reference

### Auth Routes

| Method | Endpoint            | Auth    | Body                              | Returns                         |
|--------|---------------------|---------|-----------------------------------|---------------------------------|
| POST   | `/api/auth/register`| Public  | `{ name, phone, password }`       | `{ _id, name, phone, role, token }` |
| POST   | `/api/auth/login`   | Public  | `{ phone, password }`             | `{ _id, name, phone, role, token }` |
| GET    | `/api/auth/me`      | Private | —                                 | User object (no password)       |

### Worker Routes

| Method | Endpoint                     | Auth         | Description                    |
|--------|------------------------------|--------------|--------------------------------|
| GET    | `/api/workers`               | Public       | All workers. `?skill=&location=` |
| GET    | `/api/workers/:id`           | Public       | Single worker                  |
| POST   | `/api/workers`               | Admin        | Add worker (form-data + photo) |
| PUT    | `/api/workers/:id`           | Admin        | Update worker                  |
| PATCH  | `/api/workers/:id/verify`    | Admin        | Toggle isVerified              |
| DELETE | `/api/workers/:id`           | Admin        | Delete worker                  |

### Job Routes

| Method | Endpoint       | Auth    | Description                    |
|--------|----------------|---------|--------------------------------|
| GET    | `/api/jobs`    | Public  | All jobs (newest first)        |
| GET    | `/api/jobs/:id`| Public  | Single job                     |
| POST   | `/api/jobs`    | Private | Post job (form-data + image)   |
| PUT    | `/api/jobs/:id`| Private | Update job                     |
| DELETE | `/api/jobs/:id`| Private | Delete job                     |

### Error Response Format

```json
{ "message": "Descriptive error message" }
```

All validation errors return **400**, auth errors **401**, forbidden **403**, not found **404**.

---

## 7. Data Models

### Worker
```js
{
  name:        String   // required
  skill:       String   // required (Plumber, Electrician, etc.)
  location:    String   // required
  phone:       String   // required
  isAvailable: Boolean  // default: true
  isVerified:  Boolean  // default: false (toggled by admin)
  rating:      Number   // 0–5, default: 0
  photo:       String   // URL path to uploaded image
  experience:  String   // free text
  createdAt:   Date     // auto
  updatedAt:   Date     // auto
}
```

### Job
```js
{
  title:        String   // required
  description:  String   // required
  location:     String   // required
  workingHours: String   // required (e.g. "9 AM – 5 PM")
  paymentType:  String   // enum: 'money' | 'food' | 'both'
  phone:        String   // required
  imageUrl:     String   // optional uploaded image path
  postedBy:     ObjectId // ref: User (optional)
  createdAt:    Date     // auto (used for time-ago display)
}
```

### User
```js
{
  name:     String   // required
  phone:    String   // required, unique
  password: String   // bcrypt-hashed (10 rounds)
  role:     String   // enum: 'client' | 'admin', default: 'client'
}
```

---

## 8. Authentication Flow

```
┌─────────────┐     POST /api/auth/login     ┌──────────────┐
│   Browser   │ ──────────────────────────► │    Server    │
│             │ ◄─── { token, user } ─────── │              │
│             │                              │  JWT signed  │
│ localStorage│                              │  (7d expiry) │
│  lwc_token  │                              └──────────────┘
│  lwc_user   │
└─────────────┘
       │
       │  Every subsequent API request:
       │  Authorization: Bearer <token>
       ▼
┌──────────────────────────────┐
│     authMiddleware.js        │
│  jwt.verify(token, secret)   │
│  req.user = User.findById()  │
└──────────────────────────────┘
       │
       ├── /api/workers (POST/PUT/PATCH/DELETE)
       │       └── adminMiddleware: req.user.role === 'admin'
       │
       └── /api/jobs (POST/PUT/DELETE)
               └── any authenticated user
```

**Token refresh:** On page load, `AuthContext` calls `GET /api/auth/me` to
validate the stored token. If invalid/expired → clears localStorage → user
is treated as guest.

---

## 9. Admin Workflow

### Full Admin Session (step by step)

```
1. Open http://localhost:5173/login
2. Enter: phone=9999999999, password=admin123
3. Click Sign In
   → Toast: "Welcome back, Admin!"
   → Redirect: /admin

4. View Admin Dashboard
   → Stats: Total Workers | Verified | Available | Unverified
   → Table: all workers with search bar

5. ADD a worker:
   → Click [+ Add Worker]
   → Fill modal: Name, Skill (dropdown), Phone, Location, Rating, Availability
   → Click [Add Worker]
   → Toast: "Worker added successfully!"
   → Table refreshes with new row

6. VERIFY a worker:
   → Find unverified worker (shows grey "✓ Verify" button)
   → Click [✓ Verify]
   → Button turns green "✅ Verified"
   → Stats: Verified count +1, Unverified count -1

7. EDIT a worker:
   → Click pencil ✏ icon on any row
   → Modal opens pre-filled with existing data
   → Make changes → Click [Update Worker]
   → Toast: "Worker updated successfully!"

8. DELETE a worker:
   → Click trash 🗑 icon on any row
   → Browser confirm: "Delete 'Name'? This cannot be undone."
   → Click OK → row disappears → Toast: "Name deleted"

9. SEARCH in table:
   → Type name / skill / city in search bar
   → Table filters live (client-side, no API call)

10. Logout:
    → Click [→ Logout] in navbar
    → Clears localStorage
    → Redirect to /
    → Navbar reverts to Sign In / Register
```

---

## 10. Client Workflow

### Finding a Worker

```
1. Open http://localhost:5173 (no login needed)

2. Browse the worker grid:
   → 8 seeded workers load automatically

3. Filter by skill:
   → Click "Plumber" → shows only plumbers
   → Click "Electrician" → switches to electricians
   → Click "All" → reset

4. Search by location:
   → Type "Mumbai" in search bar → click Search
   → Only Mumbai workers shown
   → Click [Clear filters] to reset

5. Contact a worker:
   → Click [📞 Call Now] on any card
   → Opens phone dialer with worker's number (tel: link)
```

### Posting a Job

```
1. Register or Login (phone + password)

2. Navigate to /post-job via navbar

3. Fill the form:
   Job Title:     "Need a plumber urgently"
   Description:   "Pipe burst in bathroom, need immediate repair"
   Location:      "Andheri West, Mumbai"
   Working Hours: "ASAP, 2–3 hours"
   Payment Type:  [💵 Money]  ← click the card
   Phone:         "9876543210"
   Image:         (optional — drag/click to upload)

4. Click [Post Job]
   → Spinner shows during upload
   → Toast: "Job posted successfully!"
   → Redirects to /jobs after 2.5 seconds

5. Job appears on /jobs as a card:
   → Title · Description preview · "Just now" timestamp
   → Payment badge · Working hours badge · Location
   → [📞 Contact Employer] button
```

---

## 11. File Structure

```
Local Worker Connector/
│
├── README.md                   ← Quick setup guide
├── WORKFLOW.md                 ← This file
├── .gitignore
│
├── server/
│   ├── server.js               ← Express app entry point
│   ├── seed.js                 ← DB seeder (admin + 8 workers)
│   ├── package.json
│   ├── .env                    ← MONGO_URI, JWT_SECRET, PORT
│   ├── .env.example            ← Template
│   │
│   ├── models/
│   │   ├── User.js             ← phone, password(hashed), role
│   │   ├── Worker.js           ← name, skill, location, phone, rating...
│   │   └── Job.js              ← title, description, paymentType...
│   │
│   ├── controllers/
│   │   ├── authController.js   ← register, login, getMe
│   │   ├── workerController.js ← CRUD + toggleVerification
│   │   └── jobController.js    ← CRUD
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── workerRoutes.js     ← includes multer upload config
│   │   └── jobRoutes.js        ← includes multer upload config
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js   ← protect (JWT verify)
│   │   ├── adminMiddleware.js  ← adminOnly (role check)
│   │   └── errorHandler.js     ← global error formatter
│   │
│   ├── utils/
│   │   └── generateToken.js    ← jwt.sign(id, role, 7d)
│   │
│   └── uploads/                ← auto-created, stores images
│
└── client/
    ├── index.html              ← Inter font, SEO meta
    ├── vite.config.js          ← proxy /api and /uploads → :5000
    ├── tailwind.config.js      ← custom colors, animations
    ├── postcss.config.js
    ├── package.json
    │
    └── src/
        ├── main.jsx            ← BrowserRouter + Toaster
        ├── App.jsx             ← Routes + AuthProvider
        ├── index.css           ← Tailwind + .btn-primary, .card, .input-field
        │
        ├── api/
        │   ├── axios.js        ← base instance + JWT interceptor + 401 handler
        │   ├── workers.js      ← getWorkers, createWorker, updateWorker...
        │   ├── jobs.js         ← getJobs, createJob, deleteJob...
        │   └── auth.js         ← register, login, getMe
        │
        ├── context/
        │   └── AuthContext.jsx ← user state, loginUser(), logoutUser()
        │
        ├── components/
        │   ├── Navbar.jsx          ← sticky glassmorphism, mobile hamburger
        │   ├── WorkerCard.jsx      ← avatar, skill badge, stars, Call Now
        │   ├── JobCard.jsx         ← payment badge, time-ago, Contact
        │   ├── LoadingSpinner.jsx  ← sm/md/lg + fullPage overlay variant
        │   └── ProtectedRoute.jsx  ← auth guard + adminOnly prop
        │
        └── pages/
            ├── HomePage.jsx        ← hero + stats + filters + grid + CTA
            ├── JobsPage.jsx        ← job grid + empty state
            ├── PostJobPage.jsx     ← form + image preview + success animation
            ├── LoginPage.jsx       ← phone/password + show/hide + demo hint
            ├── RegisterPage.jsx    ← name/phone/password/confirm
            └── AdminDashboard.jsx  ← stats + table + modal + verify/edit/delete
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL WORKER CONNECTOR                       │
├──────────┬──────────────────────────────────────────────────────┤
│  URL     │  http://localhost:5173                               │
│  API     │  http://localhost:5000/api                           │
├──────────┼──────────────────────────────────────────────────────┤
│  Admin   │  phone: 9999999999  │  password: admin123            │
├──────────┼──────────────────────────────────────────────────────┤
│  Pages   │  /          Home (worker search + grid)              │
│          │  /jobs      Job listings                             │
│          │  /post-job  Post a job (login required)              │
│          │  /login     Sign in                                  │
│          │  /register  Create account                           │
│          │  /admin     Admin dashboard (admin only)             │
├──────────┼──────────────────────────────────────────────────────┤
│  Start   │  cd server  → npm run dev   (port 5000)              │
│          │  cd client  → npm run dev   (port 5173)              │
│  Seed    │  cd server  → npm run seed  (first time only)        │
└──────────┴──────────────────────────────────────────────────────┘
```
