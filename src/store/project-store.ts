import { create } from "zustand";
import { Project } from "@/types/project";

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  removeProject: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  loading: false,
  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),
  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((item) =>
        item._id === project._id ? project : item
      ),
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project._id !== id),
    })),
  setLoading: (loading) => set({ loading }),
}));
