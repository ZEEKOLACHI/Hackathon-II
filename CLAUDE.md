# Claude Code Instructions

## Project Overview
This is a **Spec-Driven Development** project for Hackathon II.
Currently in **Phase IV**: Local Kubernetes Deployment.

## Key Constraint
**No manual code writing allowed.** All implementation must be generated from specifications.

## Project Structure
- `/constitution.md` - Project principles and rules
- `/specs/` - Feature specifications (read these first)
- `/specs/history/` - Previous spec iterations
- `/frontend/` - Next.js application
- `/backend/` - FastAPI application
- `/k8s/` - Kubernetes manifests
- `/docker-compose.yml` - Local multi-service dev compose
- `/src/todo/` - Phase I console app (completed)

## Spec-Kit Structure
- `/specs/phase4-local-k8s.md` - Current phase spec
- `/specs/phase3-ai-integration.md` - Phase III spec (completed)
- `/specs/phase2-fullstack-app.md` - Phase II spec (completed)
- `/specs/phase1-console-app.md` - Phase I spec (completed)

## Development Workflow
1. Read the relevant spec from `/specs/`
2. Generate implementation based on spec
3. If output is incorrect, spec will be refined
4. Preserve spec iterations in `/specs/history/`

## Phase IV Requirements
- Dockerfiles for backend (Python 3.12-slim) and frontend (multi-stage Node 18 Alpine)
- docker-compose.yml for local smoke testing (postgres + backend + frontend)
- Kubernetes manifests in `/k8s/` for Minikube deployment
- In-cluster PostgreSQL with PersistentVolumeClaim
- Backend liveness/readiness probes on `/health`
- Secrets and ConfigMap for environment variable management
- Frontend exposed via NodePort service

## Commands
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && uvicorn app.main:app --reload`
- Docker Compose: `docker-compose up --build`
- K8s deploy: `kubectl apply -f k8s/`
- K8s access: `minikube service frontend-service -n todo-app`

## Environment Variables
```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:3000
```

## File References
- Frontend guidelines: `/frontend/CLAUDE.md`
- Backend guidelines: `/backend/CLAUDE.md`
- API spec: `/specs/phase2-fullstack-app.md`
- K8s deployment spec: `/specs/phase4-local-k8s.md`
