"""In-memory task storage."""

from todo.models import Task


class TaskStorage:
    """Manages in-memory task storage."""

    def __init__(self) -> None:
        self._tasks: list[Task] = []
        self._next_id: int = 1

    def add(self, title: str, description: str = "") -> Task:
        """Create a new task and return it."""
        task = Task(
            id=self._next_id,
            title=title,
            description=description
        )
        self._tasks.append(task)
        self._next_id += 1
        return task

    def get_all(self) -> list[Task]:
        """Return all tasks."""
        return self._tasks.copy()

    def get_by_id(self, task_id: int) -> Task | None:
        """Find task by ID, returns None if not found."""
        for task in self._tasks:
            if task.id == task_id:
                return task
        return None

    def update(self, task_id: int, title: str | None = None,
               description: str | None = None) -> Task | None:
        """Update task fields. Returns updated task or None if not found."""
        task = self.get_by_id(task_id)
        if task is None:
            return None
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        return task

    def delete(self, task_id: int) -> Task | None:
        """Delete task by ID. Returns deleted task or None if not found."""
        task = self.get_by_id(task_id)
        if task is None:
            return None
        self._tasks.remove(task)
        return task

    def toggle_complete(self, task_id: int) -> Task | None:
        """Toggle task completion status. Returns task or None if not found."""
        task = self.get_by_id(task_id)
        if task is None:
            return None
        task.completed = not task.completed
        return task
