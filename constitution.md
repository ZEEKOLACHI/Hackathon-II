# Todo App Constitution

## Project Identity
**Name:** Evolution of Todo
**Phase:** All seven phases completed
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
| Frontend | Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, next-themes, sonner |
| Backend | FastAPI, SQLModel, Python 3.12+ |
| Database | Neon Serverless PostgreSQL |
| Auth | Better Auth with JWT |

### 6. API Security
- All task endpoints require JWT authentication
- Backend validates JWT and extracts user_id
- Tasks are filtered by authenticated user
- No user can access another user's tasks

### 7. Phase III Requirements

| Feature | Description |
|---------|-------------|
| Natural Language Input | Parse "Buy milk tomorrow 5pm" into structured task |
| Smart Suggestions | AI-generated follow-up task recommendations |
| Auto-Categorization | Automatic task tagging/categorization |
| Daily Summary | AI-generated task overview and prioritization |
| Priority & Due Dates | Extended task model with scheduling |

### 8. AI Technology

| Component | Technology |
|-----------|------------|
| AI Provider | Google Gemini API |
| Model | gemini-2.0-flash |

### 9. Phase VII Requirements (completed)

| Feature | Description |
|---------|-------------|
| shadcn/ui | 17 Radix UI component primitives with Tailwind CSS |
| Dark Mode | Light/dark/system theme toggle via next-themes |
| Toast Notifications | User action feedback via sonner |
| Loading Skeletons | Skeleton cards instead of "Loading..." text |
| Task Edit Dialog | Dialog form for editing task details |
| Delete Confirmation | AlertDialog with destructive action confirmation |
| Search | Ctrl+K shortcut, client-side title filtering |
| Navbar | Sticky nav with logo, search, theme toggle, user dropdown |
| Empty States | Reusable component for no tasks / no search results |
| Landing Page | Hero with gradient branding and feature cards |

### 10. Quality Standards
- All user inputs must be validated
- Graceful error handling with proper HTTP status codes
- Consistent API response format
- Responsive UI design
- Toast notifications for all user actions
- Loading states for all async operations
