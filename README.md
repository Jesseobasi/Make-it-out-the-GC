# Best Day Scheduler

Best Day Scheduler is a production-ready, mobile-first scheduling tool for groups. A user creates a temporary event, shares a short public link, and friends mark each day as `yes`, `maybe`, or `no`. The app ranks the best day automatically, shows a heatmap, and expires each event after 7 days.

## Active Structure

```text
best-day-scheduler/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
  frontend/
    src/
      components/
      hooks/
      pages/
      services/
      utils/
```

The active application lives in `backend/` and `frontend/`.

## Features

- Public event creation with no login
- Short share links at `/e/:shortId`
- Internal UUID plus unique short ID per event
- 7-day expiration window with blocked writes after expiry
- Duplicate-name overwrite behavior to reduce spam
- Live results polling every 8 seconds
- Ranked day scoring: `yes = 1`, `maybe = 0.5`, `no = 0`
- Heatmap visualization and empty-state handling
- Atlas-ready MongoDB configuration
- Daily cleanup job plus MongoDB TTL cleanup on `expiresAt`

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Deployment targets: Vercel for the frontend, Render or Railway for the backend

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create environment files:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. Start MongoDB locally or point `MONGODB_URI` at MongoDB Atlas.

4. Run the app:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173`.

## Environment Variables

### Backend

- `PORT=5001`
- `MONGODB_URI=mongodb://127.0.0.1:27017/best-day-scheduler`
- `ALLOWED_ORIGINS=http://localhost:5173`
- `CLEANUP_INTERVAL_HOURS=24`

### Frontend

- `VITE_API_BASE_URL=http://localhost:5001/api`

In local development, the frontend also proxies `/api` to the backend through Vite.

## API

- `POST /api/event`
- `GET /api/event/:shortId`
- `POST /api/event/:shortId/respond`
- `GET /api/event/:shortId/results`

## Expiration and Cleanup

- Each event gets `createdAt`, `expiresAt`, and `isExpired`.
- Every read or write request refreshes expiration state before responding.
- Expired events still allow read access for results until MongoDB removes them.
- New submissions to expired events return `410 Gone`.
- A background cleanup timer runs daily.
- The `expiresAt` field also uses a MongoDB TTL index for automatic deletion.

## Deployment

### Frontend on Vercel

1. Create a new Vercel project using the `frontend/` directory as the root.
2. Set `VITE_API_BASE_URL` to your deployed backend URL plus `/api`.
   Example: `https://best-day-scheduler-api.onrender.com/api`
3. Build command: `npm run build`
4. Output directory: `dist`
5. `frontend/vercel.json` already includes an SPA rewrite for React Router.

### Backend on Render

1. Create a new Web Service pointing at this repo.
2. Set the root directory to `backend/`.
3. Build command: `npm install`
4. Start command: `npm run start`
5. Add environment variables:
   `MONGODB_URI`, `ALLOWED_ORIGINS`, and optionally `PORT` and `CLEANUP_INTERVAL_HOURS`
6. Update `ALLOWED_ORIGINS` to your Vercel frontend URL.

A starter [render.yaml](/Users/jesseobasi/Desktop/bad-scheduler/render.yaml) is included.

### Backend on Railway

1. Create a new service from this repo.
2. Point the service root at `backend/`.
3. Set the start command to `npm run start`.
4. Add `MONGODB_URI` and `ALLOWED_ORIGINS`.
5. Set `ALLOWED_ORIGINS` to your frontend domain.

## Notes

- Dates are stored as ISO `YYYY-MM-DD` strings.
- The browser timezone is detected for display only.
- Missing day selections are submitted as `no` so every day still ranks cleanly.
- Partial availability is supported.
