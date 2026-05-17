"use client";

import TaskCard from "@/components/task/task-card";
import { pageMain, pageSubtitle, pageTitle } from "@/lib/responsive-classes";
import { useTaskStore } from "@/store/task-store";

export default function CompletedPage() {
  const tasks = useTaskStore((state) => state.tasks);

  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <main className={`${pageMain} text-white`}>
      <div className="min-w-0">
        <h1 className={pageTitle}>Completed Tasks</h1>
        <p className={pageSubtitle}>Finished work items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
        {completedTasks.length === 0 ? (
          <p className="text-slate-500">No completed tasks.</p>
        ) : (
          completedTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))
        )}
      </div>
    </main>
  );
}
