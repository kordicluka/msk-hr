import { getAllProjects } from "@/actions/ProjectAction";
import { ProjectsSidebar } from "@/components/organisms/admin/project/ProjectsSidebar";

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getAllProjects();

  return (
    <div className="flex flex-1">
      <ProjectsSidebar projects={projects} />
      <div className="flex-1 bg-white overflow-y-auto h-[calc(100vh-3.75rem)]">
        {children}
      </div>
    </div>
  );
}
