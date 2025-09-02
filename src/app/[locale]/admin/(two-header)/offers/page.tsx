import React from "react";
import { getAllOffers } from "@/actions/OfferAction";

export default async function AdminOffersPage() {
  // Offers se dohvaćaju za layout sidebar - ova stranica je prazna
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const offers = await getAllOffers();

  return <></>;
}
