"use client";

import TaskCard from "@/components/task/task-card";

import { useTaskStore } from "@/store/task-store";

export default function InProgressPage() {

  const tasks =
    useTaskStore(
      (state) => state.tasks
    );

  const progressTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "in-progress"
    );

  return (
    <main className="
      p-8
      space-y-6
    ">

      <div>

        <h1 className="
          text-3xl
          font-bold
          text-white
        ">
          In Progress
        </h1>

        <p className="
          text-slate-400
          mt-1
        ">
          Active ongoing tasks
        </p>
      </div>

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
      ">

        {progressTasks.map(
          (task) => (

            <TaskCard
              key={task._id}
              task={task}
            />
          )
        )}
      </div>
    </main>
  );
}