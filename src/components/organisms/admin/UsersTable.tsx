"use client";

import React from "react";
import {
  UniversalTable,
  TableColumn,
} from "@/components/organisms/admin/UniversalTable";
import { User } from "@/types/user";
import { hardCodeUsers, deleteUser } from "@/actions/UserActions";
import Image from "next/image";

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  // Pretvaramo User u Record<string, unknown> format
  const tableData = users.map((user) => ({
    ...user,
    // Dodajemo dodatne computed fields za lakše sortiranje/pretraživanje
    emailVerifiedText: user.emailVerified ? "Potvrđen" : "Nije potvrđen",
    emailDomain: user.email.split("@")[1] || "",
    hasImage: user.image ? "Da" : "Ne",
  }));

  const handleCreateUser = async () => {
    console.log("Create test users");
    await hardCodeUsers();
  };

  const handleUserClick = (user: User) => {
    console.log("Edit user:", user.id);
  };

  const handleDeleteUser = async (user: User) => {
    if (
      confirm(
        `Jeste li sigurni da želite obrisati korisnika "${
          user.name || user.email
        }"?`
      )
    ) {
      try {
        const result = await deleteUser(user.id);
        if (result.success) {
          console.log("User deleted successfully");
          // Trebalo bi refreshati podatke ili pozvati callback
          window.location.reload();
        } else {
          console.error("Error deleting user:", result.error);
          alert("Greška pri brisanju korisnika: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Greška pri brisanju korisnika");
      }
    }
  };

  const getEmailVerifiedBadge = (emailVerified: Date | null) => {
    if (emailVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Potvrđen
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Nije potvrđen
        </span>
      );
    }
  };

  const columns: TableColumn<User>[] = [
    {
      key: "name",
      label: "Ime",
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900">
          {String(value) || "N/A"}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700">{String(value)}</span>
      ),
    },
    {
      key: "emailVerified",
      label: "Email status",
      sortable: true,
      render: (value) => getEmailVerifiedBadge(value as Date | null),
      className: "text-center",
    },
    {
      key: "image",
      label: "Slika",
      render: (value) => {
        if (value) {
          return (
            <Image
              src={String(value)}
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
              width={32}
              height={32}
            />
          );
        }
        return (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">N/A</span>
          </div>
        );
      },
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
      label: "Stvoren",
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
              window.location.href = `/admin/users/${item.id}/edit`;
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Uredi
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const originalUser = users.find((u) => u.id === item.id);
              if (originalUser) {
                handleDeleteUser(originalUser);
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
    // Pronađemo originalni user objekt
    const originalUser = users.find((u) => u.id === item.id);
    if (originalUser) {
      handleUserClick(originalUser);
    }
  };

  return (
    <UniversalTable
      title="Korisnici"
      data={tableData}
      columns={columns}
      searchableKeys={[
        "name",
        "email",
        "emailVerifiedText",
        "emailDomain",
        "hasImage",
      ]}
      sortableColumns={[
        "name",
        "email",
        "emailVerified",
        "createdAt",
        "updatedAt",
      ]}
      createButtonText="Stvori test podatke"
      onCreateClick={handleCreateUser}
      onRowClick={handleRowClick}
      emptyStateText="Nema korisnika"
      emptyStateDescription="Dodajte korisnika ili kreirajte test podatke"
    />
  );
}
