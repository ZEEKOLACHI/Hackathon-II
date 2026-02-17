"use client";

import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { api, TaskSummary } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
      <Card className="mb-6 border-destructive/50">
        <CardContent className="p-4 text-sm text-destructive">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Summary
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadSummary}
          disabled={loading}
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading && !summary ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2 mt-3">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ) : summary ? (
          <>
            <p className="text-sm text-muted-foreground mb-3">
              {summary.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{summary.stats.total} Total</Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {summary.stats.completed} Done
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {summary.stats.high_priority} High
              </Badge>
              <Badge variant="destructive">
                {summary.stats.overdue} Overdue
              </Badge>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
