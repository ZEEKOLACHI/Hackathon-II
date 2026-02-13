"use client";

import { useState } from "react";
import { api, ParsedTask } from "@/lib/api";

interface SmartTaskFormProps {
  onTaskCreated: () => void;
}

export default function SmartTaskForm({ onTaskCreated }: SmartTaskFormProps) {
  const [input, setInput] = useState("");
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");

  const handleParse = async (autoCreate: boolean = false) => {
    if (!input.trim()) return;

    setParsing(true);
    setError("");

    try {
      const parsed = await api.parseTask(input.trim());
      setParsedTask(parsed);

      // Auto-create task after successful parse
      if (autoCreate && parsed) {
        await createTask(parsed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse task");
    } finally {
      setParsing(false);
    }
  };

  const createTask = async (task: ParsedTask) => {
    setLoading(true);
    setError("");

    try {
      await api.createTask({
        title: task.title,
        description: task.description || undefined,
        due_date: task.due_date || undefined,
        priority: task.priority || undefined,
        categories: task.categories || undefined,
      });
      setInput("");
      setParsedTask(null);
      onTaskCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parsedTask) {
      // Parse and auto-create on Enter
      await handleParse(true);
      return;
    }

    // If already parsed, create the task
    await createTask(parsedTask);
  };

  const handleClear = () => {
    setParsedTask(null);
    setError("");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleString();
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
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
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (parsedTask) setParsedTask(null);
          }}
          placeholder="Try: 'Buy groceries tomorrow at 5pm high priority'"
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          maxLength={500}
        />
        {!parsedTask ? (
          <button
            type="button"
            onClick={() => handleParse()}
            disabled={parsing || !input.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {parsing ? "..." : "Parse"}
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "..." : "Create"}
          </button>
        )}
      </div>

      {parsedTask && (
        <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-purple-600 font-medium">AI Parsed Result</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Clear
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <span className="font-semibold">{parsedTask.title}</span>
            </div>

            {parsedTask.description && (
              <div className="text-sm text-gray-600">{parsedTask.description}</div>
            )}

            <div className="flex flex-wrap gap-2 text-sm">
              {parsedTask.due_date && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  Due: {formatDate(parsedTask.due_date)}
                </span>
              )}

              {parsedTask.priority && (
                <span className={`px-2 py-1 rounded ${priorityColors[parsedTask.priority]}`}>
                  {parsedTask.priority} priority
                </span>
              )}

              {parsedTask.categories?.map((cat) => (
                <span key={cat} className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
