# Phase I Specification: In-Memory Console Todo App

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

## User Interface

### Main Menu
```
===== TODO APP =====
1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Toggle Complete
6. Exit
====================
Choose option (1-6):
```

### Input Prompts
- Add: "Enter title: ", "Enter description (press Enter to skip): "
- Update/Delete/Toggle: "Enter task ID: "
- Update: "New title (press Enter to keep current): "

### Error Messages
- Invalid menu choice: "Invalid option. Please choose 1-6."
- Task not found: "Task #{id} not found."
- Empty title: "Title cannot be empty."
- Invalid ID format: "Please enter a valid number."

## Program Flow
1. Display menu
2. Get user choice
3. Execute action
4. Show result/error
5. Return to menu (unless Exit)
