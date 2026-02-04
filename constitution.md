# Todo App Constitution

## Project Identity
**Name:** Evolution of Todo
**Phase:** Phase II - Full-Stack Web Application
**Approach:** Spec-Driven Development with Claude Code

## Core Principles

### 1. Spec-First Development
- No code is written manually
- All features must have a specification before implementation
- Specs are refined until Claude Code generates correct output
- All spec iterations are preserved in `specs/history/`

### 2. Clean Code Standards
- Follow language-specific style guides (PEP 8 for Python, ESLint for TypeScript)
- Use type hints/types for all functions
- Keep functions small and focused (single responsibility)
- Use meaningful variable and function names

### 3. Monorepo Structure
```
hackathon-todo/
├── constitution.md
├── CLAUDE.md
├── specs/
│   ├── phase1-console-app.md
│   ├── phase2-fullstack-app.md
│   └── history/
├── frontend/           # Next.js app
│   ├── CLAUDE.md
│   └── ...
├── backend/            # FastAPI app
│   ├── CLAUDE.md
│   └── ...
├── src/todo/           # Phase I console app
└── README.md
```

### 4. Phase II Requirements

| Feature | Description |
|---------|-------------|
| User Auth | Sign up/sign in with Better Auth |
| Task CRUD | Create, read, update, delete tasks |
| Task Complete | Toggle task completion |
| User Isolation | Each user sees only their tasks |
| Persistent Storage | Neon PostgreSQL database |

### 5. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15+, TypeScript, Tailwind CSS |
| Backend | FastAPI, SQLModel, Python 3.12+ |
| Database | Neon Serverless PostgreSQL |
| Auth | Better Auth with JWT |

### 6. API Security
- All task endpoints require JWT authentication
- Backend validates JWT and extracts user_id
- Tasks are filtered by authenticated user
- No user can access another user's tasks

### 7. Quality Standards
- All user inputs must be validated
- Graceful error handling with proper HTTP status codes
- Consistent API response format
- Responsive UI design
