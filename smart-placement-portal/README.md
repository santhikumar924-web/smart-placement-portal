# SmartPlacement Portal — Setup Guide

## What you need to install first (one time only)

1. **Node.js** → https://nodejs.org  (download LTS version, install it)
2. **MongoDB Community** → https://www.mongodb.com/try/download/community  (install and run it)
3. **VS Code** → https://code.visualstudio.com  (to open and edit files)

---

## Folder structure you get

```
smart-placement-portal/
├── backend/         ← Node.js + Express API
│   ├── models/      ← Database schemas
│   ├── routes/      ← API endpoints
│   ├── middleware/  ← Auth middleware
│   ├── server.js
│   ├── .env         ← Your config (edit this!)
│   └── package.json
└── frontend/        ← React app
    ├── src/
    │   ├── pages/   ← Home, Jobs, Dashboard, Admin, Login, Register
    │   ├── components/ ← Navbar, JobCard
    │   ├── App.js
    │   ├── App.css
    │   ├── api.js
    │   └── AuthContext.js
    └── package.json
```

---

## STEP 1 — Set up the backend

Open a terminal (Command Prompt or VS Code terminal).

```bash
# Go into the backend folder
cd smart-placement-portal/backend

# Install all packages
npm install

# Create the uploads folder (for resumes)
mkdir uploads
```

Now open `backend/.env` in VS Code and check it looks like this:
```
MONGO_URI=mongodb://localhost:27017/smartplacement
JWT_SECRET=mysecretkey123changethis
PORT=5000
```

Start the backend:
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

---

## STEP 2 — Set up the frontend

Open a **second terminal** (keep the backend running in the first one).

```bash
# Go into the frontend folder
cd smart-placement-portal/frontend

# Install all packages
npm install

# Start the React app
npm start
```

Your browser will open at **http://localhost:3000** automatically.

---

## STEP 3 — Create your first Admin account

1. Go to http://localhost:3000/register
2. Fill in your details
3. For **Role**, select **"Admin (placement officer)"**
4. Click Register → you'll be taken to the Admin Panel

Then register another account with Role = **Student** to test the student side.

---

## How it all works

| What | Where |
|------|-------|
| Student registers/logs in | `/register`, `/login` |
| Student browses jobs | `/jobs` |
| Student applies | `/jobs/:id` → Apply form |
| Student tracks status | `/dashboard` |
| Admin posts jobs | `/admin` → Post job form |
| Admin views all applicants | `/admin` → Applications tab |
| Admin accepts/rejects | `/admin` → Action buttons |

---

## API endpoints (for reference / Postman testing)

```
POST   /api/auth/register         Register new user
POST   /api/auth/login            Login
GET    /api/auth/me               Get logged-in user

GET    /api/jobs                  Get all active jobs (public)
GET    /api/jobs/:id              Get one job
POST   /api/jobs                  Post new job (admin only)
DELETE /api/jobs/:id              Remove job (admin only)

POST   /api/applications/apply    Student applies to a job
GET    /api/applications/mine     Student's own applications
GET    /api/applications          All applications (admin only)
PATCH  /api/applications/:id/status  Update status (admin only)
```

---

## Common problems & fixes

**"Cannot connect to MongoDB"**
→ Make sure MongoDB is running. On Windows: open Services, find MongoDB, click Start.
→ Or run in terminal: `net start MongoDB`

**"Port 5000 already in use"**
→ Change PORT in `.env` to `5001` and restart backend.

**Frontend shows blank page**
→ Make sure backend is running first, then restart frontend.

**"Module not found" error**
→ Run `npm install` again inside the folder that has the error.

---

## Tech stack summary

- **Frontend**: React.js, React Router, Axios, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (JSON Web Tokens) + bcrypt password hashing
- **File uploads**: Multer
