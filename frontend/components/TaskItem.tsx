"use client";

import { useState } from "react";
import { TaskListItem } from "@/lib/api";

interface TaskItemProps {
  task: TaskListItem;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

export default function TaskItem({
  task,
  onToggleComplete,
  onDelete,
}: TaskItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (showConfirm) {
      onDelete(task.id);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  const formattedDate = new Date(task.created_at).toLocaleDateString();

  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const isOverdue = date < now && !task.completed;

    return {
      text: date.toLocaleDateString(),
      isOverdue,
    };
  };

  const dueInfo = formatDueDate(task.due_date);

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`font-medium ${
              task.completed ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {task.title}
          </p>
          {task.priority && (
            <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{formattedDate}</span>
          {dueInfo && (
            <span className={dueInfo.isOverdue ? "text-red-600 font-medium" : ""}>
              · Due: {dueInfo.text}
              {dueInfo.isOverdue && " (overdue)"}
            </span>
          )}
        </div>
      </div>

      {showConfirm ? (
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Confirm
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleDelete}
          className="px-3 py-1 text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      )}
    </div>
  );
}
