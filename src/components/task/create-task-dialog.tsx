"use client";

import { useState } from "react";

import { toast } from "sonner";

import {
  Plus,
  Loader2,
} from "lucide-react";

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

import { useTaskStore } from "@/store/task-store";

import { User } from "@/types/user";

interface CreateTaskDialogProps {
  user?: User | null;
}

type Priority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export default function CreateTaskDialog({
  user,
}: CreateTaskDialogProps) {

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const addTaskStore =
    useTaskStore(
      (state) =>
        state.addTask
    );

  const initialAssignedTo =
    user?.role === "member" &&
    user?.email
      ? user.email
      : "";

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      priority:
        "medium" as Priority,
      deadline: "",
      assignedTo:
        initialAssignedTo,
    });

  const resetForm = () => {

    setFormData({
      title: "",
      description: "",
      priority: "medium",
      deadline: "",
      assignedTo:
        user?.role ===
          "member" &&
        user?.email
          ? user.email
          : "",
    });
  };

  const handleSubmit =
    async () => {

      if (
        !formData.title.trim()
      ) {

        toast.error(
          "Title is required"
        );

        return;
      }

      if (!user?._id) {

        toast.error(
          "User session missing"
        );

        return;
      }

      // Validate assignedTo for admin/manager
      if (
        (user.role === "admin" ||
          user.role === "manager") &&
        !formData.assignedTo.trim()
      ) {
        toast.error(
          "Please assign task to a member via existing team member email "
        );
        return;
      }

      try {

        setLoading(true);

        const payload = {
          title:
            formData.title,

          description:
            formData.description,

          priority:
            formData.priority,

          deadline:
            formData.deadline ||
            undefined,

          assignedTo:
            formData.assignedTo ||
            undefined,
        };

        const response =
          await createTask(
            payload
          );

        const newTask =
          response.task ||
          response.data ||
          response;

        addTaskStore(
          newTask
        );

        toast.success(
          "Task created successfully"
        );

        setOpen(false);

        resetForm();

      } catch (error) {
        const err = error as any;

        console.log(err);

        toast.error(
          err?.response
            ?.data?.message ||
            "Failed to create task"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={(
        isOpen
      ) => {

        setOpen(isOpen);

        if (!isOpen) {
          resetForm();
        }
      }}
    >

      <DialogTrigger asChild>

        <Button
          className="
            bg-[#7C5CFF]
            hover:bg-[#6D4EFF]
            rounded-2xl
            px-6
            h-12
            gap-2
            shadow-lg
            shadow-[#7C5CFF]/20
            transition-all
            active:scale-95
          "
        >

          <Plus size={20} />

          Create New Task
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          bg-[#0B1020]
          border-white/10
          text-white
          sm:max-w-[500px]
        "
      >

        <DialogHeader>

          <DialogTitle
            className="
              text-2xl
              font-bold
            "
          >
            New Task
          </DialogTitle>

          <DialogDescription
            className="
              text-slate-400
            "
          >
            Create and assign
            a new task.
          </DialogDescription>
        </DialogHeader>

        <div className="
          space-y-5
          py-4
        ">

          {/* TITLE */}

          <div className="
            space-y-2
          ">

            <label
              className="
                text-xs
                text-slate-400
                ml-1
                uppercase
                font-semibold
              "
            >
              Title
            </label>

            <Input
              placeholder="Task title"
              value={
                formData.title
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title:
                    e.target.value,
                })
              }
              className="
                bg-white/5
                border-white/10
                h-12
                rounded-xl
                focus:border-[#7C5CFF]
              "
            />
          </div>

          {/* DESCRIPTION */}

          <div className="
            space-y-2
          ">

            <label
              className="
                text-xs
                text-slate-400
                ml-1
                uppercase
                font-semibold
              "
            >
              Description
            </label>

            <Textarea
              placeholder="What needs to be done?"
              value={
                formData.description
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
              className="
                bg-white/5
                border-white/10
                min-h-[100px]
                rounded-xl
                focus:border-[#7C5CFF]
                resize-none
              "
            />
          </div>

          {/* PRIORITY + DEADLINE */}

          <div className="
            grid
            grid-cols-2
            gap-4
          ">

            <div className="
              space-y-2
            ">

              <label
                className="
                  text-xs
                  text-slate-400
                  ml-1
                  uppercase
                  font-semibold
                "
              >
                Priority
              </label>

              <Select
                value={
                  formData.priority
                }
                onValueChange={(
                  val: Priority
                ) =>
                  setFormData({
                    ...formData,
                    priority: val,
                  })
                }
              >

                <SelectTrigger
                  className="
                    bg-white/5
                    border-white/10
                    h-12
                    rounded-xl
                  "
                >

                  <SelectValue />
                </SelectTrigger>

                <SelectContent
                  className="
                    bg-[#0B1020]
                    border-white/10
                    text-white
                  "
                >

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

            <div className="
              space-y-2
            ">

              <label
                className="
                  text-xs
                  text-slate-400
                  ml-1
                  uppercase
                  font-semibold
                "
              >
                Deadline
              </label>

              <Input
                type="datetime-local"
                value={
                  formData.deadline
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deadline:
                      e.target.value,
                  })
                }
                className="
                  bg-white/5
                  border-white/10
                  h-12
                  rounded-xl
                  [color-scheme:dark]
                "
              />
            </div>
          </div>

          {/* ASSIGNMENT */}

          {(user?.role ===
            "admin" ||
            user?.role ===
              "manager") && (

            <div className="
              space-y-2
            ">

              <label
                className="
                  text-xs
                  text-slate-400
                  ml-1
                  uppercase
                  font-semibold
                "
              >
                Assign To
              </label>

              <Input
                placeholder="member@gmail.com"
                value={
                  formData.assignedTo
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assignedTo:
                      e.target.value,
                  })
                }
                className="
                  bg-white/5
                  border-white/10
                  h-12
                  rounded-xl
                "
              />
            </div>
          )}

          {/* BUTTON */}

          <Button
            onClick={
              handleSubmit
            }
            disabled={loading}
            className="
              w-full
              bg-[#7C5CFF]
              hover:bg-[#6D4EFF]
              h-12
              rounded-xl
              font-bold
              transition-all
              shadow-lg
              shadow-[#7C5CFF]/10
            "
          >

            {loading ? (

              <span className="
                flex
                items-center
                gap-2
              ">

                <Loader2
                  className="
                    animate-spin
                  "
                  size={18}
                />

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