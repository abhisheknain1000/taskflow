"use client";

import TaskCard from "@/components/task/task-card";
import { pageMain, pageSubtitle, pageTitle } from "@/lib/responsive-classes";
import { useTaskStore } from "@/store/task-store";

export default function InProgressPage() {
  const tasks = useTaskStore((state) => state.tasks);

  const progressTasks = tasks.filter((task) => task.status === "in-progress");

  return (
    <main className={pageMain}>
      <div className="min-w-0">
        <h1 className={pageTitle}>In Progress</h1>
        <p className={pageSubtitle}>Active ongoing tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
        {progressTasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </main>
  );
}
