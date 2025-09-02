import { ServiceForm } from "@/components/organisms/admin/service/form/ServiceForm";
import React from "react";
import { getAllServices } from "@/actions/ServiceAction";

export default async function CreateServicePage() {
  const services = await getAllServices();
  return <ServiceForm services={services} />;
}
