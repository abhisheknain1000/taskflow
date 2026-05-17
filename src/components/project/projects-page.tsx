"use client";

import { useAuthStore } from "@/store/auth-store";
import { useProjectStore } from "@/store/project-store";
import CreateProjectDialog from "@/components/project/create-project-dialog";
import ProjectCard from "@/components/project/project-card";

export default function ProjectsPage() {
  const user = useAuthStore((state) => state.user);
  const { projects, loading } = useProjectStore();
  const isAdmin = user?.role === "admin";

  return (
    <main className="p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-2">
            {isAdmin
              ? "Create projects and assign managers and members."
              : "Projects you are part of."}
          </p>
        </div>

        {isAdmin && <CreateProjectDialog />}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-48 rounded-3xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-slate-500 text-lg">No projects yet.</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}
