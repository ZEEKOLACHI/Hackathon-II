# Evolution of Todo - Phase I

A command-line todo application built using Spec-Driven Development with Claude Code.

## Features

- Add tasks with title and description
- View all tasks with status indicators
- Update task details
- Delete tasks by ID
- Mark tasks as complete/incomplete

## Setup

### Prerequisites

- Python 3.12+
- UV package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/ZEEKOLACHI/Hackathon-II.git
cd Hackathon-II

# Install dependencies
uv sync
```

## Usage

```bash
uv run python -m todo.main
```

## Project Structure

```
├── constitution.md          # Project principles & rules
├── CLAUDE.md               # Claude Code instructions
├── specs/                  # Feature specifications
│   ├── phase1-console-app.md
│   └── history/            # Spec iterations
├── src/
│   └── todo/               # Source code
│       ├── __init__.py
│       ├── main.py         # Entry point
│       ├── models.py       # Task data model
│       └── storage.py      # In-memory storage
├── pyproject.toml
└── README.md
```

## Development Approach

This project follows **Spec-Driven Development**:

1. Write specifications in `/specs/`
2. Generate implementation using Claude Code
3. Iterate on specs until correct output
4. Preserve spec history in `/specs/history/`

## Hackathon

Part of **Hackathon II: Spec-Driven Development & Cloud Native AI**

- Phase I: Console App (Current)
- Phase II: Full-Stack Web Application
- Phase III: AI-Powered Chatbot
- Phase IV: Local Kubernetes Deployment
- Phase V: Advanced Cloud Deployment
