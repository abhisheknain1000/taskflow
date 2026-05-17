"use client";

import { useMemo } from "react";

import TaskCard from "@/components/task/task-card";
import { pageMain, pageSubtitle, pageTitle } from "@/lib/responsive-classes";
import { useTaskStore } from "@/store/task-store";

export default function TasksPage() {
  const tasks = useTaskStore((state) => state.tasks);

  const sortedTasks = useMemo(() => {
    const priorityOrder = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...tasks].sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );
  }, [tasks]);

  return (
    <main className={pageMain}>
      <div className="min-w-0">
        <h1 className={pageTitle}>All Tasks</h1>
        <p className={pageSubtitle}>Sorted by priority</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
        {sortedTasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </main>
  );
}
