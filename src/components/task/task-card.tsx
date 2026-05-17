"use client";

import { Trash2, Check, Archive, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Task } from "@/types/task";
import { deleteTask, updateTask, archiveTask } from "@/services/task-service";
import { useTaskStore } from "@/store/task-store";
import { useAuthStore } from "@/store/auth-store";
import EditTaskDialog from "@/components/task/edit-task-dialog";
import {
  canArchiveTask,
  canDeleteTask,
  canUpdateTaskStatus,
  isTaskCreatedByAdmin,
} from "@/lib/task-permissions";
import { cardPadding } from "@/lib/responsive-classes";

interface TaskCardProps {
  task: Task;
}

const priorityStyles: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-500",
  medium: "bg-yellow-500/10 text-yellow-500",
  high: "bg-orange-500/10 text-orange-500",
  urgent: "bg-red-500/10 text-red-500",
};

function getAssigneeLabel(task: Task): string {
  if (typeof task.assignedTo === "object") {
    return `${task.assignedTo.name} (${task.assignedTo.email})`;
  }
  return "Assigned";
}

function getCreatorLabel(task: Task): string {
  if (typeof task.createdBy === "object") {
    return `${task.createdBy.name} (${task.createdBy.role})`;
  }
  return "Unknown";
}

export default function TaskCard({ task }: TaskCardProps) {
  const user = useAuthStore((state) => state.user);
  const removeTask = useTaskStore((state) => state.removeTask);
  const updateTaskStore = useTaskStore((state) => state.updateTask);

  const canDelete = canDeleteTask(user, task);
  const canArchive = canArchiveTask(user, task);
  const canToggleStatus = canUpdateTaskStatus(user, task);
  const showAdminCreatedBadge =
    user?.role === "manager" && isTaskCreatedByAdmin(task);

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== "completed";

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      removeTask(task._id);
      toast.success("Task deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const handleComplete = async () => {
    try {
      const newStatus =
        task.status === "completed" ? "todo" : "completed";
      const updatedData = await updateTask(task._id, { status: newStatus });
      updateTaskStore(updatedData);

      toast.success(
        task.status === "completed"
          ? "Task marked as pending"
          : "Task completed"
      );
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  const handleArchive = async () => {
    try {
      const updatedData = await archiveTask(task._id);
      updateTaskStore(updatedData);
      toast.success("Task archived");
    } catch (error) {
      console.error(error);
      toast.error("Archive failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`rounded-3xl border ${
        isOverdue ? "border-red-500/40" : "border-white/10"
      } bg-gradient-to-br from-white/5 to-white/[0.02] ${cardPadding} backdrop-blur-xl transition-all min-w-0`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`text-lg sm:text-xl font-semibold break-words ${
                task.status === "completed"
                  ? "line-through text-slate-500"
                  : "text-white"
              }`}
            >
              {task.title}
            </h3>

            {task.status === "completed" && (
              <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-500/20">
                Completed
              </span>
            )}

            {showAdminCreatedBadge && (
              <span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/20">
                From Admin
              </span>
            )}

            {task.archived && (
              <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/20">
                Archived
              </span>
            )}

            {isOverdue && (
              <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-300 border border-red-500/20">
                Overdue
              </span>
            )}
          </div>

          <p className="text-slate-400 mt-2 sm:mt-3 leading-relaxed text-sm sm:text-base break-words">
            {task.description}
          </p>

          <p className="text-xs text-slate-500 mt-2 sm:mt-3 break-words">
            Created by: {getCreatorLabel(task)}
          </p>
          <p className="text-xs text-slate-500 mt-1 break-words">
            Assigned to: {getAssigneeLabel(task)}
          </p>
        </div>

        {canDelete && (
          <button
            onClick={handleDelete}
            className="text-slate-400 hover:text-red-400 transition-all p-1"
            aria-label="Delete task"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
            priorityStyles[task.priority] || "bg-slate-500/10 text-slate-400"
          }`}
        >
          {task.priority} priority
        </span>

        <span className="text-sm text-slate-500">
          {task.createdAt
            ? new Date(task.createdAt).toLocaleDateString()
            : ""}
        </span>
      </div>

      {task.deadline && (
        <div className="mt-4 sm:mt-5 flex items-start sm:items-center gap-2 text-xs sm:text-sm text-slate-400 min-w-0">
          <CalendarDays size={16} className="shrink-0 mt-0.5 sm:mt-0" />
          <span className="break-words">
            Due:{" "}
            {new Date(task.deadline).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mt-6">
        {canToggleStatus && (
          <button
            onClick={handleComplete}
            className={`p-2 rounded-xl transition-all ${
              task.status === "completed"
                ? "bg-green-500 text-white"
                : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
            }`}
            title={
              task.status === "completed"
                ? "Mark as Pending"
                : "Mark as Completed"
            }
          >
            <Check size={18} />
          </button>
        )}

        {canArchive && task.status === "completed" && !task.archived && (
          <button
            onClick={handleArchive}
            className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-all"
            title="Archive Task"
          >
            <Archive size={18} />
          </button>
        )}

        <EditTaskDialog task={task} />
      </div>
    </motion.div>
  );
}
