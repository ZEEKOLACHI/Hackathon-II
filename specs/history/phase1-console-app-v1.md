# Phase I Specification: In-Memory Console Todo App (v1 - Final)

## Overview
A command-line todo application that stores tasks in memory.

## Data Model

### Task
```python
@dataclass
class Task:
    id: int
    title: str
    description: str
    completed: bool
    created_at: datetime
```

**Constraints:**
- `id`: Auto-incremented, starts at 1
- `title`: Required, 1-200 characters
- `description`: Optional, max 1000 characters
- `completed`: Default `False`
- `created_at`: Set automatically on creation

## Storage
- In-memory list: `tasks: list[Task]`
- Counter for ID generation: `next_id: int = 1`

## Features

### 1. Add Task
**Input:** title (required), description (optional)
**Output:** Confirmation with task ID
**Validation:** Title cannot be empty or exceed 200 chars

### 2. View Tasks
**Input:** None
**Output:** Formatted list of all tasks
**Format:**
```
[X] #1 - Task Title (created: 2025-12-01)
    Description text here
[ ] #2 - Another Task (created: 2025-12-01)
    No description
```
- `[X]` = completed, `[ ]` = pending
- Show "No tasks found." if empty

### 3. Update Task
**Input:** task_id, new_title (optional), new_description (optional)
**Output:** Confirmation of update
**Validation:** Task must exist, at least one field to update

### 4. Delete Task
**Input:** task_id
**Output:** Confirmation of deletion
**Validation:** Task must exist

### 5. Mark Complete/Incomplete
**Input:** task_id
**Output:** Confirmation with new status
**Behavior:** Toggle current completion status

## Status: IMPLEMENTED
- All 5 features working
- Pushed to GitHub
