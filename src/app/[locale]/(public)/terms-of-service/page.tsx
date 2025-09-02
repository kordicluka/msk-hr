import React from "react";
import { getTranslations } from "next-intl/server";
import { PageTitle } from "@/components/atoms/PageTitle";
import { contactData } from "@/data/contactData";
import { Metadata } from "next";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";

interface TermsOfServicePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as "hr" | "en";
  const t = await getTranslations("metadata.termsOfService");

  const title = t("title");
  const description = t("description");
  const keywordsString = t("keywords");
  const keywords = keywordsString.split(",").map((keyword) => keyword.trim());

  const alternateLanguages: { [key: string]: string } = {
    [currentLocale === "hr" ? "en" : "hr"]: `/${
      currentLocale === "hr" ? "en" : "hr"
    }/terms-of-service`,
  };

  const ogImageParams = new URLSearchParams();
  ogImageParams.set("title", title);
  ogImageParams.set(
    "url",
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.msk.hr"
  );
  const ogImageUrl = `/api/og?${ogImageParams.toString()}`;

  return await generateSEOMetadata({
    title,
    description,
    image: ogImageUrl,
    url: `/${currentLocale}/terms-of-service`,
    type: "website",
    locale: currentLocale,
    keywords,
    alternateLanguages,
  });
}

export default async function TermsOfServicePage({
  params,
}: TermsOfServicePageProps) {
  const { locale } = await params;
  const t = await getTranslations("termsOfService");
  const seo_t = await getTranslations("metadata.termsOfService");

  const webPageSchema = generateStructuredData("WebPage", {
    title: seo_t("title"),
    description: seo_t("description"),
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/${seo_t("path")}`,
    locale: locale,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      <PageTitle
        theme="primary"
        title={t("title")}
        description={t("introduction")}
      />

      <div className="container mx-auto px-4 xl:px-0 py-16 ">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>{t("lastUpdated")}:</strong>{" "}
            {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("serviceUsage.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t("serviceUsage.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("intellectualProperty.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t("intellectualProperty.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t("limitation.title")}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t("limitation.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t("contact.title")}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t("contact.content")}{" "}
              <a
                href={`mailto:${contactData.email}`}
                className="text-blue-600 hover:underline"
              >
                {contactData.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
