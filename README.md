# Evolution of Todo - Hackathon II

A todo application evolving from console app to cloud-native AI chatbot using Spec-Driven Development.

## Current Phase: Phase II - Full-Stack Web Application

## Features

- User authentication (sign up/sign in)
- Task CRUD operations
- Task completion toggle
- Filter tasks by status
- Persistent storage with Neon PostgreSQL

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | FastAPI, SQLModel, Python 3.12+ |
| Database | Neon Serverless PostgreSQL |
| Auth | Better Auth with JWT |

## Project Structure

```
├── constitution.md          # Project principles
├── CLAUDE.md               # Claude Code instructions
├── specs/                  # Feature specifications
│   ├── phase1-console-app.md
│   ├── phase2-fullstack-app.md
│   └── history/
├── frontend/               # Next.js app
│   ├── app/
│   ├── components/
│   └── lib/
├── backend/                # FastAPI app
│   ├── app/
│   └── requirements.txt
└── src/todo/               # Phase I console app
```

## Setup

### Prerequisites

- Python 3.12+
- Node.js 18+
- Neon PostgreSQL database

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your DATABASE_URL and BETTER_AUTH_SECRET

uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your settings

npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | List all tasks |
| POST | /api/tasks | Create a task |
| GET | /api/tasks/{id} | Get task details |
| PUT | /api/tasks/{id} | Update a task |
| DELETE | /api/tasks/{id} | Delete a task |
| PATCH | /api/tasks/{id}/complete | Toggle completion |

## Phases

- [x] Phase I: Console App
- [ ] Phase II: Full-Stack Web App (Current)
- [ ] Phase III: AI-Powered Chatbot
- [ ] Phase IV: Local Kubernetes Deployment
- [ ] Phase V: Advanced Cloud Deployment

## Development Approach

This project follows **Spec-Driven Development**:
1. Write specifications in `/specs/`
2. Generate implementation using Claude Code
3. Iterate on specs until correct output
