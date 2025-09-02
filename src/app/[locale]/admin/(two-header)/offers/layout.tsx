import { OffersSidebar } from "@/components/organisms/admin/offer/OffersSidebar";
import { getAllOffers } from "@/actions/OfferAction";

export default async function OffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const offers = await getAllOffers();

  return (
    <div className="flex flex-1">
      <OffersSidebar offers={offers} />
      <div className="flex-1 bg-white overflow-y-auto h-[calc(100vh-3.75rem)]">
        {children}
      </div>
    </div>
  );
}
