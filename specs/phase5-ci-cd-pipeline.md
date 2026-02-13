# Phase V Spec: CI/CD Pipeline with GitHub Actions

## Overview
Add automated CI/CD pipelines using GitHub Actions to validate code quality, run tests, and verify container builds on every push and pull request to `main`.

## Goals
- Automate linting for backend (ruff) and frontend (next lint)
- Run backend tests with pytest using SQLite (no external DB needed)
- Validate frontend builds (TypeScript + Next.js compilation)
- Verify Docker images build successfully
- Provide fast feedback on PRs before merge

## Triggers
- `push` to `main` branch
- `pull_request` targeting `main` branch

## Workflow: `ci.yml`

### Jobs

#### 1. `backend-lint`
- **Runs on:** `ubuntu-latest`
- **Steps:**
  1. Checkout code
  2. Set up Python 3.12
  3. Install dependencies + `ruff`
  4. Run `ruff check backend/`

#### 2. `backend-test`
- **Runs on:** `ubuntu-latest`
- **Environment:** `DATABASE_URL=sqlite:///./test.db`, `BETTER_AUTH_SECRET=test-secret`, `GEMINI_API_KEY=fake-key`
- **Steps:**
  1. Checkout code
  2. Set up Python 3.12
  3. Install dependencies + `pytest`
  4. Run `pytest backend/tests/ -v`

#### 3. `frontend-lint`
- **Runs on:** `ubuntu-latest`
- **Steps:**
  1. Checkout code
  2. Set up Node.js 18
  3. `npm ci` in `frontend/`
  4. Run `npm run lint`

#### 4. `frontend-build`
- **Runs on:** `ubuntu-latest`
- **Steps:**
  1. Checkout code
  2. Set up Node.js 18
  3. `npm ci` in `frontend/`
  4. Run `npm run build`

#### 5. `docker-build`
- **Runs on:** `ubuntu-latest`
- **Needs:** `backend-test`, `frontend-build` (only build images if code is valid)
- **Steps:**
  1. Checkout code
  2. Build backend image: `docker build -t todo-backend:ci ./backend`
  3. Build frontend image: `docker build -t todo-frontend:ci ./frontend`

## Backend Test Suite

### `backend/tests/test_health.py`
- Test `GET /` returns 200 with expected message
- Test `GET /health` returns 200 with `{"status": "healthy"}`

### `backend/tests/test_tasks.py`
- Test create task (POST `/api/tasks`) returns 201
- Test list tasks (GET `/api/tasks`) returns 200
- Test get single task (GET `/api/tasks/{id}`) returns 200
- Test update task (PUT `/api/tasks/{id}`) returns 200
- Test toggle complete (PATCH `/api/tasks/{id}/complete`) returns 200
- Test delete task (DELETE `/api/tasks/{id}`) returns 204
- Test unauthorized access returns 401
- All tests use mocked JWT auth and SQLite in-memory database

## Dependencies Added
- `pytest` added to `backend/requirements.txt`
- `ruff` installed in CI only (not in requirements.txt)

## Secrets Required
None — CI uses SQLite and fake API keys. No real secrets needed for the pipeline.

## Success Criteria
- All 5 jobs pass on a clean push to `main`
- PR checks block merge if any job fails
- Backend tests cover health + full task CRUD lifecycle
- Docker images build without errors
