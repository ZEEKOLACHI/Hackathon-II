"""Todo application main entry point."""

from todo.storage import TaskStorage


def display_menu() -> None:
    """Display the main menu."""
    print("\n===== TODO APP =====")
    print("1. Add Task")
    print("2. View Tasks")
    print("3. Update Task")
    print("4. Delete Task")
    print("5. Toggle Complete")
    print("6. Exit")
    print("====================")


def get_task_id() -> int | None:
    """Prompt for task ID and return it, or None if invalid."""
    try:
        return int(input("Enter task ID: "))
    except ValueError:
        print("Please enter a valid number.")
        return None


def add_task(storage: TaskStorage) -> None:
    """Handle adding a new task."""
    title = input("Enter title: ").strip()

    if not title:
        print("Title cannot be empty.")
        return

    if len(title) > 200:
        print("Title cannot exceed 200 characters.")
        return

    description = input("Enter description (press Enter to skip): ").strip()

    if len(description) > 1000:
        print("Description cannot exceed 1000 characters.")
        return

    task = storage.add(title, description)
    print(f"Task #{task.id} created: {task.title}")


def view_tasks(storage: TaskStorage) -> None:
    """Display all tasks."""
    tasks = storage.get_all()

    if not tasks:
        print("No tasks found.")
        return

    print()
    for task in tasks:
        status = "[X]" if task.completed else "[ ]"
        date_str = task.created_at.strftime("%Y-%m-%d")
        print(f"{status} #{task.id} - {task.title} (created: {date_str})")
        if task.description:
            print(f"    {task.description}")
        else:
            print("    No description")


def update_task(storage: TaskStorage) -> None:
    """Handle updating a task."""
    task_id = get_task_id()
    if task_id is None:
        return

    task = storage.get_by_id(task_id)
    if task is None:
        print(f"Task #{task_id} not found.")
        return

    print(f"Current title: {task.title}")
    new_title = input("New title (press Enter to keep current): ").strip()

    print(f"Current description: {task.description or '(none)'}")
    new_desc = input("New description (press Enter to keep current): ").strip()

    if not new_title and not new_desc:
        print("No changes made.")
        return

    if new_title and len(new_title) > 200:
        print("Title cannot exceed 200 characters.")
        return

    if new_desc and len(new_desc) > 1000:
        print("Description cannot exceed 1000 characters.")
        return

    storage.update(
        task_id,
        title=new_title if new_title else None,
        description=new_desc if new_desc else None
    )
    print(f"Task #{task_id} updated.")


def delete_task(storage: TaskStorage) -> None:
    """Handle deleting a task."""
    task_id = get_task_id()
    if task_id is None:
        return

    task = storage.delete(task_id)
    if task is None:
        print(f"Task #{task_id} not found.")
        return

    print(f"Task #{task_id} deleted: {task.title}")


def toggle_complete(storage: TaskStorage) -> None:
    """Handle toggling task completion."""
    task_id = get_task_id()
    if task_id is None:
        return

    task = storage.toggle_complete(task_id)
    if task is None:
        print(f"Task #{task_id} not found.")
        return

    status = "completed" if task.completed else "pending"
    print(f"Task #{task_id} marked as {status}.")


def main() -> None:
    """Main application loop."""
    storage = TaskStorage()

    while True:
        display_menu()
        choice = input("Choose option (1-6): ").strip()

        if choice == "1":
            add_task(storage)
        elif choice == "2":
            view_tasks(storage)
        elif choice == "3":
            update_task(storage)
        elif choice == "4":
            delete_task(storage)
        elif choice == "5":
            toggle_complete(storage)
        elif choice == "6":
            print("Goodbye!")
            break
        else:
            print("Invalid option. Please choose 1-6.")


if __name__ == "__main__":
    main()
