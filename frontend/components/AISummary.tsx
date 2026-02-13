"use client";

import { useState, useEffect } from "react";
import { api, TaskSummary } from "@/lib/api";

export default function AISummary() {
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSummary = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.getSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-purple-800">AI Summary</h2>
        <button
          onClick={loadSummary}
          disabled={loading}
          className="text-sm text-purple-600 hover:text-purple-800 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading && !summary ? (
        <p className="text-gray-500 text-sm">Generating summary...</p>
      ) : summary ? (
        <>
          <p className="text-gray-700 mb-3">{summary.summary}</p>

          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <div className="p-2 bg-white rounded">
              <div className="font-bold text-lg">{summary.stats.total}</div>
              <div className="text-gray-500">Total</div>
            </div>
            <div className="p-2 bg-white rounded">
              <div className="font-bold text-lg text-green-600">{summary.stats.completed}</div>
              <div className="text-gray-500">Done</div>
            </div>
            <div className="p-2 bg-white rounded">
              <div className="font-bold text-lg text-orange-600">{summary.stats.high_priority}</div>
              <div className="text-gray-500">High</div>
            </div>
            <div className="p-2 bg-white rounded">
              <div className="font-bold text-lg text-red-600">{summary.stats.overdue}</div>
              <div className="text-gray-500">Overdue</div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
