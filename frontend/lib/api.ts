const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskListItem {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
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
}

export const api = new ApiClient();
