# Claude Code Instructions

## Project Overview
This is a **Spec-Driven Development** project for Hackathon II.
Currently in **Phase I**: In-Memory Python Console Todo App.

## Key Constraint
**No manual code writing allowed.** All implementation must be generated from specifications.

## Project Structure
- `/constitution.md` - Project principles and rules
- `/specs/` - Feature specifications (read these first)
- `/specs/history/` - Previous spec iterations
- `/src/todo/` - Python source code

## Development Workflow
1. Read the relevant spec from `/specs/`
2. Generate implementation based on spec
3. If output is incorrect, spec will be refined
4. Preserve spec iterations in `/specs/history/`

## Phase I Requirements
Implement 5 Basic Level features:
1. **Add Task** - Create new todo items
2. **View Tasks** - Display all tasks with status
3. **Update Task** - Modify task details
4. **Delete Task** - Remove tasks by ID
5. **Mark Complete** - Toggle completion status

## Technical Stack
- Python 3.13+
- UV package manager
- In-memory storage (list/dict)
- No external databases

## Code Standards
- Use type hints
- Follow PEP 8
- Validate all user inputs
- Handle errors gracefully

## Running the App
```bash
uv run python -m todo.main
```

## File Naming
- Specs: `specs/<feature-name>.md`
- History: `specs/history/<feature-name>-v<N>.md`
