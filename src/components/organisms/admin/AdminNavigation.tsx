"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/atoms/admin/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
const navigationItems = [
  { path: "overview", label: "Overview" },
  { path: "services", label: "Services" },
  { path: "offers", label: "Offers" },
];

export default function NavigationTabs() {
  const pathname = usePathname();
  const currentPath = pathname.split("/").slice(1).join("/");
  console.log(currentPath);

  return (
    <div className=" bg-muted px-5 pb-2">
      <Tabs defaultValue="datoteka" className="w-full">
        <TabsList className="h-10 bg-transparent p-0 space-x-0">
          {navigationItems.map((item) => (
            <Link href={`/admin/${item.path}`} key={item.path}>
              <TabsTrigger
                key={item.path}
                value={item.path}
                className="cursor-pointer text-sm transition-all duration-300 rounded-none  border-b-2 border-transparent data-[state=active]:border-b-secondary/80 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 font-normal "
              >
                {item.label}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
