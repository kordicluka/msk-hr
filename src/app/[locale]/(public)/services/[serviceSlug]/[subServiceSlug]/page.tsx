import { getServiceBySlug } from "@/actions/ServiceAction";
import { notFound } from "next/navigation";
import { ContentRenderer } from "@/components/organisms/content/renderer";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";
import { getAllServices } from "@/actions/ServiceAction";
import { Metadata } from "next";
import { getUrl } from "@/lib/s3";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subServiceSlug: string; locale: string }>;
}): Promise<Metadata> {
  const { subServiceSlug, locale } = await params;
  const currentLocale = locale as "hr" | "en";

  const service = await getServiceBySlug(subServiceSlug, currentLocale);

  if (!service) {
    return {};
  }

  const translation = service.translations?.find(
    (t) => t.languageCode === currentLocale
  );

  const metadata_t = await getTranslations("metadata");
  const header_t = await getTranslations("header");

  const baseTitle = translation?.title || "MSK";
  const categoryName = header_t("services").toUpperCase();
  const title = `${baseTitle} - ${categoryName} - MSK`;
  const description = translation?.description || "";

  // Combine service-specific keywords with general service keywords
  const serviceKeywords = translation?.keywords || [];
  const generalKeywords = metadata_t("serviceKeywords").split(", ");
  const combinedKeywords = [...serviceKeywords, ...generalKeywords];

  const alternateLanguages: { [key: string]: string } = {};
  service.translations?.forEach((trans) => {
    if (trans.languageCode !== currentLocale) {
      alternateLanguages[trans.languageCode] = `/${
        trans.languageCode
      }/services/${
        service.parentService?.translations?.find(
          (pt) => pt.languageCode === trans.languageCode
        )?.slug
      }/${trans.slug}`;
    }
  });

  const seoPath = currentLocale === "hr" ? "usluge" : "services";

  return await generateSEOMetadata({
    title,
    description,
    image: getUrl(service.image),
    url: `/${currentLocale}/${seoPath}/${
      service.parentService?.translations?.find(
        (pt) => pt.languageCode === currentLocale
      )?.slug
    }/${subServiceSlug}`,
    type: "website",
    locale: currentLocale,
    keywords: combinedKeywords,
    alternateLanguages,
  });
}

export async function generateStaticParams() {
  const hrServices = await getAllServices("hr");
  const enServices = await getAllServices("en");

  const params = [];

  // Generate params for HR sub-services
  for (const service of hrServices.filter((s) => s.parentServiceId)) {
    const hrTranslation = service.translations?.find(
      (t) => t.languageCode === "hr"
    );
    const parentHrTranslation = service.parentService?.translations?.find(
      (t) => t.languageCode === "hr"
    );

    if (hrTranslation && parentHrTranslation) {
      params.push({
        locale: "hr",
        serviceSlug: parentHrTranslation.slug,
        subServiceSlug: hrTranslation.slug,
      });
    }
  }

  // Generate params for EN sub-services
  for (const service of enServices.filter((s) => s.parentServiceId)) {
    const enTranslation = service.translations?.find(
      (t) => t.languageCode === "en"
    );
    const parentEnTranslation = service.parentService?.translations?.find(
      (t) => t.languageCode === "en"
    );

    if (enTranslation && parentEnTranslation) {
      params.push({
        locale: "en",
        serviceSlug: parentEnTranslation.slug,
        subServiceSlug: enTranslation.slug,
      });
    }
  }

  return params;
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ subServiceSlug: string; locale: string }>;
}) {
  const { subServiceSlug, locale } = await params;

  const currentLocale = locale as "hr" | "en";

  const service = await getServiceBySlug(subServiceSlug, currentLocale);

  if (!service) {
    return notFound();
  }

  // Dohvati lokalizirani sadržaj iz translations
  const translation = service.translations?.find(
    (t) => t.languageCode === currentLocale
  );
  const serviceRichContent = translation?.content;

  const structuredData = generateStructuredData("Service", {
    title: translation?.title,
    description: translation?.description,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/services/${
      service.parentService?.translations?.find(
        (pt) => pt.languageCode === currentLocale
      )?.slug
    }/${subServiceSlug}`,
    serviceType: translation?.title,
  });

  const parentServiceTitle = service.parentService?.translations?.find(
    (pt) => pt.languageCode === currentLocale
  )?.title;
  const parentServiceSlug = service.parentService?.translations?.find(
    (pt) => pt.languageCode === currentLocale
  )?.slug;

  const breadcrumbSchema = generateStructuredData("BreadcrumbList", {
    breadcrumbs: [
      {
        "@type": "ListItem",
        position: 1,
        name: currentLocale === "hr" ? "Početna" : "Home",
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: currentLocale === "hr" ? "Usluge" : "Services",
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: parentServiceTitle,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/services/${parentServiceSlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: translation?.title,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/services/${parentServiceSlug}/${subServiceSlug}`,
      },
    ],
  });

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      )}
      {serviceRichContent &&
      Array.isArray(serviceRichContent) &&
      serviceRichContent.length > 0 ? (
        <ContentRenderer content={serviceRichContent} className="w-full" />
      ) : (
        <div className="container mx-auto mb-20 text-center">
          <p>Detaljniji opis za ovu uslugu trenutno nije dostupan.</p>
        </div>
      )}
    </>
  );
}
