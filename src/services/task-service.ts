import { API } from "@/lib/axios";
import { Task } from "@/types/task";

/** 
 * Define a specific interface for Task Creation 
 * createdBy is set server-side from the authenticated user, not sent from client
 */
export interface CreateTaskRequest extends Omit<Partial<Task>, "createdBy" | "createdAt" | "updatedAt"> {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  deadline?: string;
  assignedTo?: string; // Optional - if not provided, defaults to creator
  status?: "todo" | "in-progress" | "completed";
}

// GET ALL TASKS
export const getTasks = async (): Promise<Task[]> => {
  const response = await API.get("/tasks");
  return response.data;
};

// CREATE TASK
export const createTask = async (data: CreateTaskRequest) => {
  const response = await API.post("/tasks", data);
  return response.data;
};

// UPDATE TASK
export const updateTask = async (id: string, data: Partial<Task>) => {
  const response = await API.patch(`/tasks/${id}`, data);
  return response.data;
};

// DELETE TASK
export const deleteTask = async (id: string) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};

// ARCHIVE TASK
export const archiveTask = async (id: string, archived: boolean) => {
  const response = await API.patch(`/tasks/${id}`, { archived });
  return response.data;
};

// UPDATE STATUS
export const updateTaskStatus = async (
  id: string,
  status: "todo" | "in-progress" | "completed"
) => {
  const response = await API.patch(`/tasks/${id}`, { status });
  return response.data;
};

// UPDATE PRIORITY
export const updateTaskPriority = async (
  id: string,
  priority: "low" | "medium" | "high" | "urgent"
) => {
  const response = await API.patch(`/tasks/${id}`, { priority });
  return response.data;
};