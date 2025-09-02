"use client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../atoms/breadcrumb";
import {
  AdminHeader,
  AdminHeaderLeft,
  AdminHeaderCenter,
} from "@/components/atoms/admin/header";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

export default function SpecificPageHeader() {
  const pathname = usePathname();

  const breadcrumb = useMemo(() => {
    const paths = pathname.split("/").filter((path) => path !== "");

    if (paths.length === 3 && paths[2] === "services") {
      return [
        { title: "Početna", href: "/" },
        { title: "Usluge", href: "/admin/services" },
      ];
    } else if (
      paths.length === 4 &&
      paths[2] === "services" &&
      paths[3] === "create"
    ) {
      return [
        { title: "Početna", href: "/" },
        { title: "Usluge", href: "/admin/services" },
        { title: "Dodaj uslugu", href: "/admin/services/create" },
      ];
    }
  }, [pathname]);

  const title = useMemo(() => {
    const paths = pathname.split("/").filter((path) => path !== "");

    if (paths.length === 3 && paths[2] === "services") {
      return "Usluge";
    } else if (
      paths.length === 4 &&
      paths[2] === "services" &&
      paths[3] === "create"
    ) {
      return "Dodaj uslugu";
    }
  }, [pathname]);

  return (
    <div className="flex justify-between pl-[5.75rem] pr-4  items-center fixed top-14 left-0 z-30 shadow-xs right-0 h-14 bg-white border-b border-gray-200">
      <AdminHeader>
        <AdminHeaderLeft>
          <h6 className="tracking-tighter font-semibold text-base">{title}</h6>
        </AdminHeaderLeft>
        <AdminHeaderCenter className="w-[50%] h-full items-center justify-center">
          <Breadcrumb className=" absolute left-1/2 -translate-x-1/2 px-10">
            <BreadcrumbList>
              {breadcrumb &&
                breadcrumb.length > 0 &&
                breadcrumb.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem key={index}>
                      <BreadcrumbLink className="text-xs" href={item.href}>
                        {item.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index !== breadcrumb.length - 1 && (
                      <BreadcrumbSeparator key={index + "separator"} />
                    )}
                  </React.Fragment>
                ))}
            </BreadcrumbList>
          </Breadcrumb>
        </AdminHeaderCenter>
      </AdminHeader>
    </div>
  );
}
