"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Task } from "@/types/task";
import { updateTask } from "@/services/task-service";
import { getAssignableUsers } from "@/services/user-service";
import { useTaskStore } from "@/store/task-store";
import { useAuthStore } from "@/store/auth-store";
import {
  canEditTaskDetails,
  canUpdateTaskStatus,
  getAssigneeRoles,
} from "@/lib/task-permissions";
import { User } from "@/types/user";

interface EditTaskDialogProps {
  task: Task;
}

export default function EditTaskDialog({ task }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState<User[]>([]);

  const user = useAuthStore((state) => state.user);
  const updateTaskStore = useTaskStore((state) => state.updateTask);

  const isMember = user?.role === "member";
  const canEditDetails = canEditTaskDetails(user, task);
  const canEditStatus = canUpdateTaskStatus(user, task);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [assignedTo, setAssignedTo] = useState(() => {
    if (typeof task.assignedTo === "object" && task.assignedTo.email) {
      return task.assignedTo.email;
    }
    return "";
  });
  const [deadline, setDeadline] = useState(
    task.deadline
      ? new Date(task.deadline).toISOString().slice(0, 16)
      : ""
  );

  const allowedRoles = getAssigneeRoles(user);
  const filteredUsers = assignableUsers.filter(
    (assignee) =>
      assignee.email &&
      allowedRoles.includes(assignee.role as "manager" | "member")
  );

  useEffect(() => {
    if (!open || !user || user.role === "member") return;

    const loadUsers = async () => {
      try {
        const users = await getAssignableUsers();
        setAssignableUsers(users);
      } catch {
        toast.error("Failed to load assignable users");
      }
    };

    loadUsers();
  }, [open, user]);

  if (!canEditStatus) {
    return null;
  }

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const payload: Partial<Task> = isMember
        ? {
            status:
              status === "completed" ? "completed" : "todo",
          }
        : {
            title,
            description,
            priority,
            status,
            deadline,
            ...((user?.role === "admin" || user?.role === "manager") &&
            assignedTo
              ? { assignedTo }
              : {}),
          };

        const updatedTask = await updateTask(task._id, payload);
        updateTaskStore(updatedTask);
      toast.success("Task updated");
      setOpen(false);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
          aria-label="Edit task"
        >
          <Pencil size={18} />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#121A2B] border-white/10 text-white sm:max-w-[500px] max-h-[min(90vh,40rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isMember ? "Update Task Status" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {canEditDetails && (
            <>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Status</label>
            <Select
              value={isMember ? (status === "completed" ? "completed" : "todo") : status}
              onValueChange={(value) =>
                setStatus(
                  value as "todo" | "in-progress" | "completed"
                )
              }
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {isMember ? (
                  <>
                    <SelectItem value="todo">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {canEditDetails && (
            <>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Priority</label>
                <Select
                  value={priority}
                  onValueChange={(value) =>
                    setPriority(
                      value as "low" | "medium" | "high" | "urgent"
                    )
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Deadline</label>
                <Input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </>
          )}

          {(user?.role === "admin" || user?.role === "manager") &&
            canEditDetails && (
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Assign To</label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUsers.map((assignee) => (
                    <SelectItem
                      key={assignee._id}
                      value={assignee.email ?? ""}
                    >
                      {assignee.name} ({assignee.email}) — {assignee.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-[#7C5CFF] hover:bg-[#6D4EFF]"
          >
            {loading ? "Updating..." : "Update Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
