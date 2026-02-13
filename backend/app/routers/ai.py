"""AI-powered task endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.auth import verify_token
from app.models import Task
from app.schemas import (
    NaturalLanguageInput,
    ParsedTaskResponse,
    SuggestionsResponse,
    CategorizeResponse,
    SummaryResponse,
)
from app.services.ai_service import ai_service

router = APIRouter(prefix="/api/tasks", tags=["ai"])


@router.post("/parse", response_model=ParsedTaskResponse)
async def parse_natural_language(
    input_data: NaturalLanguageInput,
    user_id: str = Depends(verify_token),
):
    """Parse natural language input into structured task data."""
    try:
        parsed = await ai_service.parse_task(input_data.text)
        return parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI parsing failed: {str(e)}")


@router.get("/suggestions", response_model=SuggestionsResponse)
async def get_suggestions(
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session),
):
    """Get AI-generated task suggestions based on existing tasks."""
    try:
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()

        tasks_data = [
            {
                "title": t.title,
                "completed": t.completed,
                "priority": t.priority,
                "due_date": t.due_date.isoformat() if t.due_date else None,
                "categories": t.categories,
            }
            for t in tasks
        ]

        suggestions = await ai_service.get_suggestions(tasks_data)
        return SuggestionsResponse(suggestions=suggestions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI suggestions failed: {str(e)}")


@router.post("/{task_id}/categorize", response_model=CategorizeResponse)
async def categorize_task(
    task_id: int,
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session),
):
    """Auto-categorize a task using AI."""
    task = session.get(Task, task_id)

    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    try:
        categories = await ai_service.categorize_task(task.title, task.description)
        return CategorizeResponse(categories=categories)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI categorization failed: {str(e)}")


@router.get("/summary", response_model=SummaryResponse)
async def get_daily_summary(
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session),
):
    """Get AI-generated daily summary of tasks."""
    try:
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()

        tasks_data = [
            {
                "title": t.title,
                "completed": t.completed,
                "priority": t.priority,
                "due_date": t.due_date.isoformat() if t.due_date else None,
                "categories": t.categories,
            }
            for t in tasks
        ]

        summary, stats = await ai_service.generate_summary(tasks_data)
        return SummaryResponse(summary=summary, stats=stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI summary failed: {str(e)}")
