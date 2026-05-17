"use client";

import { useEffect } from "react";

import { toast } from "sonner";

import { getTasks } from "@/services/task-service";
import { useTaskStore } from "@/store/task-store";

export default function TaskFetcher() {
  const setTasks = useTaskStore((state) => state.setTasks);
  const setLoading = useTaskStore((state) => state.setLoading);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasks = await getTasks();
        setTasks(tasks);
      } catch {
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [setTasks, setLoading]);

  return null;
}
