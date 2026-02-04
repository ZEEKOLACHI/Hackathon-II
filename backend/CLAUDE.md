# Backend Guidelines

## Stack
- FastAPI
- SQLModel (ORM)
- Neon PostgreSQL
- Python 3.12+

## Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app entry point
│   ├── config.py        # Settings and configuration
│   ├── database.py      # Database connection
│   ├── models.py        # SQLModel database models
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── auth.py          # JWT verification
│   └── routers/
│       └── tasks.py     # Task CRUD endpoints
├── requirements.txt
└── CLAUDE.md
```

## API Conventions
- All routes under `/api/`
- Return JSON responses
- Use Pydantic models for request/response
- Handle errors with HTTPException

## Authentication
- Verify JWT token from Authorization header
- Extract user_id from token claims
- Filter all queries by user_id

## Database
- Use SQLModel for all database operations
- Connection string from environment variable: DATABASE_URL
- Use async database operations

## Running
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Environment Variables
```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
```
