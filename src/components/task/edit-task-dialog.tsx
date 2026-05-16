"use client";

import { useState } from "react";

import { toast } from "sonner";

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

import { Pencil } from "lucide-react";

import { Task } from "@/types/task";

import { updateTask } from "@/services/task-service";

import { useTaskStore } from "@/store/task-store";

import { useAuthStore } from "@/store/auth-store";

interface EditTaskDialogProps {
  task: Task;
}

export default function EditTaskDialog({
  task,
}: EditTaskDialogProps) {

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const user =
    useAuthStore(
      (state) =>
        state.user
    );

  const isMember =
    user?.role === "member";

  const isManager =
    user?.role === "manager";

  const isAdmin =
    user?.role === "admin";

  const [title, setTitle] =
    useState(task.title);

  const [
    description,
    setDescription,
  ] = useState(
    task.description
  );

  const [priority, setPriority] =
    useState(task.priority);

  const [status, setStatus] =
    useState(task.status);

  const [deadline, setDeadline] =
    useState(
      task.deadline
        ? new Date(
            task.deadline
          )
            .toISOString()
            .slice(0, 16)
        : ""
    );

  const updateTaskStore =
    useTaskStore(
      (state) =>
        state.updateTask
    );

  const handleUpdate =
    async () => {

      try {

        setLoading(true);

        // MEMBER CAN ONLY CHANGE STATUS

        const payload =
          isMember
            ? {
                status,
              }
            : {
                title,
                description,
                priority,
                status,
                deadline,
              };

        const response =
          await updateTask(
            task._id,
            payload
          );

        const updatedTask =
          response.task ||
          response.updatedTask ||
          response.data ||
          response;

        updateTaskStore(
          updatedTask
        );

        toast.success(
          "Task updated"
        );

        setOpen(false);

      } catch (error) {

        console.log(error);

        toast.error(
          "Update failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogTrigger asChild>

        <button
          className="
            p-2
            rounded-xl
            bg-blue-500/10
            text-blue-400
            hover:bg-blue-500/20
            transition-all
          "
        >
          <Pencil size={18} />
        </button>
      </DialogTrigger>

      <DialogContent
        className="
          bg-[#121A2B]
          border-white/10
          text-white
        "
      >

        <DialogHeader>

          <DialogTitle>
            Edit Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* TITLE */}

          {!isMember && (

            <div className="space-y-2">

              <label className="text-sm text-slate-300">
                Title
              </label>

              <Input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Task title"
                className="
                  bg-white/5
                  border-white/10
                "
              />
            </div>
          )}

          {/* DESCRIPTION */}

          {!isMember && (

            <div className="space-y-2">

              <label className="text-sm text-slate-300">
                Description
              </label>

              <Textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Task description"
                className="
                  bg-white/5
                  border-white/10
                "
              />
            </div>
          )}

          {/* STATUS */}

          <div className="space-y-2">

            <label className="text-sm text-slate-300">
              Status
            </label>

            <Select
              value={status}
              onValueChange={(
                value
              ) =>
                setStatus(
                  value as
                    | "todo"
                    | "in-progress"
                    | "completed"
                )
              }
            >

              <SelectTrigger
                className="
                  bg-white/5
                  border-white/10
                "
              >

                <SelectValue />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="todo">
                  Todo
                </SelectItem>

                <SelectItem value="in-progress">
                  In Progress
                </SelectItem>

                <SelectItem value="completed">
                  Completed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PRIORITY */}

          {!isMember && (

            <div className="space-y-2">

              <label className="text-sm text-slate-300">
                Priority
              </label>

              <Select
                value={priority}
                onValueChange={(
                  value
                ) =>
                  setPriority(
                    value as
                      | "low"
                      | "medium"
                      | "high"
                      | "urgent"
                  )
                }
              >

                <SelectTrigger
                  className="
                    bg-white/5
                    border-white/10
                  "
                >

                  <SelectValue />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="low">
                    Low
                  </SelectItem>

                  <SelectItem value="medium">
                    Medium
                  </SelectItem>

                  <SelectItem value="high">
                    High
                  </SelectItem>

                  <SelectItem value="urgent">
                    Urgent
                  </SelectItem>

                </SelectContent>
              </Select>
            </div>
          )}

          {/* DEADLINE */}

          {!isMember && (

            <div className="space-y-2">

              <label className="text-sm text-slate-300">
                Deadline
              </label>

              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) =>
                  setDeadline(
                    e.target.value
                  )
                }
                className="
                  bg-white/5
                  border-white/10
                "
              />
            </div>
          )}

          {/* UPDATE BUTTON */}

          <Button
            onClick={
              handleUpdate
            }
            disabled={loading}
            className="
              w-full
              bg-[#7C5CFF]
              hover:bg-[#6D4EFF]
            "
          >

            {loading
              ? "Updating..."
              : "Update Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}