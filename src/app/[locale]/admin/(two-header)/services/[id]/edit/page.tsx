import { ServiceForm } from "@/components/organisms/admin/service/form/ServiceForm";
import { getAllServices } from "@/actions/ServiceAction";
import { getServiceById } from "@/actions/ServiceAction";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const services = await getAllServices();
  const service = await getServiceById(id);

  if (!service) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Usluga nije pronađena
          </h1>
          <p className="text-gray-600">
            Usluga s ID-om &quot;{id}&quot; ne postoji ili je obrisana.
          </p>
        </div>
      </div>
    );
  }

  return <ServiceForm services={services} service={service} />;
}
