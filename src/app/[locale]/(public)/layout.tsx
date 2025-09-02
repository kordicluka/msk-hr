import Footer, {
  FooterColumn,
} from "@/components/organisms/PublicLayout/Footer";
import Header from "@/components/organisms/PublicLayout/Header";
import React from "react";
import Cookies from "@/components/organisms/PublicLayout/Cookies";
import { getAllServices } from "@/actions/ServiceAction";
import { getAllOffers } from "@/actions/OfferAction";
import { contactData } from "@/data/contactData";
import { getAllProjects } from "@/actions/ProjectAction";
import { getTranslations } from "next-intl/server";
import { CookiesProvider } from "@/contexts/CookiesContext";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const currentLocale = locale as "hr" | "en";
  const t = await getTranslations("footer");

  const services = await getAllServices(currentLocale);
  const offers = await getAllOffers(currentLocale);
  const projects = await getAllProjects(currentLocale);

  // Helper funkcija za dobijanje parent services
  const getParentServices = () => {
    return services
      .filter((service) => !service.parentServiceId)
      .sort((a, b) => a.order - b.order); // Sortiranje po order polju
  };

  const footerColumns: FooterColumn[] = [
    {
      categories: [
        ...getParentServices().map((service) => {
          return {
            title:
              service.translations?.find(
                (t) => t.languageCode === currentLocale
              )?.title || service.id,
            links:
              service.childServices?.map((childService) => ({
                title:
                  childService.translations?.find(
                    (t) => t.languageCode === currentLocale
                  )?.title || childService.id,
                href: `/services/${
                  service.translations?.find(
                    (t) => t.languageCode === currentLocale
                  )?.slug
                }/${
                  childService.translations?.find(
                    (t) => t.languageCode === currentLocale
                  )?.slug
                }`,
              })) || [],
          };
        }),
      ],
    },
    {
      categories: [
        {
          title: t("sectionOffers"),
          links: offers.map((offer) => ({
            title:
              offer.translations?.find((t) => t.languageCode === currentLocale)
                ?.title || offer.id,
            href: `/offers/${
              offer.translations?.find((t) => t.languageCode === currentLocale)
                ?.slug
            }`,
          })),
        },
      ],
    },
    {
      categories: [
        {
          title: t("sectionProjects"),
          links: projects.map((project) => ({
            title:
              project.translations?.find(
                (t) => t.languageCode === currentLocale
              )?.title || project.id,
            href: `/projects/${
              project.translations?.find(
                (t) => t.languageCode === currentLocale
              )?.slug
            }`,
          })),
        },
      ],
    },
    {
      categories: [
        {
          title: t("sectionPages"),
          links: [
            {
              title: t("home"),
              href: "/",
            },
            {
              title: t("services"),
              href: "/services",
            },
            {
              title: t("offers"),
              href: "/offers",
            },
            {
              title: t("aboutUs"),
              href: "/about-us",
            },
            {
              title: t("blog"),
              href: "/blog",
            },
            {
              title: t("contact"),
              href: "/contact",
            },
          ],
        },
        {
          title: t("sectionContactInfo"),
          links: [
            {
              title: contactData.email,
              href: "/about",
            },
            {
              title: contactData.telephone,
              href: "/",
            },
            {
              title: contactData.address,
              href: "/",
            },
          ],
        },
      ],
    },
  ];

  return (
    <CookiesProvider>
      {/* Add global structured data */}
      <meta name="apple-mobile-web-app-title" content="MSK" />
      <Header services={services} />
      <main className="flex-1">{children}</main>
      <Footer
        footerColumns={footerColumns}
        ctaTitle={t("ctaTitle")}
        ctaButtonPrimary={t("ctaButtonPrimary")}
        ctaButtonSecondary={t("ctaButtonSecondary")}
        ctaDescription={t("ctaDescription")}
        newsletterTitle={t("newsletterTitle")}
        newsletterDescription={t("newsletterDescription")}
        privacyItem1={t("privacyItem1")}
        privacyItem2={t("privacyItem2")}
        privacyItem3={t("privacyItem3")}
        newsletterErrorMessage={t("newsletterErrorMessage")}
        newsletterSuccessMessage={t("newsletterSuccessMessage")}
      />
      <Cookies />
    </CookiesProvider>
  );
}
