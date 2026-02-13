# Claude Code Instructions

## Project Overview
This is a **Spec-Driven Development** project for Hackathon II.
Currently in **Phase III**: AI Integration.

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
- `/specs/phase3-ai-integration.md` - Current phase spec
- `/specs/phase2-fullstack-app.md` - Phase II spec (completed)
- `/specs/phase1-console-app.md` - Phase I spec (completed)

## Development Workflow
1. Read the relevant spec from `/specs/`
2. Generate implementation based on spec
3. If output is incorrect, spec will be refined
4. Preserve spec iterations in `/specs/history/`

## Phase III Requirements
- Gemini API integration for AI features
- Natural language task parsing
- Smart task suggestions
- Auto-categorization
- Daily AI summary
- Extended task model (due_date, priority, categories)

## Commands
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && uvicorn app.main:app --reload`
- Both: `docker-compose up`

## Environment Variables (Phase III)
```
GEMINI_API_KEY=your-gemini-api-key
```

## File References
- Frontend guidelines: `/frontend/CLAUDE.md`
- Backend guidelines: `/backend/CLAUDE.md`
- API spec: `/specs/phase2-fullstack-app.md`
