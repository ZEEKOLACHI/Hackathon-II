# Todo App Constitution

## Project Identity
**Name:** Evolution of Todo
**Phase:** Phase I - In-Memory Python Console App
**Approach:** Spec-Driven Development with Claude Code

## Core Principles

### 1. Spec-First Development
- No code is written manually
- All features must have a specification before implementation
- Specs are refined until Claude Code generates correct output
- All spec iterations are preserved in `specs/history/`

### 2. Clean Code Standards
- Follow PEP 8 style guidelines
- Use type hints for all functions
- Keep functions small and focused (single responsibility)
- Use meaningful variable and function names

### 3. Project Structure
```
hackathon-todo/
├── constitution.md      # This file - project rules
├── specs/               # Current specifications
│   └── history/         # All spec iterations
├── src/                 # Python source code
│   └── todo/            # Main package
├── README.md            # Setup and usage instructions
├── CLAUDE.md            # Claude Code instructions
└── pyproject.toml       # Project configuration
```

### 4. Feature Requirements (Phase I)
All features must support in-memory storage:

| Feature | Description |
|---------|-------------|
| Add Task | Create new todo with title and description |
| View Tasks | Display all tasks with status indicators |
| Update Task | Modify existing task details |
| Delete Task | Remove task by ID |
| Mark Complete | Toggle task completion status |

### 5. Data Model
```python
Task:
  - id: int (auto-generated)
  - title: str (required, 1-200 chars)
  - description: str (optional)
  - completed: bool (default: False)
  - created_at: datetime
```

### 6. User Interface
- Command-line interface with menu-driven navigation
- Clear prompts and feedback messages
- Input validation with helpful error messages

### 7. Quality Standards
- All user inputs must be validated
- Graceful error handling (no crashes)
- Consistent output formatting
