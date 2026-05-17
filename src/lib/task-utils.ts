import { PopulatedUserRef, Task } from "@/types/task";

export function getAssignedToId(
  assignedTo: Task["assignedTo"] | PopulatedUserRef
): string {
  if (!assignedTo) return "";
  if (typeof assignedTo === "string") return assignedTo;
  return assignedTo._id ?? "";
}

export function extractTasksFromResponse(
  response: unknown
): Task[] {
  if (Array.isArray(response)) {
    return response;
  }

  const data = response as {
    tasks?: Task[];
    data?: Task[];
  };

  if (Array.isArray(data?.tasks)) {
    return data.tasks;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

export function isTaskAssignedToUser(
  task: Task,
  userId?: string
): boolean {
  if (!userId) return false;
  return getAssignedToId(task.assignedTo) === userId;
}
