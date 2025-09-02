import React from "react";
import { DropdownSection } from "../organisms/PublicLayout/Header";
import { Link } from "@/i18n/navigation";

export default function NavbarLinkDropdown({
  dropdownSections,
  isOpen,
  setIsOpen,
}: {
  dropdownSections: DropdownSection[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <div
      className={`absolute border-t border-gray-200 -translate-y-1 w-[100vw] left-1/2 -translate-x-1/2 shadow-xs top-full overflow-hidden z-20 bg-white
      ${isOpen ? " " : "hidden"} 
      transition-all duration-300 z-50`}
    >
      <div className="container mx-auto w-full px-4">
        {dropdownSections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10 py-6 lg:py-8 text-gray-800">
            {dropdownSections.map((section) => (
              <div key={section.title} className="overflow-hidden">
                <div className="flex justify-between w-full border-b border-border pb-3 items-center gap-4 mb-4">
                  {section.href ? (
                    <Link
                      href={section.href as never}
                      onClick={() => setIsOpen(false)}
                      className="tracking-tighter font-semibold text-xl lg:text-2xl hover:underline"
                    >
                      {section.title}
                    </Link>
                  ) : (
                    <span className="tracking-tighter font-semibold text-xl lg:text-2xl">
                      {section.title}
                    </span>
                  )}
                </div>

                <div className="space-y-2 pb-4 lg:pb-6">
                  {section.column.dropdownItems.map((item) => (
                    <div key={item.label} className="group/item">
                      <Link
                        href={item.href as never}
                        onClick={() => setIsOpen(false)}
                        className="flex items-start space-x-3 py-2 hover:underline"
                      >
                        <div>
                          <div className="font-medium text-base lg:text-lg pb-1">
                            {item.label}
                          </div>

                          {item.description && (
                            <p className="text-xs text-gray-500 pt-1.5 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
