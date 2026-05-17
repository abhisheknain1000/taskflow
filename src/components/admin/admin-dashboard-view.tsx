"use client";

import { useEffect, useMemo, useState } from "react";
import { Shield, Search } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import StatsCard from "@/components/dashboard/stats-card";
import TaskCard from "@/components/task/task-card";
import CreateTaskDialog from "@/components/task/create-task-dialog";
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
      className="flex-1 p-8 overflow-y-auto"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <Shield className="text-[#7C5CFF]" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-slate-400 mt-2">
            Manage managers, tasks, priorities, and workflow
          </p>
        </div>

        <CreateTaskDialog user={user} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
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

      <motion.div className="mt-10 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 outline-none focus:border-[#7C5CFF]"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-12 rounded-2xl bg-[#151B2D] border border-white/10 px-4 text-white outline-none"
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In-Progress</option>
        </select>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[220px] rounded-3xl bg-white/5 animate-pulse"
            />
          ))
        ) : filteredTasks.length === 0 ? (
          <div className="text-slate-500 text-lg">No tasks found.</div>
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
