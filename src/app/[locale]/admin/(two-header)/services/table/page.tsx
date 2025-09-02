import ServicesTable from "@/components/organisms/admin/ServicesTable";
import React from "react";
import { getAllServices } from "@/actions/ServiceAction";

export default async function AdminTableViewServicePage() {
  const services = await getAllServices();

  return <ServicesTable services={services} />;
}
