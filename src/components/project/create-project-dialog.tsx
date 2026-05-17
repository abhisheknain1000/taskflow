"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/services/project-service";
import { useProjectStore } from "@/store/project-store";
import { dialogTriggerBtn } from "@/lib/responsive-classes";
function parseEmails(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((email) => email.trim())
    .filter(Boolean);
}

export default function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const addProject = useProjectStore((state) => state.addProject);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    managerEmails: "",
    memberEmails: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      managerEmails: "",
      memberEmails: "",
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      setLoading(true);
      const project = await createProject({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        managerEmails: parseEmails(formData.managerEmails),
        memberEmails: parseEmails(formData.memberEmails),
      });

      addProject(project);
      toast.success("Project created");
      setOpen(false);
      resetForm();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className={`${dialogTriggerBtn} shadow-lg shadow-[#7C5CFF]/20`}>
          <Plus size={20} />
          New Project
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#0B1020] border-white/10 text-white sm:max-w-[520px] max-h-[min(90vh,40rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Project</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add managers and members by their account emails.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-semibold">
              Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Project name"
              className="bg-white/5 border-white/10 h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-semibold">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Optional description"
              className="bg-white/5 border-white/10 min-h-[90px] rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-semibold">
              Manager emails
            </label>
            <Textarea
              value={formData.managerEmails}
              onChange={(e) =>
                setFormData({ ...formData, managerEmails: e.target.value })
              }
              placeholder="manager1@mail.com, manager2@mail.com"
              className="bg-white/5 border-white/10 min-h-[80px] rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-semibold">
              Member emails
            </label>
            <Textarea
              value={formData.memberEmails}
              onChange={(e) =>
                setFormData({ ...formData, memberEmails: e.target.value })
              }
              placeholder="member1@mail.com, member2@mail.com"
              className="bg-white/5 border-white/10 min-h-[80px] rounded-xl resize-none"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#7C5CFF] hover:bg-[#6D4EFF] h-12 rounded-xl font-bold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Creating...
              </span>
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
