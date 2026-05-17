"use client";

import { useEffect, useMemo, useState } from "react";
import { Shield, Search } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import StatsCard from "@/components/dashboard/stats-card";
import TaskCard from "@/components/task/task-card";
import CreateTaskDialog from "@/components/task/create-task-dialog";
import { pageMain, pageSubtitle, pageTitle } from "@/lib/responsive-classes";
import { useTaskStore } from "@/store/task-store";
import { useAuthStore } from "@/store/auth-store";

export default function AdminDashboardView() {
  const router = useRouter();
  const { tasks, loading } = useTaskStore();
  const user = useAuthStore((state) => state.user);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Access denied");
      router.push("/dashboard");
    }
  }, [user, router]);

  const filteredTasks = useMemo(() => {
    const priorityOrder = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return tasks
      .filter((task) => {
        const matchesSearch = task.title
          .toLowerCase()
          .includes(search.toLowerCase());

        if (filter === "completed") {
          return matchesSearch && task.status === "completed";
        }

        if (filter === "in-progress") {
          return matchesSearch && task.status === "in-progress";
        }

        return matchesSearch;
      })
      .sort(
        (a, b) =>
          priorityOrder[b.priority] - priorityOrder[a.priority]
      );
  }, [tasks, search, filter]);

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex-1 overflow-y-auto min-w-0 ${pageMain}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Shield className="text-[#7C5CFF] shrink-0" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Admin Dashboard
            </h1>
          </div>
          <p className={pageSubtitle}>
            Manage managers, tasks, priorities, and workflow
          </p>
        </div>

        <div className="w-full sm:w-auto shrink-0 flex sm:justify-end">
          <CreateTaskDialog user={user} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard title="Total Tasks" value={tasks.length.toString()} />
        <StatsCard
          title="Completed"
          value={tasks
            .filter((task) => task.status === "completed")
            .length.toString()}
        />
        <StatsCard
          title="In Progress"
          value={tasks
            .filter((task) => task.status === "in-progress")
            .length.toString()}
        />
        <StatsCard
          title="Urgent"
          value={tasks
            .filter((task) => task.priority === "urgent")
            .length.toString()}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1 min-w-0">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 outline-none focus:border-[#7C5CFF] text-sm sm:text-base"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-12 w-full sm:w-auto sm:min-w-[10rem] rounded-2xl bg-[#151B2D] border border-white/10 px-4 text-white outline-none text-sm sm:text-base"
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In-Progress</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[220px] rounded-3xl bg-white/5 animate-pulse"
            />
          ))
        ) : filteredTasks.length === 0 ? (
          <p className="text-slate-500 text-base sm:text-lg col-span-full">
            No tasks found.
          </p>
        ) : (
          filteredTasks.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TaskCard task={task} />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}