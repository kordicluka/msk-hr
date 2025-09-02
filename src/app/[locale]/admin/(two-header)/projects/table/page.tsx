import { getAllProjects } from "@/actions/ProjectAction";
import ProjectsTable from "@/components/organisms/admin/ProjectsTable";

export default async function ProjectsTablePage() {
  const projects = await getAllProjects();

  return (
    <div className="h-full w-full p-8">
      <ProjectsTable projects={projects} />
    </div>
  );
}
