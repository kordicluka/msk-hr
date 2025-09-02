"use client";

import React from "react";
import {
  UniversalTable,
  TableColumn,
} from "@/components/organisms/admin/UniversalTable";
import { OfferWithTranslations } from "@/types/offer";
import { hardCodeOffers, deleteOffer } from "@/actions/OfferAction";

interface OffersTableProps {
  offers: OfferWithTranslations[];
}

export default function OffersTable({ offers }: OffersTableProps) {
  // Pretvaramo OfferWithTranslations u Record<string, unknown> format
  const tableData = offers.map((offer) => ({
    ...offer,
    // Dodajemo dodatne computed fields za lakše sortiranje/pretraživanje
    offerName: offer.translations?.[0]?.title || "Untitled",
    offerDescription: offer.translations?.[0]?.description || "No description",
    servicesCount: offer.services?.length || 0,
    orderNumber: offer.order,
    priceRange: `${offer.priceFrom} - ${offer.priceTo} €`,
  }));

  const handleCreateOffer = async () => {
    console.log("Create new offer");
    await hardCodeOffers();
  };

  const handleOfferClick = (offer: OfferWithTranslations) => {
    console.log("Edit offer:", offer.id);
  };

  const handleDeleteOffer = async (offer: OfferWithTranslations) => {
    if (
      confirm(
        `Jeste li sigurni da želite obrisati ponudu "${offer.translations?.[0]?.title}"?`
      )
    ) {
      try {
        const result = await deleteOffer(offer.id);
        if (result.success) {
          console.log("Offer deleted successfully");
          // Trebalo bi refreshati podatke ili pozvati callback
          window.location.reload();
        } else {
          console.error("Error deleting offer:", result.error);
          alert("Greška pri brisanju ponude: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting offer:", error);
        alert("Greška pri brisanju ponude");
      }
    }
  };

  const columns: TableColumn<OfferWithTranslations>[] = [
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
      key: "offerName",
      label: "Ponude",
      render: (value, item) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 text-sm">
            {item.translations?.[0]?.title}
          </span>
          <span className="text-xs tracking-tight font-normal text-gray-500">
            {item.translations?.[0]?.description?.slice(0, 100)}...
          </span>
        </div>
      ),
    },

    {
      key: "priceRange",
      label: "Cijena",
      render: (value, item) => (
        <span className="text-sm font-medium text-green-600">
          {item.priceFrom} - {item.priceTo} €
        </span>
      ),
    },
    {
      key: "servicesCount",
      label: "Usluge",
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
              window.location.href = `/admin/offers/${item.id}/edit`;
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Uredi
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const originalOffer = offers.find((o) => o.id === item.id);
              if (originalOffer) {
                handleDeleteOffer(originalOffer);
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
    // Pronađemo originalni offer objekt
    const originalOffer = offers.find((o) => o.id === item.id);
    if (originalOffer) {
      handleOfferClick(originalOffer);
    }
  };

  return (
    <UniversalTable
      title="Offers"
      data={tableData}
      columns={columns}
      searchableKeys={["offerName", "offerDescription", "priceRange"]}
      sortableColumns={["createdAt", "offerName", "orderNumber"]}
      createButtonText="Create offer"
      onCreateClick={handleCreateOffer}
      onRowClick={handleRowClick}
      emptyStateText="No offers yet"
      emptyStateDescription="Create a new offer or learn how to migrate existing offers"
    />
  );
}
