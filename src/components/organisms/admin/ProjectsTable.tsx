"use client";

import React from "react";
import {
  UniversalTable,
  TableColumn,
} from "@/components/organisms/admin/UniversalTable";
import { ProjectWithTranslations } from "@/types/project";
import { hardCodeProjects, deleteProject } from "@/actions/ProjectAction";

interface ProjectsTableProps {
  projects: ProjectWithTranslations[];
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  // Pretvaramo ProjectWithTranslations u Record<string, unknown> format
  const tableData = projects.map((project) => ({
    ...project,
    // Dodajemo dodatne computed fields za lakše sortiranje/pretraživanje
    projectName: project.translations?.[0]?.title || "Untitled",
    projectDescription:
      project.translations?.[0]?.shortDescription || "No description",
    servicesCount: project.services?.length || 0,
    orderNumber: project.order,
    serviceNames:
      project.services
        ?.map((ps) => ps.service?.translations?.[0]?.title || "Unknown Service")
        .join(", ") || "",
  }));

  const handleCreateProject = async () => {
    console.log("Create new project");
    await hardCodeProjects();
  };

  const handleProjectClick = (project: ProjectWithTranslations) => {
    console.log("Edit project:", project.id);
  };

  const handleDeleteProject = async (project: ProjectWithTranslations) => {
    if (
      confirm(
        `Jeste li sigurni da želite obrisati projekt "${project.translations?.[0]?.title}"?`
      )
    ) {
      try {
        const result = await deleteProject(project.id);
        if (result.success) {
          console.log("Project deleted successfully");
          // Trebalo bi refreshati podatke ili pozvati callback
          window.location.reload();
        } else {
          console.error("Error deleting project:", result.error);
          alert("Greška pri brisanju projekta: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Greška pri brisanju projekta");
      }
    }
  };

  const columns: TableColumn<ProjectWithTranslations>[] = [
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
      key: "projectName",
      label: "Projekti",
      render: (value, item) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 text-sm">
            {item.translations?.[0]?.title}
          </span>
          <span className="text-xs tracking-tight font-normal text-gray-500">
            {item.translations?.[0]?.shortDescription}
          </span>
        </div>
      ),
    },
    {
      key: "serviceNames",
      label: "Usluge",
      render: (value, item) => (
        <div className="text-sm max-w-xs">
          <span className="truncate">
            {item.services
              ?.map(
                (ps) =>
                  ps.service?.translations?.[0]?.title || "Unknown Service"
              )
              .join(", ") || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "servicesCount",
      label: "Broj usluga",
      render: (value) => (
        <span className="text-sm font-medium">{String(value || 0)}</span>
      ),
      className: "text-center",
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
              window.location.href = `/admin/projects/${item.id}/edit`;
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Uredi
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const originalProject = projects.find((p) => p.id === item.id);
              if (originalProject) {
                handleDeleteProject(originalProject);
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
    // Pronađemo originalni project objekt
    const originalProject = projects.find((p) => p.id === item.id);
    if (originalProject) {
      handleProjectClick(originalProject);
    }
  };

  return (
    <UniversalTable
      title="Projects"
      data={tableData}
      columns={columns}
      searchableKeys={["projectName", "projectDescription", "serviceNames"]}
      sortableColumns={["createdAt", "projectName", "orderNumber"]}
      createButtonText="Create project"
      onCreateClick={handleCreateProject}
      onRowClick={handleRowClick}
      emptyStateText="No projects yet"
      emptyStateDescription="Create a new project or learn how to migrate existing projects"
    />
  );
}
