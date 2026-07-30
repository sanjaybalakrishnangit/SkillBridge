# 🤝 Skill Bridge – Local Worker Connector

![Status](https://img.shields.io/badge/Status-Active-success)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933)
![Database](https://img.shields.io/badge/Database-MongoDB-47A248)
![License](https://img.shields.io/badge/License-Academic-orange)

A full-stack **MERN** web application that connects **daily wage workers** (plumbers, electricians, carpenters, painters, drivers, gardeners, etc.) with clients looking for reliable local services.

The platform allows administrators to verify workers, enables clients to browse skilled workers, and provides job posting functionality for employers.

This project is being developed as a **Final Year B.Tech Information Technology Project** and serves as the foundation for an IEEE research-based enhancement with intelligent worker recommendation and smart service matching.

---

# 📖 Table of Contents

- Project Overview
- Features
- Technology Stack
- System Architecture
- Project Structure
- Installation
- Environment Variables
- Running the Project
- Demo Credentials
- API Overview
- Security
- Future Enhancements
- Documentation
- Development Team
- License

---

# 🎯 Project Overview

Skill Bridge aims to bridge the gap between skilled workers and customers by providing a modern digital platform where users can:

- Find verified local workers
- Filter workers by skill and location
- Contact workers directly
- Post job requirements
- Allow administrators to verify worker profiles
- Maintain secure authentication using JWT

The project follows a clean MERN architecture with separate frontend and backend applications.

---

# ✨ Features

## Authentication

- JWT Authentication
- Password Hashing using bcrypt
- Secure Login
- User Registration
- Protected Routes

---

## Worker Management

- Add Workers
- Update Worker Details
- Delete Workers
- Verify Workers
- Upload Worker Photos
- Worker Availability Status
- Worker Ratings

---

## Job Management

- Post Job Requirement
- Browse Jobs
- Contact Employer
- Image Upload Support

---

## Search & Filtering

- Search by Location
- Filter by Skill
- Responsive Worker Cards

---

## Admin Dashboard

- Worker Statistics
- Search Workers
- Verify Workers
- Edit Workers
- Delete Workers
- Add New Workers

---

## User Experience

- Responsive Design
- Premium Industrial UI
- Toast Notifications
- Loading Indicators
- Image Preview
- Mobile Friendly

---

# 🛠 Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS v3 |
| Backend | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| Password Hashing | bcryptjs |
| Forms | React Hook Form |
| HTTP Client | Axios |
| Notifications | React Hot Toast |
| Icons | React Icons |
| File Upload | Multer |

---

# 🏗 System Architecture

```
React + Vite
      │
      │ HTTP Requests
      ▼
Express.js REST API
      │
      ▼
MongoDB Database
```

The frontend communicates with the Express REST API, which handles authentication, business logic, and database operations.

---

# 📂 Project Structure

```
SkillBridge/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
├── PROJECT_DOCUMENTATION.md
├── README.md
└── .gitignore
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone <repository-url>
cd SkillBridge
```

---

## Backend Setup

```bash
cd server
npm install
```

---

## Frontend Setup

```bash
cd ../client
npm install
```

---

# ⚙ Environment Variables

Create a `.env` file inside the **server** folder.

```
PORT=5000

MONGO_URI=mongodb://localhost:27017/local-worker-connector

JWT_SECRET=your_secret_key

NODE_ENV=development
```

---

# ▶ Running the Project

## Start Backend

```bash
cd server
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

## Start Frontend

```bash
cd client
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🌱 Seed Database

```bash
cd server

npm run seed
```

This creates

- Admin Account
- Sample Workers
- Initial Database Records

---

# 🔑 Demo Credentials

| Role | Phone | Password |
|------|---------|----------|
| Admin | 9999999999 | admin123 |

---

# 📡 API Overview

## Authentication

```
POST   /api/auth/register

POST   /api/auth/login

GET    /api/auth/me
```

---

## Workers

```
GET     /api/workers

GET     /api/workers/:id

POST    /api/workers

PUT     /api/workers/:id

PATCH   /api/workers/:id/verify

DELETE  /api/workers/:id
```

---

## Jobs

```
GET     /api/jobs

GET     /api/jobs/:id

POST    /api/jobs

PUT     /api/jobs/:id

DELETE  /api/jobs/:id
```

---

# 🔒 Security

- JWT Authentication
- bcrypt Password Hashing
- Protected Routes
- Admin Authorization
- Input Validation
- Secure API Middleware
- Image Upload Validation

---

# 🚀 Planned IEEE Research Enhancements

The following features are planned as part of the final-year research contribution:

- AI-Based Worker Recommendation
- Trust Score System
- Hyperlocal Worker Matching
- Explainable Recommendations
- Booking Management
- Review & Rating Improvements
- Smart Search
- Cloud Image Storage
- Real-time Notifications

---

# 📚 Documentation

Complete technical documentation is available in

```
PROJECT_DOCUMENTATION.md
```

This document contains:

- Complete Architecture
- API Documentation
- Folder Structure
- Authentication Flow
- Database Models
- Controller Documentation
- Development Workflow
- Project Status
- Future Development Plan

---

# 👨‍💻 Development Team

**Technical Lead**

- Sanjay Balakrishnan

**Frontend Developer**

- Team Member

**Backend Developer**

- Team Member

---

# 🤝 Contributing

This project follows a feature branch workflow.

1. Create a new branch from `main`
2. Complete your assigned task
3. Commit your changes
4. Push your branch
5. Create a Pull Request
6. Wait for review before merging

---

# 📈 Project Status

Current Progress

- Frontend UI – Nearly Complete
- Backend APIs – Stable
- Authentication – Complete
- Worker Management – Complete
- Job Management – Complete
- Admin Dashboard – Complete
- IEEE Research Features – In Progress

---

# 📄 License

This project is developed for **academic and educational purposes** as part of the B.Tech Information Technology curriculum.

---

# ⭐ Acknowledgements

- React
- Node.js
- Express.js
- MongoDB
- Tailwind CSS
- Vite
- JWT
- Mongoose
- React Hook Form
- React Hot Toast
- Open Source Community

---

## 📞 Contact

**Sanjay Balakrishnan**

B.Tech – Information Technology

MNM Jain Engineering College

GitHub: https://github.com/sanjaybalakrishnangit