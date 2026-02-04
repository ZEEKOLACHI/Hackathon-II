"use client";

import { useState } from "react";
import { TaskListItem } from "@/lib/api";

interface TaskItemProps {
  task: TaskListItem;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

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

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />

      <div className="flex-1">
        <p
          className={`font-medium ${
            task.completed ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {task.title}
        </p>
        <p className="text-sm text-gray-500">{formattedDate}</p>
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
