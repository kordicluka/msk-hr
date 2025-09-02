import type React from "react";
import { AdminSideBarNavigation } from "@/components/organisms/admin/AdminSideBarNavigation";
import { SidebarProvider } from "@/components/atoms/sidebar";
import {
  AdminHeader,
  AdminHeaderLeft,
  AdminHeaderCenter,
  AdminHeaderRight,
} from "@/components/atoms/admin/header";
import Image from "next/image";
import UserMenu from "@/components/molecules/admin/UserMenu";
import AdminHeaderSearch from "@/components/organisms/admin/AdminHeaderSearch";

export const metadata = {
  title: "MSK - Admin",
  description: "Admin Dashboard for managing the application.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarProvider>
        <AdminSideBarNavigation />
        <div className="flex flex-1">
          <div className="h-14 bg-primary  overflow-hidden left-0 fixed z-50 w-full">
            {" "}
            <AdminHeader>
              {" "}
              <AdminHeaderLeft>
                {/* Left Section - Menu & Logo */}
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo/icon/icon_light.svg"
                    alt="Logo"
                    width={140}
                    height={140}
                    className="h-12 w-12"
                  />
                </div>
              </AdminHeaderLeft>{" "}
              {/* Center Section - Search */}
              <AdminHeaderCenter>
                {" "}
                <AdminHeaderSearch />{" "}
              </AdminHeaderCenter>
              {/* Right Section - Actions & User Menu */}
              <AdminHeaderRight>
                <div className="flex items-center gap-2">
                  <UserMenu />
                </div>
              </AdminHeaderRight>
            </AdminHeader>{" "}
          </div>
          <div className="flex flex-1 mt-14">{children}</div>
        </div>
      </SidebarProvider>
    </div>
  );
}
