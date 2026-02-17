"use client";

import { ClipboardList } from "lucide-react";
import { TaskListItem } from "@/lib/api";
import TaskItem from "./TaskItem";
import EmptyState from "./EmptyState";

interface TaskListProps {
  tasks: TaskListItem[];
  onToggleComplete: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isSearchResult?: boolean;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  isSearchResult,
}: TaskListProps) {
  if (tasks.length === 0) {
    return isSearchResult ? (
      <EmptyState
        icon={ClipboardList}
        title="No results found"
        description="Try a different search term."
      />
    ) : (
      <EmptyState
        icon={ClipboardList}
        title="No tasks yet"
        description="Add your first task above to get started!"
      />
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
