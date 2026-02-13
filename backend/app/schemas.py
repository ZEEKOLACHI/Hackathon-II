"""Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Schema for creating a task."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    due_date: Optional[datetime] = None
    priority: Optional[Literal["low", "medium", "high"]] = None
    categories: Optional[list[str]] = None


class TaskUpdate(BaseModel):
    """Schema for updating a task."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    due_date: Optional[datetime] = None
    priority: Optional[Literal["low", "medium", "high"]] = None
    categories: Optional[list[str]] = None


class TaskResponse(BaseModel):
    """Schema for task response."""

    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    due_date: Optional[datetime]
    priority: Optional[str]
    categories: Optional[list[str]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListItem(BaseModel):
    """Schema for task list item."""

    id: int
    title: str
    completed: bool
    due_date: Optional[datetime]
    priority: Optional[str]
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


# AI Feature Schemas

class NaturalLanguageInput(BaseModel):
    """Schema for natural language task input."""

    text: str = Field(min_length=1, max_length=500)


class ParsedTaskResponse(BaseModel):
    """Schema for parsed task from natural language."""

    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[Literal["low", "medium", "high"]] = None
    categories: Optional[list[str]] = None


class TaskSuggestion(BaseModel):
    """Schema for a single task suggestion."""

    title: str
    reason: str


class SuggestionsResponse(BaseModel):
    """Schema for task suggestions response."""

    suggestions: list[TaskSuggestion]


class CategorizeResponse(BaseModel):
    """Schema for auto-categorization response."""

    categories: list[str]


class SummaryStats(BaseModel):
    """Schema for summary statistics."""

    total: int
    high_priority: int
    completed: int
    overdue: int


class SummaryResponse(BaseModel):
    """Schema for daily summary response."""

    summary: str
    stats: SummaryStats
