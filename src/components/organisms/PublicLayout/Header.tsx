"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import NavbarLink from "../../molecules/NavbarLink";
import { useLocale, useTranslations } from "next-intl";
import { PhoneCall, Menu, X, Instagram } from "lucide-react";
import SelectLanguage from "../../composites/SelectLanguage";
import { Link } from "@/i18n/navigation";
import { ArrowButton, Button } from "@/components/atoms/button";
import { ServiceWithTranslations } from "@/types/service";
import { contactData } from "@/data/contactData";
import { usePathname } from "next/navigation";

export interface NavbarLinkType {
  label: string;
  href: string;
  dropdownColumns?: DropdownSection[];
}

export interface DropdownSection {
  title: string;
  column: DropdownColumn;
  description?: string;
  href?: string;
}

export interface DropdownColumn {
  label: string;
  href: string;
  dropdownItems: DropdownItem[];
}

export interface DropdownItem {
  label: string;
  href: string;
  description: string;
}

// Helper funkcija za kreiranje dropdown sections iz services
const createDropdownSections = (
  services: ServiceWithTranslations[],
  lang: "hr" | "en"
): DropdownSection[] => {
  return services
    .filter((service) => !service.parentServiceId) // Parent usluge
    .sort((a, b) => a.order - b.order) // Sortiranje po order polju
    .map((service) => {
      const serviceTranslation = service.translations?.find(
        (t) => t.languageCode === lang
      );
      const childServices = services
        .filter((s) => s.parentServiceId === service.id)
        .sort((a, b) => a.order - b.order); // Sortiranje child servisa po order-u

      return {
        title: serviceTranslation?.title || service.id,
        description: serviceTranslation?.shortDescription || "",
        href: `/services/${serviceTranslation?.slug}`,
        column: {
          label: serviceTranslation?.title || service.id,
          href: `/services/${serviceTranslation?.slug}`,
          dropdownItems: childServices.map((child) => {
            const childTranslation = child.translations?.find(
              (t) => t.languageCode === lang
            );
            return {
              label: childTranslation?.title || child.id,
              href: `/services/${serviceTranslation?.slug}/${childTranslation?.slug}`,
              description: childTranslation?.shortDescription || "",
            };
          }),
        },
      };
    });
};

