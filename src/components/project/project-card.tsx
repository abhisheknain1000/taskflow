"use client";

import { Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Project } from "@/types/project";
import { PopulatedUserRef } from "@/types/task";
import { deleteProject } from "@/services/project-service";
import { useProjectStore } from "@/store/project-store";
import { useAuthStore } from "@/store/auth-store";

interface ProjectCardProps {
  project: Project;
}

function formatPeople(
  people: Array<string | PopulatedUserRef>
): string {
  if (!people.length) return "None";

  return people
    .map((person) =>
      typeof person === "string"
        ? person
        : `${person.name} (${person.email})`
    )
    .join(", ");
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const user = useAuthStore((state) => state.user);
  const removeProject = useProjectStore((state) => state.removeProject);
  const isAdmin = user?.role === "admin";

  const handleDelete = async () => {
    try {
      await deleteProject(project._id);
      removeProject(project._id);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{project.name}</h3>
          <p className="text-slate-400 mt-2">
            {project.description || "No description"}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleDelete}
            className="text-slate-400 hover:text-red-400 transition-all p-1"
            aria-label="Delete project"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-300">
        <div className="flex items-start gap-2">
          <Users size={16} className="mt-0.5 text-[#7C5CFF]" />
          <div>
            <p className="font-medium text-white">Managers</p>
            <p>{formatPeople(project.managers)}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Users size={16} className="mt-0.5 text-cyan-400" />
          <div>
            <p className="font-medium text-white">Members</p>
            <p>{formatPeople(project.members)}</p>
          </div>
        </div>
      </div>

      <span
        className={`inline-block mt-5 px-3 py-1 rounded-full text-xs capitalize ${
          project.status === "active"
            ? "bg-green-500/10 text-green-400"
            : "bg-slate-500/10 text-slate-400"
        }`}
      >
        {project.status}
      </span>
    </div>
  );
}
