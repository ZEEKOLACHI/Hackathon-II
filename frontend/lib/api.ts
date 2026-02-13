const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  priority: "low" | "medium" | "high" | null;
  categories: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface TaskListItem {
  id: number;
  title: string;
  completed: boolean;
  due_date: string | null;
  priority: string | null;
  created_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high";
  categories?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high";
  categories?: string[];
}

// AI Types
export interface ParsedTask {
  title: string;
  description: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high" | null;
  categories: string[] | null;
}

export interface TaskSuggestion {
  title: string;
  reason: string;
}

export interface SummaryStats {
  total: number;
  high_priority: number;
  completed: number;
  overdue: number;
}

export interface TaskSummary {
  summary: string;
  stats: SummaryStats;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async getTasks(status: "all" | "pending" | "completed" = "all"): Promise<TaskListItem[]> {
    return this.request<TaskListItem[]>(`/api/tasks?status=${status}`);
  }

  async getTask(id: number): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`);
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    return this.request<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: number, data: UpdateTaskData): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.request<void>(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  }

  async toggleComplete(id: number): Promise<{ id: number; completed: boolean }> {
    return this.request<{ id: number; completed: boolean }>(
      `/api/tasks/${id}/complete`,
      { method: "PATCH" }
    );
  }

  // AI Endpoints
  async parseTask(text: string): Promise<ParsedTask> {
    return this.request<ParsedTask>("/api/tasks/parse", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  }

  async getSuggestions(): Promise<{ suggestions: TaskSuggestion[] }> {
    return this.request<{ suggestions: TaskSuggestion[] }>("/api/tasks/suggestions");
  }

  async categorizeTask(id: number): Promise<{ categories: string[] }> {
    return this.request<{ categories: string[] }>(`/api/tasks/${id}/categorize`, {
      method: "POST",
    });
  }

  async getSummary(): Promise<TaskSummary> {
    return this.request<TaskSummary>("/api/tasks/summary");
  }
}

export const api = new ApiClient();
