"use client";
import { useState } from "react";
import type React from "react";

import { Search, ChevronRight, ChevronDown } from "lucide-react";
import {
  SidebarContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/atoms/sidebar";

export interface SidebarDropdownItem {
  id: string;
  render: () => React.ReactNode;
  onClick?: () => void;
}

export interface SidebarItem {
  id: string;
  name?: string;
  categories: string[];
  type: "item" | "dropdown";
  render?: () => React.ReactNode;
  onClick?: () => void;
  children?: SidebarDropdownItem[];
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

export interface SidebarCategory {
  id: string;
  name: string;
  order: number;
  parent?: string;
}

export interface AdminTabbedSidebarProps {
  categories: SidebarCategory[];
  items: SidebarItem[];
  searchPlaceholder?: string;
}

export function AdminTabbedSidebar({
  categories,
  items,
  searchPlaceholder = "Select widget",
}: AdminTabbedSidebarProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(
    new Set(items.filter((item) => item.defaultOpen).map((item) => item.id))
  );

  const toggleDropdown = (itemId: string) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(itemId)) {
      newOpenDropdowns.delete(itemId);
    } else {
      newOpenDropdowns.add(itemId);
    }
    setOpenDropdowns(newOpenDropdowns);
  };

  const renderItem = (item: SidebarItem) => {
    if (item.type === "dropdown") {
      const isOpen = openDropdowns.has(item.id);

      return (
        <div key={item.id}>
          {/* Dropdown Header */}
          <button
            onClick={() => toggleDropdown(item.id)}
            className="w-full cursor-pointer font-medium text-gray-700 flex items-center  justify-between p-4 text-left text-sm  hover:bg-gray-100 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-5">
              {item.icon && (
                <div className="flex items-center justify-center w-7 h-7 bg-gray-50 rounded-lg">
                  {item.icon}
                </div>
              )}
              {item.name}
            </div>

            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {/* Dropdown Content */}
          {isOpen && item.children && (
            <div className="bg-gray-25">
              {item.children.map((child) => (
                <div
                  key={child.id}
                  className="pl-6 border-b border-gray-100 hover:bg-gray-100 transition-colors"
                  onClick={child.onClick}
                >
                  {child.render()}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Regular item
    return (
      <div key={item.id}>
        {item.render ? (
          item.render()
        ) : (
          <button
            onClick={item.onClick}
            className="w-full h-14 cursor-pointer font-medium text-gray-700 flex items-center gap-5 p-4 text-left text-sm  hover:bg-gray-100 transition-colors border-b border-gray-100"
          >
            {item.icon && (
              <div className="flex items-center justify-center w-7 h-7 bg-gray-50 rounded-lg">
                {item.icon}
              </div>
            )}
            {item.name}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <SidebarHeader className="p-0 gap-0">
        {/* Search */}
        <div className=" ">
          <div className="relative border-b  border-sidebar-border">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <SidebarInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10  shadow-none h-12 rounded-none border-none bg-gray-100 border-gray-200 text-sm"
            />
          </div>
        </div>
        <div className="flex border-b bg-white">
          {categories
            .filter((category) => !category.parent)
            .sort((a, b) => a.order - b.order)
            .map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex-1 px-4 py-3 text-xs font-medium tracking-tight uppercase ${
                  activeTab === category.id
                    ? "text-blue-500 border-b-2 border-blue-500 bg-white"
                    : "text-gray-700 hover:text-gray-900 bg-gray-50"
                }`}
              >
                {category.name}
              </button>
            ))}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0 gap-0">
        {items
          .filter((item) => item.categories.includes(activeTab))
          .map((item) => (
            <SidebarMenuItem key={item.id} className="list-none">
              {renderItem(item)}
            </SidebarMenuItem>
          ))}
        {categories
          .filter((category) => category.parent === activeTab)
          .sort((a, b) => a.order - b.order)
          .map((category) => (
            <SidebarMenu key={category.id} className="gap-0">
              <SidebarMenuItem key={category.id} className="list-none">
                <div className="font-semibold py-3 px-4 bg-gray-50  border-b border-gray-100 w-full text-xs text-gray-900">
                  {category.name}
                </div>
              </SidebarMenuItem>

              {items
                .filter((item) => item.categories.includes(category.id))
                .map((item) => (
                  <SidebarMenuItem key={item.id} className="list-none">
                    {renderItem(item)}
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          ))}
      </SidebarContent>

      <SidebarRail />
    </>
  );
}
