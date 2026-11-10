# 🎬 Reel Tube

A full-stack YouTube-style video platform clone built for learning.

**Features:**
- User Register / Login (JWT)
- Home feed with categories
- Video watch page + HTML5 player
- Search
- Like / Dislike
- Comments
- Upload video (via URL)
- Channel page
- Basic recommendations (same category / same creator)
- Dark YouTube-like UI
- Responsive

## Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS |
| Backend   | Node.js + Express             |
| Database  | MongoDB (Mongoose)            |
| Auth      | JWT + bcrypt                  |

---

## 1. Local Setup (Step by Step)

### Prerequisites
- Node.js 18+ 
- MongoDB (local or free Atlas account)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env → put your MongoDB URI and JWT_SECRET
npm install
node seed.js          # optional: adds sample videos + users
npm run dev           # runs on http://localhost:5000
```

**Demo accounts after seed:**
- `admin@reeltube.com` / `password123`
- `creator@reeltube.com` / `password123`

### Frontend

```bash
cd frontend
npm install
# Optional: create .env
# VITE_API_URL=http://localhost:5000/api
npm run dev           # runs on http://localhost:5173
```

Open http://localhost:5173

---

## 2. Free Online Deploy (No Paid Service)

### A. Database – MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Build a Database → Free (M0)
3. Create cluster → Create database user (username + password)
4. Network Access → Add IP `0.0.0.0/0` (allow from anywhere)
5. Connect → Drivers → copy connection string
6. Replace `<password>` with your password

### B. Backend – Render (Free)

1. Push this whole repo to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Environment Variables:
   ```
   MONGODB_URI=your_atlas_connection_string
   JWT_SECRET=any_long_random_string
   CLIENT_URL=https://your-frontend.vercel.app
   PORT=10000
   ```
6. Deploy. Copy the backend URL (e.g. `https://reel-tube-api.onrender.com`)

> Note: Free Render services sleep after ~15 min idle. First request may take 30-60 sec.

### C. Frontend – Vercel (Free)

1. Go to https://vercel.com → New Project
2. Import the same GitHub repo
3. Root Directory: `frontend`
4. Framework: Vite
5. Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
6. Deploy

Done! Your Reel Tube is live.

---

## 3. Project Structure

```
reel-tube/
├── backend/
│   ├── models/          # User, Video, Comment
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── seed.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   └── ...
└── README.md
```

---

## 4. Important Notes

- Video upload uses **URL** (not real file upload to save free tier limits).  
  You can paste any public `.mp4` link.
- For real file upload later → add Cloudinary (free tier) + multer.
- This is an **educational** project. Not for production with real users/videos at scale.
- Recommendations are simple (same category / same user). Not ML-based.

---

## 5. Default Ports

- Backend: `5000`
- Frontend: `5173`

Happy coding!  
**Reel Tube** – Learn by building.

---

## New: Shorts / Reels Feature (Added)

Inspired by YouTube Shorts:

- Upload page has **"Upload as Short / Reel"** checkbox
- Dedicated **/shorts** page with vertical swipe-style feed
- Other users can see uploaded Shorts in the Shorts feed
- Home page shows a Shorts strip at the top
- Backend filters by `isShort: true/false`

After updating code, run `node seed.js` again to get sample Shorts.
