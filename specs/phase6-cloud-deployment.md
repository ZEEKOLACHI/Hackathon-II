# Phase VI Spec: Cloud Deployment (Vercel + Render)

## Overview
Deploy the todo application to the cloud using free-tier services: **Vercel** for the Next.js frontend and **Render** for the FastAPI backend + PostgreSQL database. Auto-deploy from GitHub on every push to `main`.

## Goals
- Deploy frontend to Vercel with automatic builds from GitHub
- Deploy backend to Render as a Web Service with free PostgreSQL
- Configure environment variables and secrets on each platform
- Update CORS and API URLs for production domains
- Enable HTTPS on both services (provided automatically)
- Auto-deploy on push to `main` (CD completes the CI/CD pipeline from Phase V)

## Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│     Vercel       │────▶│     Render       │────▶│  Render Postgres │
│  (Next.js App)   │     │  (FastAPI API)   │     │  (Free Tier DB)  │
│  HTTPS auto      │     │  HTTPS auto      │     │  256 MB / 1 GB   │
│  CDN + Edge      │     │  Docker deploy   │     │  90-day expiry   │
└──────────────────┘     └──────────────────┘     └──────────────────┘
       ▲                        ▲
       │                        │
       └────── GitHub Push ─────┘
              (auto-deploy)
```

## Platform Setup

### 1. Render — PostgreSQL Database

Create a free PostgreSQL instance on Render.

| Setting | Value |
|---------|-------|
| Name | `todo-db` |
| Database | `todo_db` |
| User | `todo_user` |
| Region | Oregon (US West) or nearest |
| Plan | Free (256 MB RAM, 1 GB storage) |

> **Note:** Render free-tier PostgreSQL expires after 90 days. Data must be backed up or the instance recreated before expiry.

**Output:** An Internal Database URL in the format:
```
postgresql://todo_user:<password>@<host>/todo_db
```

### 2. Render — Backend Web Service

Deploy the FastAPI backend as a Docker-based Web Service.

| Setting | Value |
|---------|-------|
| Name | `todo-backend` |
| Region | Same as database |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | Docker |
| Plan | Free (750 hours/month) |
| Health Check Path | `/health` |

#### Environment Variables on Render

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Internal Database URL from step 1 |
| `BETTER_AUTH_SECRET` | Generate a strong secret (32+ chars) |
| `GEMINI_API_KEY` | Your Gemini API key |
| `FRONTEND_URL` | `https://<your-app>.vercel.app` (set after Vercel deploy) |

#### Auto-Deploy
- Connect GitHub repository
- Auto-deploy on push to `main`
- Render builds using `backend/Dockerfile`

### 3. Vercel — Frontend

Deploy the Next.js frontend to Vercel.

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Node.js Version | 18.x |

#### Environment Variables on Vercel

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://todo-backend-<id>.onrender.com` |
| `BETTER_AUTH_SECRET` | Same secret as backend |
| `DATABASE_URL` | External Database URL from Render (for Better Auth SSR) |

#### Auto-Deploy
- Connect GitHub repository
- Auto-deploy on push to `main`
- Vercel detects Next.js and builds automatically

## Code Changes Required

### 1. Backend CORS Update — `backend/app/main.py`

Update CORS middleware to accept the Vercel production domain dynamically:

```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    settings.FRONTEND_URL,
],
```

Remove hardcoded extra localhost ports. The `settings.FRONTEND_URL` already handles the production URL.

### 2. Backend Database Engine — `backend/app/database.py`

Handle Render's PostgreSQL URL format. Render provides URLs starting with `postgres://` but SQLAlchemy requires `postgresql://`:

```python
from app.config import settings

database_url = settings.DATABASE_URL
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(database_url, echo=False)
```

Also set `echo=False` for production (no SQL logging).

### 3. Backend Production Config — `backend/app/config.py`

Add an environment toggle:

```python
class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    BETTER_AUTH_SECRET: str = os.getenv("BETTER_AUTH_SECRET", "")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"
```

### 4. Frontend API URL — Already Dynamic

The frontend already uses `NEXT_PUBLIC_API_URL` environment variable. No code changes needed — just set it in Vercel dashboard.

