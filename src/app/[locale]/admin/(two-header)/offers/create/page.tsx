import { OfferForm } from "@/components/organisms/admin/offer/form/OfferForm";
import React from "react";
import { getAllServices } from "@/actions/ServiceAction";

export default async function CreateOfferPage() {
  const services = await getAllServices();
  return <OfferForm services={services} />;
}
