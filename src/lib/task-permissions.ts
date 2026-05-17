import { Task, PopulatedUserRef } from "@/types/task";
import { User } from "@/types/user";
import { getAssignedToId } from "@/lib/task-utils";

export function getCreatedById(
  createdBy: Task["createdBy"]
): string {
  if (!createdBy) return "";
  if (typeof createdBy === "string") return createdBy;
  return createdBy._id;
}

export function getCreatorRole(
  task: Task
): string | undefined {
  if (
    typeof task.createdBy === "object" &&
    task.createdBy?.role
  ) {
    return task.createdBy.role;
  }
  return undefined;
}

export function isTaskCreatedByAdmin(task: Task): boolean {
  return getCreatorRole(task) === "admin";
}

export function isTaskCreatedByManager(task: Task): boolean {
  return getCreatorRole(task) === "manager";
}

export function canCreateTask(user?: User | null): boolean {
  return user?.role === "admin" || user?.role === "manager";
}

export function canDeleteTask(
  user: User | null | undefined,
  task: Task
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role === "manager") {
    return getCreatedById(task.createdBy) === user._id;
  }
  return false;
}

export function canEditTaskDetails(
  user: User | null | undefined,
  task: Task
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role === "manager") {
    return getCreatedById(task.createdBy) === user._id;
  }
  return false;
}

export function canUpdateTaskStatus(
  user: User | null | undefined,
  task: Task
): boolean {
  if (!user) return false;
  if (user.role === "member") {
    return getAssignedToId(task.assignedTo) === user._id;
  }
  return canEditTaskDetails(user, task);
}

export function canArchiveTask(
  user: User | null | undefined,
  task: Task
): boolean {
  return canDeleteTask(user, task);
}

export function getAssigneeRoles(
  user?: User | null
): Array<"manager" | "member"> {
  if (user?.role === "admin") {
    return ["manager", "member"];
  }
  if (user?.role === "manager") {
    return ["member"];
  }
  return [];
}
