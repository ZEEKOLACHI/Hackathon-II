"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api, Task } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskEditDialogProps {
  taskId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export default function TaskEditDialog({
  taskId,
  open,
  onOpenChange,
  onSaved,
}: TaskEditDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("none");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (open && taskId) {
      setFetching(true);
      api
        .getTask(taskId)
        .then((task: Task) => {
          setTitle(task.title);
          setDescription(task.description || "");
          setPriority(task.priority || "none");
          setDueDate(
            task.due_date
              ? new Date(task.due_date).toISOString().slice(0, 16)
              : ""
          );
        })
        .catch(() => toast.error("Failed to load task"))
        .finally(() => setFetching(false));
    }
  }, [open, taskId]);

  const handleSave = async () => {
    if (!taskId || !title.trim()) return;
    setLoading(true);
    try {
      await api.updateTask(taskId, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority: priority === "none" ? undefined : (priority as "low" | "medium" | "high"),
        due_date: dueDate || undefined,
      });
      toast.success("Task updated");
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        {fetching ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={1000}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-due-date">Due Date</Label>
              <Input
                id="edit-due-date"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || fetching}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
