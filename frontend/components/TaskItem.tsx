"use client";

import { TaskListItem } from "@/lib/api";
import { Pencil, Trash2, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskItemProps {
  task: TaskListItem;
  onToggleComplete: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const priorityVariant: Record<string, "destructive" | "secondary" | "outline"> = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
};

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const isOverdue = date < now && !task.completed;
    return { text: date.toLocaleDateString(), isOverdue };
  };

  const dueInfo = formatDueDate(task.due_date);

  return (
    <Card className={task.completed ? "opacity-60" : ""}>
      <CardContent className="flex items-center gap-3 p-4">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-medium truncate ${
                task.completed
                  ? "line-through text-muted-foreground"
                  : ""
              }`}
            >
              {task.title}
            </span>
            {task.priority && (
              <Badge variant={priorityVariant[task.priority] || "outline"} className="text-xs">
                {task.priority}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>{new Date(task.created_at).toLocaleDateString()}</span>
            {dueInfo && (
              <span
                className={`flex items-center gap-1 ${
                  dueInfo.isOverdue ? "text-destructive font-medium" : ""
                }`}
              >
                <CalendarDays className="h-3 w-3" />
                {dueInfo.text}
                {dueInfo.isOverdue && " (overdue)"}
              </span>
            )}
          </div>
        </div>

        <TooltipProvider>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(task.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
