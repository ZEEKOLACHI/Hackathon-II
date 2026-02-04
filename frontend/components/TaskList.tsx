"use client";

import { TaskListItem } from "@/lib/api";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: TaskListItem[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks found. Add your first task above!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
