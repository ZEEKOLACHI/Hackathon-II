"""Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Schema for creating a task."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)


class TaskUpdate(BaseModel):
    """Schema for updating a task."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)


class TaskResponse(BaseModel):
    """Schema for task response."""

    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListItem(BaseModel):
    """Schema for task list item."""

    id: int
    title: str
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TaskCompleteResponse(BaseModel):
    """Schema for toggle complete response."""

    id: int
    completed: bool


class ErrorResponse(BaseModel):
    """Schema for error response."""

    detail: str
