# Evolution of Todo - Hackathon II

A todo application evolving from console app to AI-powered task manager using **Spec-Driven Development**. Each phase builds on the last — from CLI to full-stack to intelligent task management powered by Google Gemini.

## Current Phase: Phase III - AI Integration

## Features

### Phase I - Console App
- Add, list, complete, and delete tasks from the terminal
- Persistent JSON file storage
- Filter by completion status

### Phase II - Full-Stack Web App
- User authentication (sign up / sign in) with JWT
- Task CRUD operations via REST API
- Task completion toggle
- Filter tasks by status
- Persistent storage with Neon PostgreSQL

### Phase III - AI Integration
- **Natural language task input** — type tasks in plain English, AI extracts title, due date, and priority
- **Smart suggestions** — AI analyzes existing tasks and recommends follow-ups
- **Auto-categorization** — automatically tag tasks with relevant categories
- **Daily AI summary** — get a prioritized overview of your day with stats
- Extended task model with `due_date`, `priority`, and `categories` fields

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | FastAPI, SQLModel, Python 3.12+ |
| Database | Neon Serverless PostgreSQL |
| Auth | JWT (custom implementation) |
| AI | Google Gemini API (gemini-2.0-flash) |

## Project Structure

```
├── constitution.md              # Project principles
├── CLAUDE.md                    # Claude Code instructions
├── specs/                       # Feature specifications
│   ├── phase1-console-app.md
│   ├── phase2-fullstack-app.md
│   ├── phase3-ai-integration.md
│   └── history/
├── frontend/                    # Next.js app
│   ├── app/
│   │   ├── auth/               # Sign in / Sign up pages
│   │   ├── dashboard/          # Main dashboard
│   │   └── api/auth/           # Auth API routes
│   ├── components/
│   │   ├── SmartTaskForm.tsx   # AI-powered natural language input
│   │   ├── Suggestions.tsx     # AI task suggestions panel
│   │   ├── AISummary.tsx       # Daily AI summary card
│   │   ├── TaskList.tsx        # Task list display
│   │   ├── TaskItem.tsx        # Individual task component
│   │   └── TaskForm.tsx        # Standard task form
│   └── lib/
├── backend/                     # FastAPI app
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── config.py
│   │   ├── routers/
│   │   │   ├── tasks.py        # Task CRUD endpoints
│   │   │   └── ai.py           # AI-powered endpoints
│   │   └── services/
│   │       └── ai_service.py   # Gemini API integration
│   └── requirements.txt
└── src/todo/                    # Phase I console app
```

## Setup

### Prerequisites

- Python 3.12+
- Node.js 18+
- Neon PostgreSQL database
- Google Gemini API key

### Backend

```bash
cd backend
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your settings:
#   DATABASE_URL=postgresql://...
#   BETTER_AUTH_SECRET=your-secret-key
#   GEMINI_API_KEY=your-gemini-api-key

uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your settings

npm run dev
```

## API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | List all tasks |
| POST | /api/tasks | Create a task |
| GET | /api/tasks/{id} | Get task details |
| PUT | /api/tasks/{id} | Update a task |
| DELETE | /api/tasks/{id} | Delete a task |
| PATCH | /api/tasks/{id}/complete | Toggle completion |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tasks/parse | Parse natural language into task data |
| GET | /api/tasks/suggestions | Get AI-generated task suggestions |
| POST | /api/tasks/{id}/categorize | Auto-categorize a task |
| GET | /api/tasks/summary | Get AI-generated daily summary |

## AI Features

### Natural Language Task Input
Type tasks the way you think — the AI extracts structured data automatically.

**Input:** `"Buy groceries tomorrow at 5pm high priority"`

**Parsed output:**
```json
{
  "title": "Buy groceries",
  "due_date": "2024-01-16T17:00:00Z",
  "priority": "high"
}
```

Supports relative dates (tomorrow, next Monday), absolute dates, times, and priority keywords (urgent, high, medium, low).

### Smart Suggestions
Analyzes your existing tasks and suggests related follow-ups.

```json
{
  "suggestions": [
    {
      "title": "Review grocery list",
      "reason": "You have 'Buy groceries' scheduled - consider preparing a list first"
    }
  ]
}
```

### Auto-Categorization
Automatically tags tasks with relevant categories like `shopping`, `errands`, `work`, `personal`.

### Daily Summary
Generates a prioritized overview of your day with key stats.

```json
{
  "summary": "You have 5 tasks today. 2 are high priority...",
  "stats": {
    "total": 5,
    "high_priority": 2,
    "completed": 1,
    "overdue": 0
  }
}
```

## Phases

- [x] Phase I: Console App
- [x] Phase II: Full-Stack Web App
- [x] Phase III: AI Integration
- [ ] Phase IV: Local Kubernetes Deployment
- [ ] Phase V: Advanced Cloud Deployment

## Development Approach

This project follows **Spec-Driven Development**:

1. Write specifications in `/specs/`
2. Generate implementation using Claude Code
3. Iterate on specs until correct output
4. Preserve spec iterations in `/specs/history/`

No manual code writing — all implementation is generated from specifications.
