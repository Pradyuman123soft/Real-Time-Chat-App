# Deployment Guide for Real-Time Chat Application

## Project structure
- `Bcakend-for-websocket/` — Node.js backend for socket server
- `client/` — Next.js app with API routes, MongoDB, and authentication

## Recommended hosting
1. Frontend: Vercel
2. Backend websocket service: Render or Railway
3. Database: MongoDB Atlas

> This is the cleanest production setup because the Next.js app is a standalone frontend/backend app, while socket.io is a separate real-time service.

---

## 1. Backend deployment (`Bcakend-for-websocket`)

### Required changes already made
- `server.js` now uses `dotenv` and `process.env.PORT`
- CORS origin is controlled by `FRONTEND_URL`
- `package.json` includes a `start` script

### Environment variables for backend
- `PORT` (optional, default: `3001`)
- `FRONTEND_URL` (e.g. `https://your-frontend-domain.com`)

### Deploy on Render.com / Railway.app
- Create a new Web Service
- Set the root directory to `Bcakend-for-websocket`
- Build command: `npm install`
- Start command: `npm start`
- Add env var `FRONTEND_URL` pointing to your deployed frontend URL

---

## 2. Frontend deployment (`client`)

### Required config already made
- `client/hooks/useSocket.js` now reads `NEXT_PUBLIC_SOCKET_URL`
- `client/.env.example` contains required variables

### Environment variables for frontend
- `MONGODB_URI` — MongoDB Atlas connection string
- `NEXT_PUBLIC_URL` — frontend public URL
- `NEXT_PUBLIC_SOCKET_URL` — backend socket server URL
- `NEXTAUTH_URL` — frontend public URL
- `NEXTAUTH_SECRET` — secret for NextAuth
- `JWT_SECRET` — secret for JWT signing
- `GITHUB_ID` / `GITHUB_SECRET` — optional GitHub provider credentials if used

### Deploy on Vercel
- Connect repository
- Set project root to `client`
- Build command: `npm run build`
- Output directory: [leave blank]
- Start command: `npm start` (Vercel handles this automatically)

### If using Render instead of Vercel
- Use a Web Service for `client`
- Build command: `npm install && npm run build`
- Start command: `npm start`

---

## 3. Database

Use MongoDB Atlas:
- Create a free cluster
- Create a database user and password
- Add the IP allowlist for your app or use `0.0.0.0/0` during testing
- Set `MONGODB_URI` in frontend env vars

---

## 4. Local preview before deploying

### Backend
```bash
cd Bcakend-for-websocket
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Then open `http://localhost:3000`.

---

## 5. Notes
- Keep secrets out of source control. Use `.env` locally and env vars in your host dashboard.
- The frontend uses `NEXT_PUBLIC_SOCKET_URL` to connect to the socket server.
- The backend allows CORS only from `FRONTEND_URL`.
