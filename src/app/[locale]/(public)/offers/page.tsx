import React from "react";
import { getAllOffers } from "@/actions/OfferAction";
import { getParentServices } from "@/actions/ServiceAction";
import { getUrl } from "@/lib/s3";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/atoms/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/atoms/badge";
import { ArrowButton } from "@/components/atoms/button";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { OffersServiceFilter } from "@/components/composites/public/OffersServiceFilter";
import { PageTitle } from "@/components/atoms/PageTitle";
import { getTranslations } from "next-intl/server";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";
import { Metadata } from "next";

interface OffersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as "hr" | "en";
  const t = await getTranslations("metadata.offers");

  const title = t("title");
  const description = t("description");
  const keywordsString = t("keywords");
  const keywords = keywordsString.split(",").map((keyword) => keyword.trim());
  const seoPath = t("path");

  const alternateLanguages: { [key: string]: string } = {
    hr: "/ponude",
    en: "/en/offers",
  };

  const ogImageParams = new URLSearchParams();
  ogImageParams.set("title", title);
  ogImageParams.set("locale", currentLocale);
  ogImageParams.set(
    "url",
    currentLocale === "hr" 
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/${seoPath}` || `https://www.msk.hr/${seoPath}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/en/${seoPath}` || `https://www.msk.hr/en/${seoPath}`
  );
  const ogImageUrl = `/api/og?${ogImageParams.toString()}`;

  return await generateSEOMetadata({
    title,
    description,
    image: ogImageUrl,
    url: currentLocale === "hr" ? seoPath : `/en/${seoPath}`,
    type: "website",
    locale: currentLocale,
    keywords,
    alternateLanguages,
  });
}

export default async function OffersPage({
  searchParams,
  params,
}: OffersPageProps) {
  const { locale } = await params;
  const currentLocale = locale as "hr" | "en";
  const t = await getTranslations("offersPage");

  const allOffers = await getAllOffers(currentLocale);
  const parentServices = await getParentServices(currentLocale);
  const resolvedSearchParams = await searchParams;

  // Filtriranje ponuda na osnovu odabranih usluga
  const selectedServices = resolvedSearchParams.services
    ? Array.isArray(resolvedSearchParams.services)
      ? resolvedSearchParams.services
      : resolvedSearchParams.services.split(",").filter(Boolean)
    : [];

  const filteredOffers =
    selectedServices.length > 0
      ? allOffers.filter((offer) =>
          offer.services.some((offerService) => {
            const service = offerService.service;
            const serviceSlug = service.translations?.[0]?.slug || "";

            // Provjeri da li je usluga ponude glavna usluga (odabrana)
            if (selectedServices.includes(serviceSlug)) {
              return true;
            }

            // Provjeri da li je parent usluga odabrana
            if (service.parentService) {
              const parentSlug =
                service.parentService.translations?.[0]?.slug || "";
              if (selectedServices.includes(parentSlug)) {
                return true;
              }
            }

            return false;
          })
        )
      : allOffers;

  const seo_t = await getTranslations("metadata.offers");

  const itemListSchema = generateStructuredData("ItemList", {
    title: seo_t("title"),
    description: seo_t("description"),
    url: locale === "hr" ? seo_t("path") : `/en/${seo_t("path")}`,
    locale: locale,
    numberOfItems: filteredOffers.length,
    items: filteredOffers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name:
          offer.translations?.find((t) => t.languageCode === currentLocale)
            ?.title || offer.translations[0]?.title,
        description:
          offer.translations?.find((t) => t.languageCode === currentLocale)
            ?.description || offer.translations[0]?.description,
        price: `${offer.priceFrom}-${offer.priceTo}`,
        priceCurrency: "EUR",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/${seo_t("path")}/${
          offer.translations?.find((t) => t.languageCode === currentLocale)
            ?.slug || offer.translations[0]?.slug
        }`,
        seller: {
          "@type": "Organization",
          name: "MSK",
        },
      },
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />
      <PageTitle
        size="lg"
        align="center"
        title={t("title")}
        className="bg-white"
      />
      <OffersServiceFilter services={parentServices} />
      <div className="lg:px-20 w-full px-4 xl:translate-y-[-3rem] mx-auto pb-20">
        {filteredOffers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t("noOffersText")}</p>
          </div>
        ) : (
          <div className="flex grow flex-wrap gap-3 justify-items-center w-full">
            {filteredOffers.map((offer, index) => (
              <article
                key={index}
                className="w-full flex-1 lg:w-auto max-w-[50rem] min-w-full lg:min-w-[35rem]"
              >
                <Card
                  className={cn(
                    "text-gray-900 border-none p-4 rounded-xl lg:h-[52rem] relative overflow-hidden shadow-none"
                  )}
                >
                  <CardHeader className="flex justify-start lg:h-[60%] h-[20rem] p-2 pb-0 overflow-hidden">
                    <Image
                      src={getUrl(offer.icon)}
                      alt={`${offer.translations[0].title} Icon`}
                      width={2000}
                      height={2000}
                      className="object-cover rounded-xl w-full h-full"
                    />
                  </CardHeader>

                  <CardContent className="lg:h-[35%] h-auto flex flex-col items-center pt-2 px-8 relative text-center">
                    <Badge
                      variant="outline"
                      className=" border-none mb-3 bg-green-100"
                    >
                      {offer.priceFrom}€ - {offer.priceTo}€
                    </Badge>
                    <h3 className=" lg:leading-relaxed text-3xl lg:text-3xl font-semibold text-gray-900 mb-3">
                      {offer.translations[0].title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">
                      {(
                        offer.translations?.find(
                          (t) => t.languageCode === currentLocale
                        )?.description || offer.translations[0]?.description
                      )?.slice(0, 130)}{" "}
                      {(
                        offer.translations?.find(
                          (t) => t.languageCode === currentLocale
                        )?.description || offer.translations[0]?.description
                      )?.length > 130 && "..."}
                    </p>{" "}
                    <CardFooter className="lg:absolute mt-2 lg:mt-0 bottom-0 gap-3 lg:gap-0  left-0 right-0 flex flex-col md:flex-row justify-center p-4">
                      <Link
                        // @ts-expect-error - next-intl dynamic route type issue
                        href={`/offers/${
                          offer.translations?.find(
                            (t) => t.languageCode === currentLocale
                          )?.slug ||
                          offer.translations[0]?.slug ||
                          ""
                        }`}
                      >
                        <ArrowButton>{t("viewOfferButton")}</ArrowButton>
                      </Link>
                      <Link href={`/contact`}>
                        <ArrowButton variant="ghost">
                          {t("contactUsButton")}
                        </ArrowButton>
                      </Link>
                    </CardFooter>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
