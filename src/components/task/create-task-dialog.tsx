"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createTask } from "@/services/task-service";
import { getAssignableUsers } from "@/services/user-service";
import { useTaskStore } from "@/store/task-store";
import { useProjectStore } from "@/store/project-store";
import { User } from "@/types/user";
import { getAssigneeRoles } from "@/lib/task-permissions";
import { dialogTriggerBtn } from "@/lib/responsive-classes";

interface CreateTaskDialogProps {
  user?: User | null;
}

type Priority = "low" | "medium" | "high" | "urgent";

export default function CreateTaskDialog({
  user,
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState<User[]>([]);
  const addTaskStore = useTaskStore((state) => state.addTask);
  const projects = useProjectStore((state) => state.projects);

  const allowedRoles = getAssigneeRoles(user);
  const filteredUsers = assignableUsers.filter(
    (assignee) =>
      assignee.email &&
      allowedRoles.includes(assignee.role as "manager" | "member")
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    deadline: "",
    assignedTo: "",
    project: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      deadline: "",
      assignedTo: "",
      project: "",
    });
  };

  useEffect(() => {
    if (!open || !user) return;

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

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!user?._id) {
      toast.error("User session missing");
      return;
    }

    if (!formData.assignedTo.trim()) {
      toast.error(
        user.role === "admin"
          ? "Please assign the task to a manager or member"
          : "Please assign the task to a member"
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        deadline: formData.deadline || undefined,
        assignedTo: formData.assignedTo,
        project: formData.project || undefined,
      };

      const newTask = await createTask(payload);
      addTaskStore(newTask);
      toast.success("Task created successfully");
      setOpen(false);
      resetForm();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          className={`${dialogTriggerBtn} shadow-lg shadow-[#7C5CFF]/20 transition-all active:scale-95`}
        >
          <Plus size={20} className="shrink-0" />
          Create New Task
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          z-[100]
          w-[calc(100%-2rem)]
          max-w-[500px]
          max-h-[min(90dvh,40rem)]
          overflow-y-auto
          border-white/10
          bg-[#0B1020]
          p-6
          text-white
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
            New Task
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {user.role === "admin"
              ? "Assign to a manager or member."
              : "Assign to a team member."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 ml-1 uppercase font-semibold">
              Title
            </label>
            <Input
              placeholder="Task title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#7C5CFF]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 ml-1 uppercase font-semibold">
              Description
            </label>
            <Textarea
              placeholder="What needs to be done?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-white/5 border-white/10 min-h-[100px] rounded-xl focus:border-[#7C5CFF] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 ml-1 uppercase font-semibold">
                Priority
              </label>
              <Select
                value={formData.priority}
                onValueChange={(val: Priority) =>
                  setFormData({ ...formData, priority: val })
                }
              >
                <SelectTrigger className="w-full bg-white/5 border-white/10 h-12 rounded-xl text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[110] bg-[#0B1020] border-white/10 text-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 ml-1 uppercase font-semibold">
                Deadline
              </label>
              <Input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="bg-white/5 border-white/10 h-12 rounded-xl [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 ml-1 uppercase font-semibold">
              Assign To
            </label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) =>
                setFormData({ ...formData, assignedTo: value })
              }
            >
              <SelectTrigger className="w-full bg-white/5 border-white/10 h-12 rounded-xl text-white">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent className="z-[110] bg-[#0B1020] border-white/10 text-white">
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

          {projects.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs text-slate-400 ml-1 uppercase font-semibold">
                Project (optional)
              </label>
              <Select
                value={formData.project}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    project: value === "none" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="w-full bg-white/5 border-white/10 h-12 rounded-xl text-white">
                  <SelectValue placeholder="No project" />
                </SelectTrigger>
                <SelectContent className="z-[110] bg-[#0B1020] border-white/10 text-white">
                  <SelectItem value="none">No project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full border-0 bg-[#7C5CFF] text-white hover:bg-[#6D4EFF] hover:text-white h-12 rounded-xl font-bold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Creating...
              </span>
            ) : (
              "Confirm Create Task"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
