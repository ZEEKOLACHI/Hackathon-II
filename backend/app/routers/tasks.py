"""Task CRUD API endpoints."""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select
from app.database import get_session
from app.models import Task
from app.schemas import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskListItem,
    TaskCompleteResponse,
)
from app.auth import verify_token

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskListItem])
def list_tasks(
    status_filter: Optional[str] = Query(default="all", alias="status"),
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session),
):
    """List all tasks for authenticated user."""
    query = select(Task).where(Task.user_id == user_id)

    if status_filter == "pending":
        query = query.where(Task.completed.is_(False))  # noqa: E712
    elif status_filter == "completed":
        query = query.where(Task.completed.is_(True))  # noqa: E712

    query = query.order_by(Task.created_at.desc())
    tasks = session.exec(query).all()

    return tasks


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session),
):
    """Create a new task."""
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        due_date=task_data.due_date,
        priority=task_data.priority,
        categories=task_data.categories,
    )
    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session),
):
    """Get task details."""
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task #{task_id} not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session),
):
    """Update a task."""
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task #{task_id} not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.due_date is not None:
        task.due_date = task_data.due_date
    if task_data.priority is not None:
        task.priority = task_data.priority
    if task_data.categories is not None:
        task.categories = task_data.categories

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session),
):
    """Delete a task."""
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task #{task_id} not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    session.delete(task)
    session.commit()


@router.patch("/{task_id}/complete", response_model=TaskCompleteResponse)
def toggle_complete(
    task_id: int,
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session),
):
    """Toggle task completion status."""
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task #{task_id} not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()

    return TaskCompleteResponse(id=task.id, completed=task.completed)
