import { ServicesSidebar } from "@/components/organisms/admin/service/ServicesSidebar";
import { getAllServices } from "@/actions/ServiceAction";

export default async function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const services = await getAllServices();

  return (
    <div className="flex flex-1">
      <ServicesSidebar services={services} />
      <div className="flex-1 bg-white overflow-y-auto h-[calc(100vh-3.75rem)]">
        {children}
      </div>
    </div>
  );
}
