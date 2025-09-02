"use client";

import React from "react";
import {
  UniversalTable,
  TableColumn,
} from "@/components/organisms/admin/UniversalTable";
import { ServiceWithTranslations } from "@/types/service";
import { hardCodeServices, deleteService } from "@/actions/ServiceAction";

interface ServicesTableProps {
  services: ServiceWithTranslations[];
}

export default function ServicesTable({ services }: ServicesTableProps) {
  // Pretvaramo ServiceWithTranslations u Record<string, unknown> format
  const tableData = services.map((service) => ({
    ...service,
    // Dodajemo dodatne computed fields za lakše sortiranje/pretraživanje
    serviceName: service.translations?.[0]?.title || "Untitled",
    serviceDescription: service.translations?.[0]?.subtitle || "No description",
    parentServiceName: service.parentService?.translations?.[0]?.title || null,
    childServicesCount: service.childServices?.length || 0,
    orderNumber: service.order,
  }));

  const handleCreateService = async () => {
    console.log("Create new service");
    await hardCodeServices();
  };

  const handleServiceClick = (service: ServiceWithTranslations) => {
    console.log("Edit service:", service.id);
  };

  const handleDeleteService = async (service: ServiceWithTranslations) => {
    if (
      confirm(
        `Jeste li sigurni da želite obrisati uslugu "${service.translations?.[0]?.title}"?`
      )
    ) {
      try {
        const result = await deleteService(service.id);
        if (result.success) {
          console.log("Service deleted successfully");
          // Trebalo bi refreshati podatke ili pozvati callback
          window.location.reload();
        } else {
          console.error("Error deleting service:", result.error);
          alert("Greška pri brisanju usluge: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Greška pri brisanju usluge");
      }
    }
  };

  const columns: TableColumn<ServiceWithTranslations>[] = [
    {
      key: "orderNumber",
      label: "Redoslijed",
      sortable: true,
      render: (value, item) => (
        <span className="text-sm font-medium text-gray-900">{item.order}</span>
      ),
      className: "text-center w-24",
    },
    {
      key: "serviceName",
      label: "Usluge",
      render: (value, item) => (
        <div className="flex flex-col">
          <span className="font-medium  text-gray-900 text-sm">
            {item.translations?.[0]?.title}
          </span>
          <span className="text-xs tracking-tight font-normal text-gray-500">
            {item.translations?.[0]?.subtitle}
          </span>
        </div>
      ),
    },
    {
      key: "parentServiceName",
      label: "Glavna usluga",
      render: (value) => (
        <span className="text-sm">{String(value || "-")}</span>
      ),
    },
    {
      key: "childServicesCount",
      label: "Podusluge",
      render: (value) => (
        <span className="text-sm font-medium">{String(value || 0)}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Kreirano",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value as string | Date).toLocaleDateString("hr-HR")}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "actions",
      label: "Akcije",
      render: (_, item) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/admin/services/${item.id}/edit`;
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Uredi
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const originalService = services.find((s) => s.id === item.id);
              if (originalService) {
                handleDeleteService(originalService);
              }
            }}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Obriši
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  const handleRowClick = (item: (typeof tableData)[0]) => {
    // Pronađemo originalni service objekt
    const originalService = services.find((s) => s.id === item.id);
    if (originalService) {
      handleServiceClick(originalService);
    }
  };

  return (
    <UniversalTable
      title="Services"
      data={tableData}
      columns={columns}
      searchableKeys={[
        "serviceName",
        "serviceDescription",
        "parentServiceName",
      ]}
      sortableColumns={["createdAt", "serviceName", "orderNumber"]}
      createButtonText="Create service"
      onCreateClick={handleCreateService}
      onRowClick={handleRowClick}
      emptyStateText="No services yet"
      emptyStateDescription="Create a new service or learn how to migrate existing services"
    />
  );
}
