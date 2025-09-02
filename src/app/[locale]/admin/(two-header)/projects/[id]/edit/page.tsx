import { getAllServices } from "@/actions/ServiceAction";
import { getProjectById } from "@/actions/ProjectAction";
import { ProjectForm } from "@/components/organisms/admin/project/form/ProjectForm";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, services] = await Promise.all([
    getProjectById(id),
    getAllServices(),
  ]);

  if (!project) {
    notFound();
  }

  return <ProjectForm services={services} project={project} />;
}
