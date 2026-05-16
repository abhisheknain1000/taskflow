"use client";

import TaskCard from "@/components/task/task-card";

import { useTaskStore } from "@/store/task-store";

export default function CompletedPage() {

  const tasks =
    useTaskStore(
      (state) => state.tasks
    );

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "completed"
    );

  return (
    <div className="
      p-8
      text-white
    ">

      <div className="
        mb-8
      ">

        <h1 className="
          text-3xl
          font-bold
        ">
          Completed Tasks
        </h1>

        <p className="
          text-slate-400
          mt-2
        ">
          Finished work items
        </p>
      </div>

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
      ">

        {completedTasks.length ===
        0 ? (

          <div className="
            text-slate-500
          ">
            No completed tasks.
          </div>

        ) : (

          completedTasks.map(
            (task) => (

              <TaskCard
                key={task._id}
                task={task}
              />
            )
          )
        )}
      </div>
    </div>
  );
}                       