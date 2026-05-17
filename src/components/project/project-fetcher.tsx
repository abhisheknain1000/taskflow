"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { getProjects } from "@/services/project-service";
import { useProjectStore } from "@/store/project-store";

export default function ProjectFetcher() {
  const setProjects = useProjectStore((state) => state.setProjects);
  const setLoading = useProjectStore((state) => state.setLoading);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projects = await getProjects();
        setProjects(projects);
      } catch {
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [setProjects, setLoading]);

  return null;
}
