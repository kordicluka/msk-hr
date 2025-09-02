"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  BadgeEuro,
  Eye,
  FlaskConical,
  Mail,
  Newspaper,
  Presentation,
  Users,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/atoms/admin/tooltip";

type MainNavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

export function AdminSideBarNavigation() {
  const pathname = usePathname();

  const mainNavItems: MainNavItem[] = useMemo(
    () => [
      {
        name: "Overview",
        icon: <Eye strokeWidth={1.2} className="w-5 h-5" />,
        href: "/admin",
      },
      {
        name: "Services",
        icon: <FlaskConical strokeWidth={1.2} className="w-5 h-5" />,
        href: "/admin/services",
      },
      {
        name: "Offers",
        icon: <BadgeEuro strokeWidth={1.2} className="w-5 h-5" />,
        href: "/admin/offers",
      },
      {
        name: "Blog",
        icon: <Newspaper strokeWidth={1.2} className="w-5 h-5" />,
        href: "/admin/blog",
      },
      {
        name: "Projects",
        icon: <Presentation strokeWidth={1.2} className="w-5 h-5" />,
        href: "/admin/projects",
      },
      {
        name: "Newsletter",
        icon: <Mail strokeWidth={1.2} className="w-5   h-5" />,
        href: "/admin/newsletters",
      },
      {
        name: "Users",
        icon: <Users strokeWidth={1.2} className="w-5 h-5" />,
        href: "/admin/users",
      },
    ],
    []
  );

  const checkIfActive = () => {
    const activeItems = mainNavItems.filter((item) =>
      pathname.includes(item.href)
    );
    if (activeItems.length > 1) {
      return activeItems.sort((a, b) => b.href.length - a.href.length)[0];
    }
    return activeItems[0];
  };

  return (
    <div className="bg-white z-40  pt-16 w-[4.75rem] h-full border-r border-sidebar-border justify-center">
      <div className="flex flex-col h-full items-center">
        <div className="px-0 space-y-0 w-full">
          <div className="space-y-0 gap-0 w-full">
            {mainNavItems.map((item) => (
              <div key={item.href} className="py-1 h-auto w-full rounded-none">
                <div className="flex items-center gap-2 w-full justify-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href as never}
                        className={cn(
                          "flex border-l-3 py-1 border-transparent mr-1 justify-center  items-center gap-3 w-full transition-all duration-300"
                        )}
                      >
                        <div
                          className={cn(
                            "flex p-3  bg-gray-50 rounded-sm hover:bg-gray-100 transition-all duration-300 items-center gap-3",
                            checkIfActive()?.href === item.href &&
                              "bg-primary text-white hover:bg-primary/80"
                          )}
                        >
                          {item.icon}
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
