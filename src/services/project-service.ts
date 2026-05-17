import { API } from "@/lib/axios";
import { unwrapApiData } from "@/lib/api-utils";
import {
  CreateProjectRequest,
  Project,
  UpdateProjectRequest,
} from "@/types/project";

export const getProjects = async (): Promise<Project[]> => {
  const response = await API.get("/projects");
  return unwrapApiData<Project[]>(response.data) ?? [];
};

export const createProject = async (data: CreateProjectRequest) => {
  const response = await API.post("/projects", data);
  return unwrapApiData<Project>(response.data);
};

export const updateProject = async (
  id: string,
  data: UpdateProjectRequest
) => {
  const response = await API.patch(`/projects/${id}`, data);
  return unwrapApiData<Project>(response.data);
};

export const deleteProject = async (id: string) => {
  const response = await API.delete(`/projects/${id}`);
  return response.data;
};
