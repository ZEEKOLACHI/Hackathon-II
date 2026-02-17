"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, ParsedTask } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SmartTaskFormProps {
  onTaskCreated: () => void;
}

export default function SmartTaskForm({ onTaskCreated }: SmartTaskFormProps) {
  const [input, setInput] = useState("");
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);

  const handleParse = async (autoCreate: boolean = false) => {
    if (!input.trim()) return;

    setParsing(true);

    try {
      const parsed = await api.parseTask(input.trim());
      setParsedTask(parsed);

      if (autoCreate && parsed) {
        await createTask(parsed);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to parse task");
    } finally {
      setParsing(false);
    }
  };

  const createTask = async (task: ParsedTask) => {
    setLoading(true);

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
      toast.success("Task created");
      onTaskCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parsedTask) {
      await handleParse(true);
      return;
    }

    await createTask(parsedTask);
  };

  const handleClear = () => {
    setParsedTask(null);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleString();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (parsedTask) setParsedTask(null);
          }}
          placeholder="Try: 'Buy groceries tomorrow at 5pm high priority'"
          maxLength={500}
          className="flex-1"
        />
        {!parsedTask ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleParse()}
            disabled={parsing || !input.trim()}
          >
            {parsing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Parse"
            )}
          </Button>
        ) : (
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        )}
      </div>

      {parsedTask && (
        <Card className="mt-3 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-primary">
                AI Parsed Result
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            </div>

            <div className="space-y-2">
              <div className="font-semibold">{parsedTask.title}</div>

              {parsedTask.description && (
                <div className="text-sm text-muted-foreground">
                  {parsedTask.description}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {parsedTask.due_date && (
                  <Badge variant="secondary">
                    Due: {formatDate(parsedTask.due_date)}
                  </Badge>
                )}

                {parsedTask.priority && (
                  <Badge
                    variant={
                      parsedTask.priority === "high"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {parsedTask.priority} priority
                  </Badge>
                )}

                {parsedTask.categories?.map((cat) => (
                  <Badge key={cat} variant="outline">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}
