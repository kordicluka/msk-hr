import React from "react";

import { getTranslations } from "next-intl/server";
import ImageGallery from "@/components/molecules/ImageGallery";
import { CardSection } from "@/components/organisms/CardSection";
import MarqueeImages from "@/components/organisms/MarqueeImages";
import { PageTitle } from "@/components/atoms/PageTitle";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";
import { Metadata } from "next";
import { contactData } from "@/data/contactData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as "hr" | "en";
  const t = await getTranslations("metadata.aboutUs");

  const title = t("title");
  const description = t("description");
  const keywordsString = t("keywords");
  const keywords = keywordsString.split(",").map((keyword) => keyword.trim());

  const alternateLanguages: { [key: string]: string } = {
    [currentLocale === "hr" ? "en" : "hr"]: `/${
      currentLocale === "hr" ? "en" : "hr"
    }/about-us`,
  };

  const seoPath = t("path");

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

export default async function AboutUsPage() {
  const t = await getTranslations("aboutUsPage");
  const seo_t = await getTranslations("metadata.aboutUs");

  const organizationSchema = generateStructuredData("Organization", {
    address: contactData.address,
    city: "Zagreb",
    phone: contactData.telephone,
    email: contactData.email,
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
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <PageTitle
        size="xl"
        align="center"
        theme="transparent"
        title={t("title")}
      />
      <ImageGallery />
      <CardSection
        title={t("ourApproach.title")}
        description={t("ourApproach.description")}
        image="/about-us/about-us-1.jpeg"
        align="left"
      />
      <CardSection
        title={t("ourTeam.title")}
        description={t("ourTeam.description")}
        image="/about-us/about-us-team.jpeg"
        align="right"
      />{" "}
      <CardSection
        title={t("ourValues.title")}
        description={t("ourValues.description")}
        image="/about-us/about-us-values.jpeg"
        align="left"
      />
      <MarqueeImages
        title="Tipovi poslovanja kojima pomažemo"
        images={[
          {
            title: "Caffe",
            image: "/types/caffe.jpeg",
          },
          {
            title: "Carpet Cleaning",
            image: "/types/carpet-cleaning.jpeg",
          },
          {
            title: "Construction",
            image: "/types/construction.jpeg",
          },
          {
            title: "Kids Workshop",
            image: "/types/kids-workshop.jpeg",
          },
          {
            title: "Lawyer",
            image: "/types/lawyer.jpeg",
          },
          {
            title: "Shopping Mall",
            image: "/types/shopping-mall.jpeg",
          },
        ]}
      />
    </>
  );
}
