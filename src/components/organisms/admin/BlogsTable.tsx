"use client";

import React from "react";
import {
  UniversalTable,
  TableColumn,
} from "@/components/organisms/admin/UniversalTable";
import { BlogWithTranslations } from "@/types/blog";
import { deleteBlog } from "@/actions/BlogAction";

interface BlogsTableProps {
  blogs: BlogWithTranslations[];
}

export default function BlogsTable({ blogs }: BlogsTableProps) {
  // Pretvaramo BlogWithTranslations u Record<string, unknown> format
  const tableData = blogs.map((blog) => ({
    ...blog,
    // Dodajemo dodatne computed fields za lakše sortiranje/pretraživanje
    blogName: blog.translations?.[0]?.title || "Untitled",
    blogDescription:
      blog.translations?.[0]?.shortDescription || "No description",
    orderNumber: blog.order,
  }));

  const handleCreateBlog = async () => {
    console.log("Create new blog");
    window.location.href = "/admin/blog/create";
  };

  const handleBlogClick = (blog: BlogWithTranslations) => {
    console.log("Edit blog:", blog.id);
  };

  const handleDeleteBlog = async (blog: BlogWithTranslations) => {
    if (
      confirm(
        `Jeste li sigurni da želite obrisati blog "${blog.translations?.[0]?.title}"?`
      )
    ) {
      try {
        const result = await deleteBlog(blog.id);
        if (result.success) {
          console.log("Blog deleted successfully");
          // Trebalo bi refreshati podatke ili pozvati callback
          window.location.reload();
        } else {
          console.error("Error deleting blog:", result.error);
          alert("Greška pri brisanju bloga: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Greška pri brisanju bloga");
      }
    }
  };

  const columns: TableColumn<BlogWithTranslations>[] = [
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
      key: "blogName",
      label: "Blog postovi",
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
              window.location.href = `/admin/blog/${item.id}/edit`;
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Uredi
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const originalBlog = blogs.find((b) => b.id === item.id);
              if (originalBlog) {
                handleDeleteBlog(originalBlog);
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
    // Pronađemo originalni blog objekt
    const originalBlog = blogs.find((b) => b.id === item.id);
    if (originalBlog) {
      handleBlogClick(originalBlog);
    }
  };

  return (
    <UniversalTable
      title="Blogs"
      data={tableData}
      columns={columns}
      searchableKeys={["blogName", "blogDescription"]}
      sortableColumns={["createdAt", "blogName", "orderNumber"]}
      createButtonText="Create blog"
      onCreateClick={handleCreateBlog}
      onRowClick={handleRowClick}
      emptyStateText="No blogs yet"
      emptyStateDescription="Create a new blog post or learn how to migrate existing blogs"
    />
  );
}
