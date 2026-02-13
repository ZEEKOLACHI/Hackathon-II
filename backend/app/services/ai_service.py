"""AI Service using Google Gemini API."""

import json
from datetime import datetime, timedelta
from typing import Optional
import google.generativeai as genai
from app.config import settings
from app.schemas import ParsedTaskResponse, TaskSuggestion, SummaryStats


# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")


class AIService:
    """Service for AI-powered task features."""

    async def parse_task(self, text: str) -> ParsedTaskResponse:
        """Parse natural language into structured task data."""
        today = datetime.now().strftime("%Y-%m-%d")

        prompt = f"""Parse this task input into structured data. Today's date is {today}.

Input: "{text}"

Return ONLY valid JSON with these fields:
- title: string (the main task action)
- description: string or null (additional details if any)
- due_date: ISO datetime string or null (e.g., "2024-01-15T17:00:00")
- priority: "low", "medium", "high", or null
- categories: array of strings or null

Examples of date parsing:
- "tomorrow" = next day
- "next week" = 7 days from today
- "Monday" = next Monday
- "5pm" = today at 17:00
- "morning" = 09:00
- "evening" = 18:00

Priority keywords: urgent/important/asap = high, normal = medium, whenever/someday = low

Return only the JSON object, no markdown formatting."""

        response = model.generate_content(prompt)
        result_text = response.text.strip()

        # Clean up response if wrapped in markdown
        if result_text.startswith("```"):
            result_text = result_text.split("```")[1]
            if result_text.startswith("json"):
                result_text = result_text[4:]
            result_text = result_text.strip()

        parsed = json.loads(result_text)

        return ParsedTaskResponse(
            title=parsed.get("title", text),
            description=parsed.get("description"),
            due_date=parsed.get("due_date"),
            priority=parsed.get("priority"),
            categories=parsed.get("categories")
        )

    async def get_suggestions(self, tasks: list[dict]) -> list[TaskSuggestion]:
        """Generate task suggestions based on existing tasks."""
        if not tasks:
            return []

        tasks_summary = "\n".join([
            f"- {t['title']} (completed: {t['completed']}, priority: {t.get('priority', 'none')})"
            for t in tasks[:10]  # Limit to 10 tasks for context
        ])

        prompt = f"""Based on these existing tasks, suggest 2-3 follow-up or related tasks that might be helpful.

Current tasks:
{tasks_summary}

Return ONLY valid JSON array with objects containing:
- title: string (suggested task)
- reason: string (brief explanation why this is suggested)

Example: [{{"title": "Review grocery list", "reason": "Preparation for your shopping task"}}]

Return only the JSON array, no markdown formatting."""

        response = model.generate_content(prompt)
        result_text = response.text.strip()

        if result_text.startswith("```"):
            result_text = result_text.split("```")[1]
            if result_text.startswith("json"):
                result_text = result_text[4:]
            result_text = result_text.strip()

        suggestions = json.loads(result_text)

        return [TaskSuggestion(title=s["title"], reason=s["reason"]) for s in suggestions]

    async def categorize_task(self, title: str, description: Optional[str] = None) -> list[str]:
        """Auto-categorize a task."""
        task_text = title
        if description:
            task_text += f" - {description}"

        prompt = f"""Categorize this task into 1-3 relevant categories.

Task: "{task_text}"

Common categories: work, personal, shopping, health, finance, home, errands, learning, social, travel

Return ONLY a JSON array of category strings, e.g., ["work", "urgent"]
No markdown formatting."""

        response = model.generate_content(prompt)
        result_text = response.text.strip()

        if result_text.startswith("```"):
            result_text = result_text.split("```")[1]
            if result_text.startswith("json"):
                result_text = result_text[4:]
            result_text = result_text.strip()

        categories = json.loads(result_text)
        return categories[:3]  # Limit to 3 categories

    async def generate_summary(self, tasks: list[dict]) -> tuple[str, SummaryStats]:
        """Generate a daily summary of tasks."""
        now = datetime.now()

        # Calculate stats
        total = len(tasks)
        completed = sum(1 for t in tasks if t.get("completed"))
        high_priority = sum(1 for t in tasks if t.get("priority") == "high" and not t.get("completed"))
        overdue = sum(
            1 for t in tasks
            if t.get("due_date") and not t.get("completed")
            and datetime.fromisoformat(t["due_date"].replace("Z", "+00:00")) < now
        )

        stats = SummaryStats(
            total=total,
            high_priority=high_priority,
            completed=completed,
            overdue=overdue
        )

        if not tasks:
            return "No tasks yet. Add some tasks to get started!", stats

        incomplete_tasks = [t for t in tasks if not t.get("completed")][:10]
        tasks_summary = "\n".join([
            f"- {t['title']} (priority: {t.get('priority', 'none')}, due: {t.get('due_date', 'none')})"
            for t in incomplete_tasks
        ])

        prompt = f"""Generate a brief, helpful daily summary for these tasks.

Stats: {total} total, {completed} completed, {high_priority} high priority, {overdue} overdue

Incomplete tasks:
{tasks_summary}

Write 2-3 sentences: acknowledge progress, highlight priorities, give one actionable suggestion.
Be encouraging but concise. No markdown formatting."""

        response = model.generate_content(prompt)
        summary = response.text.strip()

        return summary, stats


# Singleton instance
ai_service = AIService()
