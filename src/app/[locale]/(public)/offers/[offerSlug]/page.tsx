import { getOfferBySlug, getAllOffers } from "@/actions/OfferAction";
import { notFound } from "next/navigation";
import { ContentRenderer } from "@/components/organisms/content/renderer";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getUrl } from "@/lib/s3";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ offerSlug: string; locale: string }>;
}): Promise<Metadata> {
  const { offerSlug, locale } = await params;
  const currentLocale = locale as "hr" | "en";

  console.log(
    "Generating metadata for offer:",
    offerSlug,
    "in locale:",
    currentLocale
  );

  const offer = await getOfferBySlug(offerSlug, currentLocale);

  if (!offer) {
    return {};
  }

  const translation = offer.translations?.find(
    (t) => t.languageCode === currentLocale
  );

  const seo_t = await getTranslations("metadata.offers");
  const metadata_t = await getTranslations("metadata");

  const t = await getTranslations("header");
  const baseTitle = translation?.title || seo_t("title");
  const categoryName = t("offers").toUpperCase();
  const title = `${baseTitle} - ${categoryName} - MSK`;
  const description = translation?.description || seo_t("description");

  // Combine offer-specific keywords with general offer keywords
  const offerKeywords = translation?.keywords || [];
  const generalKeywords = metadata_t("offerKeywords").split(", ");
  const combinedKeywords = [...offerKeywords, ...generalKeywords];

  const alternateLanguages: { [key: string]: string } = {};
  offer.translations?.forEach((trans) => {
    if (trans.languageCode !== currentLocale) {
      alternateLanguages[trans.languageCode] = `/${trans.languageCode}/${seo_t(
        "path"
      )}/${trans.slug}`;
    }
  });

  return await generateSEOMetadata({
    title,
    description,
    image: getUrl(offer.icon),
    url: `/${currentLocale}/${seo_t("path")}/${offerSlug}`,
    type: "website",
    locale: currentLocale,
    keywords: combinedKeywords,
    alternateLanguages,
  });
}

export async function generateStaticParams() {
  const hrOffers = await getAllOffers("hr");
  const enOffers = await getAllOffers("en");

  const params = [];

  // Generate params for HR offers
  for (const offer of hrOffers) {
    const hrTranslation = offer.translations?.find(
      (t) => t.languageCode === "hr"
    );
    if (hrTranslation) {
      params.push({
        locale: "hr",
        offerSlug: hrTranslation.slug,
      });
    }
  }

  // Generate params for EN offers
  for (const offer of enOffers) {
    const enTranslation = offer.translations?.find(
      (t) => t.languageCode === "en"
    );
    if (enTranslation) {
      params.push({
        locale: "en",
        offerSlug: enTranslation.slug,
      });
    }
  }

  return params;
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ offerSlug: string; locale: string }>;
}) {
  const { offerSlug, locale } = await params;

  const currentLocale = locale as "hr" | "en";

  const offer = await getOfferBySlug(offerSlug, currentLocale);

  if (!offer) {
    return notFound();
  }

  // Dohvati lokalizirani sadržaj iz translations
  const translation = offer.translations?.find(
    (t) => t.languageCode === currentLocale
  );
  const offerRichContent = translation?.content;

  const seo_t = await getTranslations("metadata.offers");

  const structuredData = generateStructuredData("Offer", {
    title: translation?.title,
    description: translation?.description,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/${seo_t(
      "path"
    )}/${offerSlug}`,
    price: `${offer.priceFrom}-${offer.priceTo}`,
    currency: "EUR",
  });

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
        name: currentLocale === "hr" ? "Ponude" : "Offers",
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/${seo_t(
          "path"
        )}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: translation?.title,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/${seo_t(
          "path"
        )}/${offerSlug}`,
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
      {offerRichContent &&
      Array.isArray(offerRichContent) &&
      offerRichContent.length > 0 ? (
        <ContentRenderer content={offerRichContent} className="w-full" />
      ) : (
        <div className="container mx-auto mb-20 text-center">
          <p>Detaljniji opis za ovu ponudu trenutno nije dostupan.</p>
        </div>
      )}
    </>
  );
}
