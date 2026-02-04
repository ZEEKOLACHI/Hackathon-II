# Phase II Specification: Full-Stack Web Application

## Overview
Transform the console app into a multi-user web application with persistent storage.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│    Backend      │────▶│    Neon DB      │
│    (Next.js)    │     │    (FastAPI)    │     │  (PostgreSQL)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        └───────────────────────┘
              Better Auth (JWT)
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15+ (App Router) |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth with JWT |

## Database Schema

### users (managed by Better Auth)
```sql
- id: string (primary key)
- email: string (unique)
- name: string
- created_at: timestamp
```

### tasks
```sql
- id: integer (primary key, auto-increment)
- user_id: string (foreign key -> users.id)
- title: string (not null, max 200)
- description: text (nullable, max 1000)
- completed: boolean (default false)
- created_at: timestamp
- updated_at: timestamp
```

## API Endpoints

Base URL: `http://localhost:8000`

### Tasks API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | List all tasks for authenticated user |
| POST | /api/tasks | Create a new task |
| GET | /api/tasks/{id} | Get task details |
| PUT | /api/tasks/{id} | Update a task |
| DELETE | /api/tasks/{id} | Delete a task |
| PATCH | /api/tasks/{id}/complete | Toggle completion |

### Authentication
All endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### Request/Response Schemas

#### Create Task (POST /api/tasks)
Request:
```json
{
  "title": "string (required)",
  "description": "string (optional)"
}
```
Response:
```json
{
  "id": 1,
  "user_id": "user_123",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "created_at": "2025-12-07T10:00:00Z",
  "updated_at": "2025-12-07T10:00:00Z"
}
```

#### List Tasks (GET /api/tasks)
Query Parameters:
- `status`: "all" | "pending" | "completed" (default: "all")

Response:
```json
[
  {
    "id": 1,
    "title": "Task title",
    "completed": false,
    "created_at": "2025-12-07T10:00:00Z"
  }
]
```

#### Update Task (PUT /api/tasks/{id})
Request:
```json
{
  "title": "string (optional)",
  "description": "string (optional)"
}
```

#### Toggle Complete (PATCH /api/tasks/{id}/complete)
Response:
```json
{
  "id": 1,
  "completed": true
}
```

### Error Responses
```json
{
  "detail": "Error message"
}
```

| Status | Description |
|--------|-------------|
| 400 | Bad request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (not owner of task) |
| 404 | Task not found |

## Frontend Pages

### Public Pages
- `/` - Landing page with sign in/sign up links
- `/auth/signin` - Sign in form
- `/auth/signup` - Sign up form

### Protected Pages (require auth)
- `/dashboard` - Main todo list view
  - Display all tasks
  - Add new task form
  - Edit/delete/complete tasks
  - Filter by status

## UI Components

### TaskList
- Displays list of tasks
- Shows completion status checkbox
- Edit and delete buttons
- Empty state message

### TaskForm
- Title input (required)
- Description textarea (optional)
- Submit button

### TaskItem
- Checkbox for completion
- Title and description display
- Edit mode toggle
- Delete confirmation

## Authentication Flow

1. User signs up/signs in via Better Auth on frontend
2. Better Auth issues JWT token
3. Frontend stores token and sends with API requests
4. Backend validates JWT and extracts user_id
5. Backend filters data by user_id

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key
DATABASE_URL=postgresql://...
```

### Backend (.env)
```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
```
