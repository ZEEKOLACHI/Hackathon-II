"use client";

import { useState } from "react";
import { api, TaskSuggestion } from "@/lib/api";

interface SuggestionsProps {
  onAccept: (title: string) => void;
}

export default function Suggestions({ onAccept }: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const loadSuggestions = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.getSuggestions();
      setSuggestions(data.suggestions);
      setIsOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (suggestion: TaskSuggestion) => {
    try {
      await api.createTask({ title: suggestion.title });
      setSuggestions(suggestions.filter((s) => s.title !== suggestion.title));
      onAccept(suggestion.title);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const handleDismiss = (title: string) => {
    setSuggestions(suggestions.filter((s) => s.title !== title));
  };

  return (
    <div className="mb-4">
      {!isOpen ? (
        <button
          onClick={loadSuggestions}
          disabled={loading}
          className="text-sm text-purple-600 hover:text-purple-800 disabled:opacity-50"
        >
          {loading ? "Getting suggestions..." : "Get AI Suggestions"}
        </button>
      ) : (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-purple-800">AI Suggestions</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              Close
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-2">{error}</p>
          )}

          {suggestions.length === 0 ? (
            <p className="text-gray-500 text-sm">No suggestions available.</p>
          ) : (
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.title}
                  className="p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="font-medium">{suggestion.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{suggestion.reason}</div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleAccept(suggestion)}
                      className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Add Task
                    </button>
                    <button
                      onClick={() => handleDismiss(suggestion.title)}
                      className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={loadSuggestions}
            disabled={loading}
            className="mt-3 text-sm text-purple-600 hover:text-purple-800 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh suggestions"}
          </button>
        </div>
      )}
    </div>
  );
}
