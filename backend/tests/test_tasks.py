"""Tests for task CRUD endpoints."""

from fastapi.testclient import TestClient


def test_create_task(client: TestClient):
    """Test creating a new task."""
    response = client.post(
        "/api/tasks",
        json={"title": "Test task", "description": "A test task"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test task"
    assert data["description"] == "A test task"
    assert data["completed"] is False
    assert data["user_id"] == "test-user-123"


def test_list_tasks(client: TestClient):
    """Test listing tasks."""
    # Create two tasks
    client.post("/api/tasks", json={"title": "Task 1"})
    client.post("/api/tasks", json={"title": "Task 2"})

    response = client.get("/api/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_list_tasks_filter_pending(client: TestClient):
    """Test listing only pending tasks."""
    client.post("/api/tasks", json={"title": "Task 1"})
    resp = client.post("/api/tasks", json={"title": "Task 2"})
    task_id = resp.json()["id"]
    client.patch(f"/api/tasks/{task_id}/complete")

    response = client.get("/api/tasks?status=pending")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1


def test_get_task(client: TestClient):
    """Test getting a single task."""
    create_resp = client.post(
        "/api/tasks",
        json={"title": "Get me", "priority": "high"},
    )
    task_id = create_resp.json()["id"]

    response = client.get(f"/api/tasks/{task_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Get me"
    assert data["priority"] == "high"


def test_get_task_not_found(client: TestClient):
    """Test getting a non-existent task returns 404."""
    response = client.get("/api/tasks/9999")
    assert response.status_code == 404


def test_update_task(client: TestClient):
    """Test updating a task."""
    create_resp = client.post("/api/tasks", json={"title": "Original"})
    task_id = create_resp.json()["id"]

    response = client.put(
        f"/api/tasks/{task_id}",
        json={"title": "Updated", "priority": "low"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated"
    assert data["priority"] == "low"


def test_toggle_complete(client: TestClient):
    """Test toggling task completion."""
    create_resp = client.post("/api/tasks", json={"title": "Toggle me"})
    task_id = create_resp.json()["id"]

    # Toggle to complete
    response = client.patch(f"/api/tasks/{task_id}/complete")
    assert response.status_code == 200
    assert response.json()["completed"] is True

    # Toggle back to incomplete
    response = client.patch(f"/api/tasks/{task_id}/complete")
    assert response.status_code == 200
    assert response.json()["completed"] is False


def test_delete_task(client: TestClient):
    """Test deleting a task."""
    create_resp = client.post("/api/tasks", json={"title": "Delete me"})
    task_id = create_resp.json()["id"]

    response = client.delete(f"/api/tasks/{task_id}")
    assert response.status_code == 204

    # Verify it's gone
    response = client.get(f"/api/tasks/{task_id}")
    assert response.status_code == 404


def test_unauthorized_no_token():
    """Test that endpoints require authentication."""
    from fastapi.testclient import TestClient as TC
    from app.main import app

    # Client without dependency overrides
    raw_client = TC(app)
    response = raw_client.get("/api/tasks")
    assert response.status_code in (401, 403)
