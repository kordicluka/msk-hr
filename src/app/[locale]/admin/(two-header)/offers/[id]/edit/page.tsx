import { OfferForm } from "@/components/organisms/admin/offer/form/OfferForm";
import { getAllServices } from "@/actions/ServiceAction";
import { getOfferById } from "@/actions/OfferAction";

export default async function EditOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const services = await getAllServices();
  const offer = await getOfferById(id);

  if (!offer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ponuda nije pronađena
          </h1>
          <p className="text-gray-600">
            Ponuda s ID-om &quot;{id}&quot; ne postoji ili je obrisana.
          </p>
        </div>
      </div>
    );
  }

  return <OfferForm services={services} offer={offer} />;
}
