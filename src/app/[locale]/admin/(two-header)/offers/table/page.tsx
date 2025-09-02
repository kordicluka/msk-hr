import OffersTable from "@/components/organisms/admin/OffersTable";
import React from "react";
import { getAllOffers } from "@/actions/OfferAction";

export default async function AdminTableViewOfferPage() {
  const offers = await getAllOffers();

  return <OffersTable offers={offers} />;
}
