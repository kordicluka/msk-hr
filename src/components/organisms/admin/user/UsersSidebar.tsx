"use client";
import { User } from "@/types/user";
import {
  AdminTabbedSidebar,
  SidebarItem,
  SidebarCategory,
} from "../AdminTabbedSidebar";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import { Sidebar } from "@/components/atoms/sidebar";

export function UsersSidebar({
  users,
}: {
  users: User[];
}) {
  const router = useRouter();
  const sidebarCategories: SidebarCategory[] = [
    {
      id: "basic",
      name: "Osnovno",
      order: 0,
    },
    {
      id: "existing-users",
      name: "Postojeći korisnici",
      order: 0,
      parent: "basic",
    },
    {
      id: "statistics",
      name: "Statistike",
      order: 1,
    },
  ];

  const usersSidebarItems: SidebarItem[] = users
    .slice(0, 10)
    .map((user) => {
      return {
        id: user.id,
        name: user.name || user.email,
        categories: ["existing-users"],
        type: "dropdown",
        children: [
          {
            id: "edit" + user.id,
            name: "Osnovne informacije",
            render: () => (
              <div className="flex gap-5 py-3 cursor-pointer">
                <div className="flex items-center justify-center w-7 h-7 bg-gray-50 rounded-lg">
                  <Edit strokeWidth={1} className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <div className="font-medium text-sm">Uredi korisnika</div>
                  <div className="text-xs text-gray-500">
                    Ime, email, lozinka, ...
                  </div>
                </div>
              </div>
            ),
            onClick: () => {
              router.push(`/admin/users/${user.id}/edit`);
            },
          },
        ],
      };
    });

  const sidebarItems: SidebarItem[] = [
    {
      id: "overview",
      name: "Osnovni pregled",
      categories: ["basic"],
      type: "item",
      onClick: () => {
        router.push("/admin/users");
      },
    },
    {
      id: "table-view",
      name: "Tablični prikaz",
      categories: ["basic"],
      type: "item",
      onClick: () => {
        router.push("/admin/users/table");
      },
    },
    {
      id: "create",
      name: "Kreiraj korisnika",
      categories: ["basic"],
      type: "item",
      onClick: () => {
        router.push("/admin/users/create");
      },
    },
    {
      id: "stats",
      name: "Statistike",
      categories: ["statistics"],
      type: "item",
      onClick: () => {
        router.push("/admin/users/stats");
      },
    },
  ];

  return (
    <Sidebar
      className={`translate-x-[4.75rem] h-[calc(100vh-3.75rem)] overflow-hidden mt-14 border-r border-sidebar-border bg-gray-50 `}
    >
      <AdminTabbedSidebar
        categories={sidebarCategories}
        items={sidebarItems.concat(usersSidebarItems)}
      />{" "}
    </Sidebar>
  );
}