### 5. Frontend Standalone Output — Already Configured

`next.config.ts` already has `output: "standalone"`. No changes needed.

### 6. Render Build Configuration — `render.yaml` (Blueprint)

Create an optional Infrastructure-as-Code file at the project root:

```yaml
databases:
  - name: todo-db
    plan: free
    databaseName: todo_db
    user: todo_user

services:
  - type: web
    name: todo-backend
    runtime: docker
    dockerfilePath: ./backend/Dockerfile
    dockerContext: ./backend
    branch: main
    plan: free
    healthCheckPath: /health
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: todo-db
          property: connectionString
      - key: BETTER_AUTH_SECRET
        sync: false
      - key: GEMINI_API_KEY
        sync: false
      - key: FRONTEND_URL
        sync: false
      - key: ENVIRONMENT
        value: production
```

> **Note:** `sync: false` means the value must be set manually in the Render dashboard (for secrets).

## Deployment Steps

### Step 1: Create Render PostgreSQL
1. Go to [Render Dashboard](https://dashboard.render.com)
2. New → PostgreSQL
3. Configure with settings from table above
4. Copy the **Internal Database URL**

### Step 2: Deploy Backend to Render
1. New → Web Service
2. Connect your GitHub repo (`ZEEKOLACHI/Hackathon-II`)
3. Set Root Directory to `backend`
4. Set Runtime to Docker
5. Add environment variables from the table above
6. Set Health Check Path to `/health`
7. Click Create Web Service
8. Wait for deploy — note the service URL (`https://todo-backend-<id>.onrender.com`)

### Step 3: Deploy Frontend to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repo
3. Set Root Directory to `frontend`
4. Set Framework Preset to Next.js
5. Add environment variables from the table above (use the Render backend URL)
6. Click Deploy
7. Note the frontend URL (`https://<your-app>.vercel.app`)

### Step 4: Update Cross-References
1. Go back to Render → Backend service → Environment
2. Set `FRONTEND_URL` to the Vercel URL from step 3
3. Trigger a manual redeploy on Render

### Step 5: Verify End-to-End
1. Visit the Vercel URL in a browser
2. Sign up for a new account
3. Create, edit, complete, and delete tasks
4. Test AI features (parse, suggestions, summary)
5. Verify data persists after page refresh

## CI/CD Flow (Complete Pipeline)

```
Developer pushes to main
        │
        ▼
GitHub Actions CI (Phase V)
  ├── Backend Lint (ruff)
  ├── Backend Tests (pytest)
  ├── Frontend Lint (next lint)
  ├── Frontend Build (npm run build)
  └── Docker Build (verify images)
        │
        ▼ (all pass)
        │
   ┌────┴────┐
   ▼         ▼
Vercel      Render
(frontend)  (backend)
auto-deploy auto-deploy
```

## Free Tier Limitations

| Constraint | Vercel Free | Render Free |
|------------|-------------|-------------|
| Bandwidth | 100 GB/month | 100 GB/month |
| Build Minutes | 6,000 min/month | 750 hours/month |
| Serverless Functions | 100 GB-hrs | N/A |
| Database Storage | N/A | 1 GB |
| Database RAM | N/A | 256 MB |
| Database Expiry | N/A | 90 days |
| Custom Domain | Yes (free) | Yes (free) |
| HTTPS | Auto (Let's Encrypt) | Auto (Let's Encrypt) |
| Sleep on Inactivity | No | Yes (spins down after 15 min) |

> **Cold Start:** Render free-tier services spin down after 15 minutes of inactivity. First request after idle takes ~30-60 seconds. This is expected behavior on the free plan.

## Success Criteria

1. Frontend is live and accessible at the Vercel URL with HTTPS
2. Backend API responds at the Render URL (`/health` returns `{"status": "healthy"}`)
3. User can sign up, sign in, and manage tasks end-to-end on the live app
4. AI features (parse, suggestions, categorize, summary) work in production
5. Pushing to `main` triggers CI (GitHub Actions) → CD (Vercel + Render auto-deploy)
6. CORS correctly allows the Vercel frontend to call the Render backend
7. Data persists in Render PostgreSQL across deploys and browser sessions
