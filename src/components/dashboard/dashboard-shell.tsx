import DashboardLayout from "@/components/dashboard/layout";
import TaskFetcher from "@/components/dashboard/task-fetcher";
import ProjectFetcher from "@/components/project/project-fetcher";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      <TaskFetcher />
      <ProjectFetcher />
      {children}
    </DashboardLayout>
  );
}
