# Claude Code Instructions

## Project Overview
This is a **Spec-Driven Development** project for Hackathon II.
Currently in **Phase II**: Full-Stack Web Application.

## Key Constraint
**No manual code writing allowed.** All implementation must be generated from specifications.

## Project Structure
- `/constitution.md` - Project principles and rules
- `/specs/` - Feature specifications (read these first)
- `/specs/history/` - Previous spec iterations
- `/frontend/` - Next.js application
- `/backend/` - FastAPI application
- `/src/todo/` - Phase I console app (completed)

## Spec-Kit Structure
- `/specs/phase2-fullstack-app.md` - Current phase spec
- `/specs/phase1-console-app.md` - Phase I spec (completed)

## Development Workflow
1. Read the relevant spec from `/specs/`
2. Generate implementation based on spec
3. If output is incorrect, spec will be refined
4. Preserve spec iterations in `/specs/history/`

## Phase II Requirements
- Next.js frontend with Better Auth
- FastAPI backend with SQLModel
- Neon PostgreSQL database
- JWT authentication between frontend and backend
- All 5 task CRUD operations

## Commands
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && uvicorn app.main:app --reload`
- Both: `docker-compose up`

## File References
- Frontend guidelines: `/frontend/CLAUDE.md`
- Backend guidelines: `/backend/CLAUDE.md`
- API spec: `/specs/phase2-fullstack-app.md`
