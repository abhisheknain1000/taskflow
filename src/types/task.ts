export interface PopulatedUserRef {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
}

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

  createdBy: string | PopulatedUserRef;

  assignedTo: string | PopulatedUserRef;

  project?: string | { _id: string; name: string; status?: string };

  createdAt: string;

  updatedAt?: string;
}