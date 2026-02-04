"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface TaskFormProps {
  onTaskCreated: () => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.createTask({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setTitle("");
      setDescription("");
      setShowDescription(false);
      onTaskCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          maxLength={200}
        />
        <button
          type="button"
          onClick={() => setShowDescription(!showDescription)}
          className="px-3 py-2 text-gray-500 hover:text-gray-700"
          title="Add description"
        >
          +
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "..." : "Add"}
        </button>
      </div>

      {showDescription && (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={2}
          maxLength={1000}
        />
      )}
    </form>
  );
}
