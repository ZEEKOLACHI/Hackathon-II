"use client";

import { useState } from "react";
import { Lightbulb, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { api, TaskSuggestion } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SuggestionsProps {
  onAccept: (title: string) => void;
}

export default function Suggestions({ onAccept }: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const loadSuggestions = async () => {
    setLoading(true);

    try {
      const data = await api.getSuggestions();
      setSuggestions(data.suggestions);
      setIsOpen(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load suggestions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (suggestion: TaskSuggestion) => {
    try {
      await api.createTask({ title: suggestion.title });
      setSuggestions(suggestions.filter((s) => s.title !== suggestion.title));
      toast.success("Suggestion added as task");
      onAccept(suggestion.title);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create task"
      );
    }
  };

  const handleDismiss = (title: string) => {
    setSuggestions(suggestions.filter((s) => s.title !== title));
  };

  return (
    <div className="mb-4">
      {!isOpen ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={loadSuggestions}
          disabled={loading}
          className="text-primary"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          {loading ? "Getting suggestions..." : "Get AI Suggestions"}
        </Button>
      ) : (
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              AI Suggestions
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No suggestions available.
              </p>
            ) : (
              suggestions.map((suggestion) => (
                <Card key={suggestion.title} className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="font-medium text-sm">
                      {suggestion.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {suggestion.reason}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAccept(suggestion)}
                      >
                        Add Task
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismiss(suggestion.title)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={loadSuggestions}
              disabled={loading}
              className="text-primary"
            >
              <RefreshCw
                className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`}
              />
              Refresh suggestions
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
