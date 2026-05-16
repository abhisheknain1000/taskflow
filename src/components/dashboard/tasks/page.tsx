"use client";

import { useMemo } from "react";

import TaskCard from "@/components/task/task-card";

import { useTaskStore } from "@/store/task-store";

export default function TasksPage() {

  const tasks =
    useTaskStore(
      (state) => state.tasks
    );

  // SORT PRIORITY

  const sortedTasks =
    useMemo(() => {

      const priorityOrder = {
        urgent: 4,
        high: 3,
        medium: 2,
        low: 1,
      };

      return [...tasks].sort(
        (a, b) =>

          priorityOrder[
            b.priority
          ] -

          priorityOrder[
            a.priority
          ]
      );

    }, [tasks]);

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
          All Tasks
        </h1>

        <p className="
          text-slate-400
          mt-1
        ">
          Sorted by priority
        </p>
      </div>

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
      ">

        {sortedTasks.map(
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