import React from "react";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";
import { getAllServices, getParentServices } from "@/actions/ServiceAction";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageTitle } from "@/components/atoms/PageTitle";
import TwoColumnComponent from "@/components/molecules/TwoColumnComponent";
import StickyScrollableSlides from "@/components/organisms/StickyScrollableSlides";
import { getUrl } from "@/lib/s3";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as "hr" | "en";

  const t = await getTranslations("metadata.services");

  const title = t("title");
  const description = t("description");
  const keywordsString = t("keywords");
  const keywords = keywordsString.split(",").map((keyword) => keyword.trim());
  const seoPath = t("path");

  const alternateLanguages: { [key: string]: string } = {
    hr: "/usluge",
    en: "/en/services",
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

  console.log("OG Image URL:", ogImageUrl);

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

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as "hr" | "en";
  
  const t = await getTranslations("servicesPage");
  const seo_t = await getTranslations("metadata.services");
  
  const allServices = await getAllServices(currentLocale);
  const parentServices = await getParentServices(currentLocale);

  // Helper funkcija za kreiranje stick scrollable slides
  const createStickScrollableSlides = async (
    parentServiceId: string,
    lang: "hr" | "en"
  ) => {
    const childServices = allServices
      .filter((service) => service.parentServiceId === parentServiceId)
      .sort((a, b) => a.order - b.order);

    const slides = await Promise.all(
      childServices.map(async (service, index) => {
        const translation = service.translations?.find(
          (t) => t.languageCode === lang
        );
        const parentTranslation = allServices
          .find((s) => s.id === parentServiceId)
          ?.translations?.find((t) => t.languageCode === lang);

        const imageUrl = getUrl(service.image);

        return {
          id: index,
          title: translation?.title || service.id,
          description: translation?.description || "",
          link: `/services/${parentTranslation?.slug}/${translation?.slug}`,
          image: imageUrl,
        };
      })
    );

    return slides;
  };

  // Kreiranje slides-ova za sve parent servise
  const allSlides = await Promise.all(
    parentServices.map(async (parentService) => ({
      parentService,
      slides: await createStickScrollableSlides(
        parentService.id,
        currentLocale
      ),
    }))
  );

  const itemListSchema = generateStructuredData("ItemList", {
    title: seo_t("title"),
    description: seo_t("description"),
    url: locale === "hr" ? seo_t("path") : `/en/${seo_t("path")}`,
    locale: locale,
    numberOfItems: allServices.length,
    items: allServices.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.translations[0]?.title || "",
        description: service.translations[0]?.description || "",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/${seo_t("path")}/${
          service.translations[0]?.slug
        }`,
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
        theme="primary"
        title={t("title")}
        description={t("description")}
      />
      
      {/* Parent Services Section */}
      {parentServices.map((service, index) => {
        const translation = service.translations?.find(
          (t) => t.languageCode === currentLocale
        );
        
        if (!translation) return null;

        return (
          <TwoColumnComponent
            key={service.id}
            image={getUrl(service.image)}
            title={translation.title}
            paragraph={translation.description || translation.shortDescription || ""}
            theme="light"
            reverse={index % 2 !== 0}
            buttonText={t("learnMore")}
            buttonVariant="default"
            href={`/services/${translation.slug}`}
          />
        );
      })}

      {/* Sub-services Sections */}
      {allSlides.map(
        ({ parentService, slides }, index) =>
          slides.length > 0 && (
            <StickyScrollableSlides
              key={parentService.id}
              items={slides}
              rowReverse={index % 2 === 0}
            />
          )
      )}
    </>
  );
}