export default function Header({
  services = [],
}: {
  services?: ServiceWithTranslations[];
}) {
  const t = useTranslations("header");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const lang = useLocale();

  const links: NavbarLinkType[] = [
    {
      label: t("services"),
      href: "/services",
      dropdownColumns: createDropdownSections(services, lang as "hr" | "en"),
    },
    {
      label: t("offers"),
      href: "/offers",
    },
    {
      label: t("blog"),
      href: "/blog",
    },
    {
      label: t("aboutUs"),
      href: "/about-us",
    },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState([false]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesMenuOpen, setMobileServicesMenuOpen] = useState(false);
  const [expandedMobileServices, setExpandedMobileServices] = useState<
    string[]
  >([]);

  // Hook za praćenje scroll pozicije
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
    };

    // Dodaj event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup funkcija
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Hook za prevenciju scroll-a kada je mobile menu otvoren
  useEffect(() => {
    if (isMobileMenuOpen || mobileServicesMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup funkcija
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, mobileServicesMenuOpen]);

  const handleDropdownOpen = (index: number) => {
    setIsDropdownOpen((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleCloseAllDropdowns = () => {
    setIsDropdownOpen([false]);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setMobileServicesMenuOpen(false); // Close services submenu when toggling main menu
    handleCloseAllDropdowns();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileServicesMenuOpen(false);
    handleCloseAllDropdowns();
  };

  const openMobileServicesMenu = () => {
    setMobileServicesMenuOpen(true);
  };

  const closeMobileServicesMenu = () => {
    setMobileServicesMenuOpen(false);
  };

  const toggleMobileServiceSection = (sectionTitle: string) => {
    setExpandedMobileServices((prev) => {
      if (prev.includes(sectionTitle)) {
        return prev.filter((title) => title !== sectionTitle);
      } else {
        return [sectionTitle]; // Only one section can be open at a time
      }
    });
  };

  const lightModePages = [
    "/about-us",
    "/o-nama",
    "/projects",
    "/blog/[blogSlug]",
    "/ponude",
    "/offers",
    "/projects",
  ];

  const isLightMode = lightModePages.some((page) => {
    const normalizedPathname = pathname.replace(/^\/[a-z]{2}\//, "/");

    if (page.includes("offers") || page.includes("ponude")) {
      const isBasePage =
        normalizedPathname === "/ponude" || normalizedPathname === "/offers";

      if (isBasePage) {
        return true;
      } else if (
        normalizedPathname.startsWith("/ponude/") ||
        normalizedPathname.startsWith("/offers/")
      ) {
        return false;
      }
    }

    if (page.includes("[blogSlug]")) {
      const result = normalizedPathname.includes(
        page.replace("[blogSlug]", "")
      );
      return result;
    }

    const result = normalizedPathname.includes(page);
    return result;
  });

  const isDarkMode =
    !isScrolled &&
    !isDropdownOpen.some((isOpen) => isOpen) &&
    !isLightMode &&
    !isMobileMenuOpen &&
    !mobileServicesMenuOpen;

  return (
    <header
      className={`flex-col fixed z-50 w-full flex items-center justify-center transition-all duration-100 ${
        isDarkMode ? "bg-transparent" : "bg-background"
      } `}
    >
      <div className="container relative mx-auto h-22 flex items-center justify-center px-4">
        <nav className="w-full relative h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src={
                  isDarkMode
                    ? "/logo/icon/icon_light.svg"
                    : "/logo/icon/icon_dark.svg"
                }
                alt="logo"
                width={700}
                height={700}
                className="w-20 h-12 lg:w-24 lg:h-14 object-left mr-3 -translate-y-1"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <ul className="flex h-full items-center justify-center">
              {links.map((link, index) => (
                <li key={link.label}>
                  <NavbarLink
                    link={link}
                    index={index}
                    handleDropdownOpen={handleDropdownOpen}
                    handleCloseAllDropdowns={handleCloseAllDropdowns}
                    isOpen={isDropdownOpen[index]}
                    isDarkMode={isDarkMode}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center justify-center space-x-2">
            <SelectLanguage isDarkMode={isDarkMode} />

            <Link href="/contact" className="mr-4">
              <Button
                variant="ghost"
                className={`text-sm ${
                  isDarkMode ? "text-white hover:text-white/80" : ""
                }`}
              >
                <PhoneCall size={20} strokeWidth={2} />
                <span className="hidden xl:inline">
                  {contactData.telephone}
                </span>
              </Button>
            </Link>

            <Link href="/contact">
              <ArrowButton className="rounded-full">
                <span className="">{t("contactUs")}</span>
              </ArrowButton>
            </Link>
          </div>

          {/* Mobile Right Side */}
          <div className="flex lg:hidden items-center space-x-2">
            <SelectLanguage isDarkMode={isDarkMode} />

            <button
              onClick={toggleMobileMenu}
              className={`p-2 transition-colors ${
                isDarkMode
                  ? "text-white hover:text-white/80"
                  : "text-gray-900 hover:text-gray-700"
              }`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed top-22 left-0 w-full bg-white z-40 flex flex-col animate-in slide-in-from-top-2 duration-300"
          style={{ height: "calc(100dvh - 5.5rem)" }}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              {/* Mobile Navigation Links */}
              <nav className="space-y-1">
                {links.map((link) => (
                  <div
                    key={link.label}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    {link.dropdownColumns ? (
                      // Services link with arrow - opens submenu
                      <button
                        onClick={openMobileServicesMenu}
                        className="flex items-center justify-between w-full py-4 text-lg font-medium text-gray-900 hover:text-primary"
                      >
                        <span>{link.label}</span>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    ) : (
                      // Regular links
                      <Link
                        href={link.href as never}
                        className="block py-4 text-lg font-medium text-gray-900 hover:text-primary"
                        onClick={closeMobileMenu}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Contact Section - Fixed at bottom */}
          <div className="bg-white">
            <div className="container mx-auto px-4 py-4">
              {/* Social Media Icons */}
              <div className="flex items-center justify-start space-x-6 mb-6">
                <a
                  href={contactData.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <Instagram size={20} />
                </a>
              </div>

              <Link
                href="/contact"
                className="flex items-center space-x-3 py-4 text-gray-900 hover:text-primary"
                onClick={closeMobileMenu}
              >
                <PhoneCall size={20} />
                <span>{contactData.telephone}</span>
              </Link>

              <Link href="/contact" onClick={closeMobileMenu}>
                <ArrowButton className="rounded-full w-full mt-3">
                  <span>{t("contactUs")}</span>
                </ArrowButton>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Services Submenu */}
      {mobileServicesMenuOpen && (
        <div
          className="lg:hidden fixed top-22 left-0 w-full bg-white z-50 flex flex-col animate-in slide-in-from-right-2 duration-300"
          style={{ height: "calc(100dvh - 5.5rem)" }}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              {/* Header with back button */}
              <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                <button
                  onClick={closeMobileServicesMenu}
                  className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("services")}
                </h2>
              </div>

              {/* Services Navigation */}
              <nav className="space-y-1">
                {/* Main Services Link */}
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <Link
                    href="/services"
                    className="flex-1 py-3 text-lg font-semibold text-gray-900 hover:text-primary"
                    onClick={closeMobileMenu}
                  >
                    {t("services") || "All Services"}
                  </Link>
                </div>

                {/* Service Categories */}
                {links
                  .find((link) => link.dropdownColumns)
                  ?.dropdownColumns?.map((section) => (
                    <div
                      key={section.title}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      {/* Category Title - Clickable to expand/collapse */}
                      <div className="flex items-center justify-between">
                        <Link
                          href={(section.href || "#") as never}
                          className="flex-1 py-3 text-lg font-semibold text-gray-900 hover:text-primary"
                          onClick={closeMobileMenu}
                        >
                          {section.title}
                        </Link>
                        {section.column.dropdownItems.length > 0 && (
                          <button
                            onClick={() =>
                              toggleMobileServiceSection(section.title)
                            }
                            className="p-2 text-gray-600 hover:text-gray-900"
                            aria-label={`Toggle ${section.title} submenu`}
                          >
                            <svg
                              className={`w-5 h-5 transform transition-transform duration-200 ${
                                expandedMobileServices.includes(section.title)
                                  ? "rotate-90"
                                  : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Category Description */}
                      {section.description && (
                        <p className="text-sm text-gray-600 mb-3 px-2">
                          {section.description}
                        </p>
                      )}

                      {/* Sub-services - Show only when expanded */}
                      {expandedMobileServices.includes(section.title) && (
                        <div className="pl-4 space-y-2 pb-4 animate-in slide-in-from-top-2 duration-200">
                          {section.column.dropdownItems.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href as never}
                              className="block py-2 text-base text-gray-700 hover:text-primary"
                              onClick={closeMobileMenu}
                            >
                              <div>
                                <div className="font-medium">{item.label}</div>
                                {item.description && (
                                  <div className="text-sm text-gray-500 mt-1">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </nav>
            </div>
          </div>

          {/* Mobile Contact Section - Fixed at bottom */}
          <div className="border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-4">
              <Link
                href="/contact"
                className="flex items-center space-x-3 py-2 text-gray-900 hover:text-primary"
                onClick={closeMobileMenu}
              >
                <PhoneCall size={20} />
                <span>{contactData.telephone}</span>
              </Link>

              <Link href="/contact" onClick={closeMobileMenu}>
                <ArrowButton className="rounded-full w-full mt-3">
                  <span>{t("contactUs")}</span>
                </ArrowButton>
              </Link>
            </div>
          </div>
        </div>
      )}

      {isDropdownOpen.some((isOpen) => isOpen) && (
        <div className="fixed top-26 left-0 w-full h-full pointer-events-none bg-black opacity-40  -z-1"></div>
      )}
    </header>
  );
}
