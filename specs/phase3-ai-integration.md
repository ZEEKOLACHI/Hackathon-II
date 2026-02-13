# Phase III: AI Integration Specification

## Overview
Add AI-powered features to the todo application using Claude API for intelligent task management.

## Technology Stack Addition

| Component | Technology |
|-----------|------------|
| AI Provider | Google Gemini API |
| Model | gemini-2.0-flash |

## Features

### 1. Natural Language Task Input
**Endpoint:** `POST /api/tasks/parse`

Parse natural language into structured task data.

**Input:**
```json
{
  "text": "Buy groceries tomorrow at 5pm high priority"
}
```

**Output:**
```json
{
  "title": "Buy groceries",
  "due_date": "2024-01-16T17:00:00Z",
  "priority": "high"
}
```

**Parsing Rules:**
- Extract task title (main action)
- Detect relative dates (tomorrow, next week, Monday)
- Detect absolute dates (Jan 15, 2024-01-15)
- Detect times (5pm, 17:00, morning, evening)
- Detect priority keywords (high, medium, low, urgent, important)

### 2. Smart Task Suggestions
**Endpoint:** `GET /api/tasks/suggestions`

Analyze existing tasks and suggest follow-up or related tasks.

**Response:**
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

### 3. Task Categorization
**Endpoint:** `POST /api/tasks/{task_id}/categorize`

Auto-suggest categories/tags for a task.

**Response:**
```json
{
  "categories": ["shopping", "errands", "personal"]
}
```

### 4. Daily Summary
**Endpoint:** `GET /api/tasks/summary`

Get an AI-generated summary of tasks.

**Response:**
```json
{
  "summary": "You have 5 tasks today. 2 are high priority: 'Submit report' and 'Call client'. Consider starting with 'Submit report' as it has the earliest deadline.",
  "stats": {
    "total": 5,
    "high_priority": 2,
    "completed": 1,
    "overdue": 0
  }
}
```

## Database Schema Updates

Add to Task model:
```python
class Task(SQLModel, table=True):
    # ... existing fields ...
    due_date: datetime | None = None
    priority: str | None = None  # "low", "medium", "high"
    categories: list[str] | None = Field(default=None, sa_column=Column(JSON))
```

## Frontend Components

### 1. Smart Input Bar
- Single text input with AI parsing
- Shows parsed preview before creating task
- User can edit parsed fields before confirming

### 2. Suggestions Panel
- Sidebar or dropdown showing AI suggestions
- Dismiss or accept suggestions with one click

### 3. Daily Summary Card
- Dashboard widget showing AI summary
- Refresh button to regenerate

## API Integration

### Backend Service
```python
# backend/app/services/ai_service.py

class AIService:
    async def parse_task(self, text: str) -> ParsedTask
    async def get_suggestions(self, tasks: list[Task]) -> list[Suggestion]
    async def categorize_task(self, task: Task) -> list[str]
    async def generate_summary(self, tasks: list[Task]) -> Summary
```

### Environment Variables
```
GEMINI_API_KEY=your-gemini-api-key
```

## Security Considerations
- API key stored server-side only
- Rate limiting on AI endpoints (10 requests/minute per user)
- Input sanitization before sending to Gemini
- No PII sent to AI beyond task content

## Error Handling
- Graceful fallback if AI service unavailable
- Manual input always available as backup
- Clear error messages for rate limits

## Success Criteria
1. Natural language input correctly parses 90%+ of common formats
2. Suggestions are contextually relevant
3. Response time < 3 seconds for AI features
4. All AI features work with existing auth system
