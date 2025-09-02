import { getAllServices } from "@/actions/ServiceAction";
import { ProjectForm } from "@/components/organisms/admin/project/form/ProjectForm";

export default async function CreateProjectPage() {
  const services = await getAllServices();

  return <ProjectForm services={services} />;
}
