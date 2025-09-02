"use client";

import React from "react";
import {
  UniversalTable,
  TableColumn,
} from "@/components/organisms/admin/UniversalTable";
import { Newsletter, NewsletterStatus } from "@/types/newsletter";
import {
  hardCodeNewsletters,
  deleteNewsletter,
} from "@/actions/NewsletterAction";

interface NewslettersTableProps {
  newsletters: Newsletter[];
}

export default function NewslettersTable({
  newsletters,
}: NewslettersTableProps) {
  // Pretvaramo Newsletter u Record<string, unknown> format
  const tableData = newsletters.map((newsletter) => ({
    ...newsletter,
    // Dodajemo dodatne computed fields za lakše sortiranje/pretraživanje
    statusText:
      newsletter.status === NewsletterStatus.SUBSCRIBED
        ? "Pretplaćen"
        : "Odjavljen",
    emailDomain: newsletter.email.split("@")[1] || "",
  }));

  const handleCreateNewsletter = async () => {
    console.log("Create test newsletters");
    await hardCodeNewsletters();
  };

  const handleNewsletterClick = (newsletter: Newsletter) => {
    console.log("Edit newsletter:", newsletter.id);
  };

  const handleDeleteNewsletter = async (newsletter: Newsletter) => {
    if (
      confirm(
        `Jeste li sigurni da želite obrisati pretplatu "${newsletter.email}"?`
      )
    ) {
      try {
        const result = await deleteNewsletter(newsletter.id);
        if (result.success) {
          console.log("Newsletter deleted successfully");
          // Trebalo bi refreshati podatke ili pozvati callback
          window.location.reload();
        } else {
          console.error("Error deleting newsletter:", result.error);
          alert("Greška pri brisanju pretplate: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting newsletter:", error);
        alert("Greška pri brisanju pretplate");
      }
    }
  };

  const getStatusBadge = (status: NewsletterStatus) => {
    if (status === NewsletterStatus.SUBSCRIBED) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Pretplaćen
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Odjavljen
        </span>
      );
    }
  };

  const columns: TableColumn<Newsletter>[] = [
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900">
          {String(value)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => getStatusBadge(value as NewsletterStatus),
      className: "text-center",
    },
    {
      key: "emailDomain",
      label: "Domena",
      render: (value) => (
        <span className="text-sm text-gray-600">{String(value)}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Pretplaćen",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value as string | Date).toLocaleDateString("hr-HR")}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "updatedAt",
      label: "Ažuriran",
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
              window.location.href = `/admin/newsletters/${item.id}/edit`;
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Uredi
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const originalNewsletter = newsletters.find(
                (n) => n.id === item.id
              );
              if (originalNewsletter) {
                handleDeleteNewsletter(originalNewsletter);
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
    // Pronađemo originalni newsletter objekt
    const originalNewsletter = newsletters.find((n) => n.id === item.id);
    if (originalNewsletter) {
      handleNewsletterClick(originalNewsletter);
    }
  };

  return (
    <UniversalTable
      title="Newsletter Pretplate"
      data={tableData}
      columns={columns}
      searchableKeys={["email", "statusText", "emailDomain"]}
      sortableColumns={["email", "status", "createdAt", "updatedAt"]}
      createButtonText="Stvori test podatke"
      onCreateClick={handleCreateNewsletter}
      onRowClick={handleRowClick}
      emptyStateText="Nema newsletter pretplata"
      emptyStateDescription="Dodajte newsletter pretplatu ili kreirajte test podatke"
    />
  );
}
