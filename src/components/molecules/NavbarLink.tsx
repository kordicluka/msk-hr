"use client";
import { Link } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef } from "react";
import NavbarLinkDropdown from "./NavbarLinkDropdown";
import { NavbarLinkType } from "../organisms/PublicLayout/Header";

export default function NavbarLink({
  link,
  index,
  handleDropdownOpen,
  handleCloseAllDropdowns,
  isOpen,
  isDarkMode,
}: {
  link: NavbarLinkType;
  index: number;
  handleDropdownOpen: (index: number) => void;
  handleCloseAllDropdowns: () => void;
  isOpen: boolean;
  isDarkMode: boolean;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (link.dropdownColumns) {
      e.preventDefault();
      handleDropdownOpen(index);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleCloseAllDropdowns();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleCloseAllDropdowns]);

  return (
    <div
      ref={dropdownRef}
      className={`group z-20 ${isOpen ? "border-b-2 border-primary" : ""}`}
    >
      <Link
        href={
          link.href as
            | "/"
            | "/services"
            | "/offers"
            | "/blog"
            | "/about-us"
            | "/contact"
        }
        className={`flex items-center gap-1 px-3 lg:px-6 py-4 lg:py-7 transition-colors ${
          isDarkMode ? "text-white hover:text-white/80" : "text-gray-900"
        }`}
        onClick={handleClick}
      >
        {link.label}
        {link.dropdownColumns && (
          <ChevronDown
            className={`w-3 h-3 lg:w-4 lg:h-4 ml-1 opacity-70 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </Link>
      {link.dropdownColumns && (
        <NavbarLinkDropdown
          dropdownSections={link.dropdownColumns}
          isOpen={isOpen}
          setIsOpen={handleCloseAllDropdowns}
        />
      )}
    </div>
  );
}
