import { PopulatedUserRef } from "@/types/task";

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string | PopulatedUserRef;
  managers: Array<string | PopulatedUserRef>;
  members: Array<string | PopulatedUserRef>;
  status: "active" | "archived";
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  managerEmails?: string[];
  memberEmails?: string[];
  status?: "active" | "archived";
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  managerEmails?: string[];
  memberEmails?: string[];
  status?: "active" | "archived";
}
