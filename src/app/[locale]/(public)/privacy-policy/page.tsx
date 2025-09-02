import React from "react";
import { getTranslations } from "next-intl/server";
import { PageTitle } from "@/components/atoms/PageTitle";
import { contactData } from "@/data/contactData";
import { Metadata } from "next";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";

interface PrivacyPolicyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as "hr" | "en";
  const t = await getTranslations("metadata.privacyPolicy");

  const title = t("title");
  const description = t("description");
  const keywordsString = t("keywords");
  const keywords = keywordsString.split(",").map((keyword) => keyword.trim());
  const seoPath = t("path");

  const alternateLanguages: { [key: string]: string } = {
    [currentLocale === "hr" ? "en" : "hr"]: `/${
      currentLocale === "hr" ? "en" : "hr"
    }/privacy-policy`,
  };

  const ogImageParams = new URLSearchParams();
  ogImageParams.set("title", title);
  ogImageParams.set(
    "url",
    `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/${seoPath}` ||
      `https://www.msk.hr/${currentLocale}/${seoPath}`
  );
  const ogImageUrl = `/api/og?${ogImageParams.toString()}`;

  return await generateSEOMetadata({
    title,
    description,
    image: ogImageUrl,
    url: `/${currentLocale}/${seoPath}`,
    type: "website",
    locale: currentLocale,
    keywords,
    alternateLanguages,
  });
}

export default async function PrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const { locale } = await params;
  const t = await getTranslations("privacyPolicy");

  const seo_t = await getTranslations("metadata.privacyPolicy");

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
      <PageTitle theme="primary" title={t("title")} description="" />

      <div className="container mx-auto px-4 xl:px-0 py-16">
        <div className="bg-gray-50 border-l-4 border-blue-500 p-6 mb-12">
          <p className="text-gray-700 leading-relaxed">{t("introduction")}</p>
        </div>

        <div className="mb-12">
          <p className="text-gray-600 text-sm">
            <strong>{t("lastUpdated")}:</strong>{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              {t("whatAreCookies.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {t("whatAreCookies.content")}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              {t("whichCookiesWeUse.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {t("whichCookiesWeUse.content")}
            </p>

            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {t("cookieTypes.necessary.title")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("cookieTypes.necessary.content")}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {t("cookieTypes.statistics.title")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("cookieTypes.statistics.content")}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {t("cookieTypes.marketing.title")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("cookieTypes.marketing.content")}
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {t("cookieTypes.uncategorized.title")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("cookieTypes.uncategorized.content")}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              {t("dataCollection.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t("dataCollection.content")}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              {t("dataUsage.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t("dataUsage.content")}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              {t("contact.title")}
            </h2>
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
