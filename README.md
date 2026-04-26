# 🤝 Local Worker Connector

A full-stack MERN application connecting daily wage workers (plumbers, electricians, painters, etc.) with clients. Workers can be registered by family members or admins. Clients can browse workers or post job requirements.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| File Upload | Multer (local storage) |
| UI Libraries | React Router v6, React Hook Form, React Hot Toast, React Icons |

---

## 🗂️ Project Structure

```
Local Worker Connector/
├── server/                  # Express API
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth, Admin, Error handlers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── utils/               # Token generator
│   ├── uploads/             # Uploaded images (auto-created)
│   ├── seed.js              # DB seeder
│   ├── server.js            # Entry point
│   └── .env                 # Environment variables
└── client/                  # React frontend
    └── src/
        ├── api/             # Axios API functions
        ├── components/      # Shared UI components
        ├── context/         # Auth context
        └── pages/           # Route pages
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

---

### 1. Backend Setup

```bash
cd server
npm install
```

Edit `.env` (already created) and set your MongoDB URI if needed:
```
MONGO_URI=mongodb://localhost:27017/local-worker-connector
JWT_SECRET=lwc_super_secret_jwt_key_change_in_production
PORT=5000
```

**Seed the database** (creates admin user + 8 sample workers):
```bash
npm run seed
```

**Start the server:**
```bash
npm run dev      # development (with nodemon)
# or
npm start        # production
```

Server runs at: **http://localhost:5000**

---

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔑 Default Credentials (after seeding)

| Role | Phone | Password |
|------|-------|----------|
| Admin | `9999999999` | `admin123` |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/auth/me` | Private | Get current user |

### Workers
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/workers` | Public | Get all workers (filter by `?skill=&location=`) |
| GET | `/api/workers/:id` | Public | Get single worker |
| POST | `/api/workers` | Admin | Add a worker |
| PUT | `/api/workers/:id` | Admin | Update a worker |
| PATCH | `/api/workers/:id/verify` | Admin | Toggle verification |
| DELETE | `/api/workers/:id` | Admin | Delete a worker |

### Jobs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/jobs` | Public | Get all job posts |
| GET | `/api/jobs/:id` | Public | Get single job |
| POST | `/api/jobs` | Private | Post a new job |
| PUT | `/api/jobs/:id` | Private | Update a job |
| DELETE | `/api/jobs/:id` | Private | Delete a job |

---

## 🎨 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Browse workers with search and skill filters |
| Jobs | `/jobs` | View all job postings |
| Post Job | `/post-job` | Submit a job requirement (login required) |
| Login | `/login` | Sign in |
| Register | `/register` | Create account |
| Admin | `/admin` | Manage workers (admin only) |

---

## 🔒 Security

- Passwords hashed with **bcrypt (10 rounds)**
- Routes protected with **JWT Bearer tokens**
- Admin routes guarded by role check middleware
- File upload limited to **images only, max 5 MB**
- Input validation on both frontend (React Hook Form) and backend

---

## 🛠️ Troubleshooting

**MongoDB connection failed:** Make sure MongoDB is running locally or update `MONGO_URI` in `.env`.

**Image not loading after upload:** Ensure the `server/uploads/` directory exists (it's auto-created on server start).

**401 Unauthorized:** Your token may have expired — log out and log back in.
