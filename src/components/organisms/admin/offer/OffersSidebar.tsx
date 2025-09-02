"use client";
import { OfferWithTranslations } from "@/types/offer";
import {
  AdminTabbedSidebar,
  SidebarItem,
  SidebarCategory,
} from "../AdminTabbedSidebar";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import { Sidebar } from "@/components/atoms/sidebar";

export function OffersSidebar({ offers }: { offers: OfferWithTranslations[] }) {
  const router = useRouter();
  const sidebarCategories: SidebarCategory[] = [
    {
      id: "basic",
      name: "Osnovno",
      order: 0,
    },
    {
      id: "existing-offers",
      name: "Postojeće ponude",
      order: 0,
      parent: "basic",
    },
    {
      id: "statistics",
      name: "Statistike",
      order: 1,
    },
  ];

  const offersSidebarItems: SidebarItem[] = offers.map((offer) => {
    const offerTranslation = offer.translations?.find(
      (translation) => translation.languageCode === "hr"
    );

    return {
      id: offer.id,
      name: offerTranslation?.title,
      categories: ["existing-offers"],
      type: "dropdown",
      children: [
        {
          id: "edit" + offer.id,
          name: "Osnovne informacije",
          render: () => (
            <div className="flex gap-5 py-3 cursor-pointer">
              <div className="flex items-center justify-center w-7 h-7 bg-gray-50 rounded-lg">
                <Edit strokeWidth={1} className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <div className="font-medium text-sm">Uredite ponudu</div>
                <div className="text-xs text-gray-500">
                  Naslov, opis, sadržaj, cijena, usluge, ...
                </div>
              </div>
            </div>
          ),
          onClick: () => {
            router.push(`/admin/offers/${offer.id}/edit`);
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
        router.push("/admin/offers");
      },
    },
    {
      id: "table-view",
      name: "Tablični prikaz",
      categories: ["basic"],
      type: "item",
      onClick: () => {
        router.push("/admin/offers/table");
      },
    },
    {
      id: "create",
      name: "Kreiraj ponudu",
      categories: ["basic"],
      type: "item",
      onClick: () => {
        router.push("/admin/offers/create");
      },
    },
  ];

  return (
    <Sidebar
      className={`translate-x-[4.75rem] h-[calc(100vh-3.75rem)] overflow-hidden mt-14 border-r border-sidebar-border bg-gray-50 `}
    >
      <AdminTabbedSidebar
        categories={sidebarCategories}
        items={sidebarItems.concat(offersSidebarItems)}
      />{" "}
    </Sidebar>
  );
}
