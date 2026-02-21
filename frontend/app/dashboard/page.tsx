"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession, signOut } from "@/lib/auth-client";
import { api, TaskListItem } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import TaskList from "@/components/TaskList";
import TaskSkeleton from "@/components/TaskSkeleton";
import TaskEditDialog from "@/components/TaskEditDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [tasks, setTasks] = useState<TaskListItem[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Dialog state
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth/signin");
    }
  }, [session, isPending, router]);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getTasks(filter);
      setTasks(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (session?.token) {
      api.setToken(session.token);
      loadTasks();
    }
  }, [session, loadTasks]);

  // Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTaskCreated = () => {
    loadTasks();
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await api.toggleComplete(id);
      toast.success("Task updated");
      loadTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleEdit = (id: number) => {
    setEditTaskId(id);
    setEditOpen(true);
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteTaskId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTaskId) return;
    try {
      await api.deleteTask(deleteTaskId);
      toast.success("Task deleted");
      setDeleteOpen(false);
      setDeleteTaskId(null);
      loadTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    api.clearToken();
    router.push("/");
    router.refresh();
  };

  // Client-side search filtering
  const filteredTasks = searchQuery
    ? tasks.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks;

  if (isPending) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto p-8">
          <TaskSkeleton />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar
        user={session.user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSignOut={handleSignOut}
        searchInputRef={searchInputRef}
      />

      <main className="max-w-4xl mx-auto p-6">
        <Tabs
          value={filter}
          onValueChange={(v) =>
            setFilter(v as "all" | "pending" | "completed")
          }
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <TaskSkeleton />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            isSearchResult={!!searchQuery}
          />
        )}
      </main>

      <TaskEditDialog
        taskId={editTaskId}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={loadTasks}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
