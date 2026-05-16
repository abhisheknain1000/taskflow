export interface Task {

  _id: string;

  title: string;

  description?: string;

  status:
    | "todo"
    | "in-progress"
    | "completed";

  priority:
    | "low"
    | "medium"
    | "high"
    | "urgent";

  archived: boolean;

  deadline?: string;

  completedAt?: string | null;

  createdBy: string;

  assignedTo: string;

  createdAt: string;

  updatedAt?: string;
}