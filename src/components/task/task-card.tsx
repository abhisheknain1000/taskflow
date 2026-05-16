    "use client";

    import { Trash2, Check, Archive, CalendarDays } from "lucide-react";
    import { motion } from "framer-motion";
    import { toast } from "sonner";
    import { Task } from "@/types/task";
    import { deleteTask, updateTask } from "@/services/task-service";
    import { useTaskStore } from "@/store/task-store";
    import EditTaskDialog from "@/components/task/edit-task-dialog";
    import { useAuthStore } from "@/store/auth-store";
    
    interface TaskCardProps {
      task: Task;
    }

    /** 
    * ✅ FIX: Using Record<string, string> allows TypeScript to index this object 
    * using any string key (like task.priority) without throwing a type error.
    */
    const priorityStyles: Record<string, string> = {
      low: "bg-blue-500/10 text-blue-500",
      medium: "bg-yellow-500/10 text-yellow-500",
      high: "bg-orange-500/10 text-orange-500",
      urgent: "bg-red-500/10 text-red-500",
    };

    export default function TaskCard({ task }: TaskCardProps) {
      const removeTask = useTaskStore((state) => state.removeTask);
      const updateTaskStore = useTaskStore((state) => state.updateTask);

      // Checks if the task is past its deadline and not yet completed
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
          const newStatus = task.status === "completed" ? "todo" : "completed";
          const response = await updateTask(task._id, { status: newStatus });

          // Handles various API response structures safely
          const updatedData = response.task || response.updatedTask || response.data || response;
          updateTaskStore(updatedData);

          toast.success(
            task.status === "completed" ? "Task marked as pending" : "Task completed"
          );
        } catch (error) {
          console.error(error);
          toast.error("Update failed");
        }
      };

      const handleArchive = async () => {
        try {
          const response = await updateTask(task._id, { archived: !task.archived });
          const updatedData = response.task || response.updatedTask || response.data || response;
          updateTaskStore(updatedData);

          toast.success(task.archived ? "Task restored" : "Task archived");
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
          } bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl transition-all`}
        >
          {/* HEADER: Title and Delete Button */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`text-xl font-semibold ${
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

              <p className="text-slate-400 mt-3 leading-relaxed">
                {task.description}
              </p>
            </div>

            <button
              onClick={handleDelete}
              className="text-slate-400 hover:text-red-400 transition-all p-1"
              aria-label="Delete task"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* PRIORITY + CREATION DATE */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                priorityStyles[task.priority] || "bg-slate-500/10 text-slate-400"
              }`}
            >
              {task.priority} priority
            </span>

            <span className="text-sm text-slate-500">
              {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ""}
            </span>
          </div>

          {/* DEADLINE DISPLAY */}
          {task.deadline && (
            <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
              <CalendarDays size={16} />
              <span>
                Due: {new Date(task.deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>
          )}

          {/* ACTION BUTTONS: Complete, Archive, and Edit */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleComplete}
              className={`p-2 rounded-xl transition-all ${
                task.status === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
              }`}
              title={task.status === "completed" ? "Mark as Pending" : "Mark as Completed"}
            >
              <Check size={18} />
            </button>

            <button
              onClick={handleArchive}
              className={`p-2 rounded-xl transition-all ${
                task.archived
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
              }`}
              title={task.archived ? "Restore Task" : "Archive Task"}
            >
              <Archive size={18} />
            </button>

            <EditTaskDialog task={task} />
          </div>
        </motion.div>
      );
    }