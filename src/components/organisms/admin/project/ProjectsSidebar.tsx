"use client";
import { ProjectWithTranslations } from "@/types/project";
import {
  AdminTabbedSidebar,
  SidebarItem,
  SidebarCategory,
} from "../AdminTabbedSidebar";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import { Sidebar } from "@/components/atoms/sidebar";

export function ProjectsSidebar({
  projects,
}: {
  projects: ProjectWithTranslations[];
}) {
  const router = useRouter();
  const sidebarCategories: SidebarCategory[] = [
    {
      id: "basic",
      name: "Osnovno",
      order: 0,
    },
    {
      id: "existing-projects",
      name: "Postojeći projekti",
      order: 0,
      parent: "basic",
    },
    {
      id: "statistics",
      name: "Statistike",
      order: 1,
    },
  ];

  const projectsSidebarItems: SidebarItem[] = projects.map((project) => {
    const projectTranslation = project.translations?.find(
      (translation) => translation.languageCode === "hr"
    );

    return {
      id: project.id,
      name: projectTranslation?.title,
      categories: ["existing-projects"],
      type: "dropdown",
      children: [
        {
          id: "edit" + project.id,
          name: "Osnovne informacije",
          render: () => (
            <div className="flex gap-5 py-3 cursor-pointer">
              <div className="flex items-center justify-center w-7 h-7 bg-gray-50 rounded-lg">
                <Edit strokeWidth={1} className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <div className="font-medium text-sm">Uredite projekt</div>
                <div className="text-xs text-gray-500">
                  Naslov, opis, sadržaj, slika, usluge, ...
                </div>
              </div>
            </div>
          ),
          onClick: () => {
            router.push(`/admin/projects/${project.id}/edit`);
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
        router.push("/admin/projects");
      },
    },
    {
      id: "table-view",
      name: "Tablični prikaz",
      categories: ["basic"],
      type: "item",
      onClick: () => {
        router.push("/admin/projects/table");
      },
    },
    {
      id: "create",
      name: "Kreiraj projekt",
      categories: ["basic"],
      type: "item",
      onClick: () => {
        router.push("/admin/projects/create");
      },
    },
  ];

  return (
    <Sidebar
      className={`translate-x-[4.75rem] h-[calc(100vh-3.75rem)] overflow-hidden mt-14 border-r border-sidebar-border bg-gray-50 `}
    >
      <AdminTabbedSidebar
        categories={sidebarCategories}
        items={sidebarItems.concat(projectsSidebarItems)}
      />{" "}
    </Sidebar>
  );
}
