import React from "react";
import { ContactFormWrapper } from "@/components/composites/public/ContactFormWrapper";
import { PageTitle } from "@/components/atoms/PageTitle";
import { ContactMapSection } from "@/components/composites/public/ContactMapSection";
import { getTranslations } from "next-intl/server";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";
import { Metadata } from "next";
import { contactData } from "@/data/contactData";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as "hr" | "en";
  const t = await getTranslations("metadata.contact");

  const title = t("title");
  const description = t("description");
  const keywordsString = t("keywords");
  const keywords = keywordsString.split(",").map((keyword) => keyword.trim());
  const seoPath = t("path");

  const alternateLanguages: { [key: string]: string } = {
    hr: currentLocale === "hr" ? "/kontakt" : "/kontakt",
    en: currentLocale === "hr" ? "/en/contact" : "/en/contact",
  };

  const ogImageParams = new URLSearchParams();
  ogImageParams.set("title", title);
  ogImageParams.set("locale", currentLocale);
  ogImageParams.set(
    "url",
    currentLocale === "hr"
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/${seoPath}` ||
          `https://www.msk.hr/${seoPath}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/en/${seoPath}` ||
          `https://www.msk.hr/en/${seoPath}`
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

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations("contactPage");
  const seo_t = await getTranslations("metadata.contact");

  const contactPageSchema = generateStructuredData("ContactPage", {
    title: seo_t("title"),
    description: seo_t("description"),
    url: locale === "hr" ? seo_t("path") : `/en/${seo_t("path")}`,
    phone: "",
    email: contactData.email,
    locale: locale,
  });

  const localBusinessSchema = generateStructuredData("LocalBusiness", {
    description: seo_t("description"),
    address: contactData.address,
    city: "Zagreb",
    phone: contactData.telephone,
    email: contactData.email,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <PageTitle
        theme="primary"
        title={t("title")}
        description={t("description")}
      />
      <ContactFormWrapper locale={locale as "hr" | "en"} />
      <ContactMapSection />
    </>
  );
}
