import { API } from "@/lib/axios";
import { unwrapApiData } from "@/lib/api-utils";
import { extractTasksFromResponse } from "@/lib/task-utils";
import { Task } from "@/types/task";

export interface CreateTaskRequest
  extends Omit<
    Partial<Task>,
    "createdBy" | "createdAt" | "updatedAt"
  > {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  deadline?: string;
  assignedTo?: string;
  project?: string;
  status?: "todo" | "in-progress" | "completed";
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await API.get("/tasks");
  return extractTasksFromResponse(unwrapApiData(response.data));
};

export const createTask = async (data: CreateTaskRequest) => {
  const response = await API.post("/tasks", data);
  return unwrapApiData<Task>(response.data);
};

export const updateTask = async (id: string, data: Partial<Task>) => {
  const response = await API.patch(`/tasks/${id}`, data);
  return unwrapApiData<Task>(response.data);
};

export const deleteTask = async (id: string) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};

export const archiveTask = async (id: string) => {
  const response = await API.patch(`/tasks/${id}/archive`);
  return unwrapApiData<Task>(response.data);
};
