import React from "react";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";
import { getAllProjects } from "@/actions/ProjectAction";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as "hr" | "en";
  const t = await getTranslations("metadata.projects");

  const title = t("title");
  const description = t("description");
  const keywordsString = t("keywords");
  const keywords = keywordsString.split(",").map((keyword) => keyword.trim());
  const seoPath = t("path");

  const alternateLanguages: { [key: string]: string } = {
    hr: "/projekti",
    en: "/en/projects",
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

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as "hr" | "en";
  const t = await getTranslations("projectsPage");
  const projects = await getAllProjects(currentLocale);

  const itemListSchema = generateStructuredData("ItemList", {
    title: t("title"),
    description: t("description"),
    locale: locale,
    url: locale === "hr" ? "projekti" : "/en/projects",
    numberOfItems: projects.length,
    items: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name:
          project.translations?.find((t) => t.languageCode === currentLocale)
            ?.title || project.translations[0]?.title,
        description:
          project.translations?.find((t) => t.languageCode === currentLocale)
            ?.description || project.translations[0]?.description,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/projects/${
          project.translations?.find((t) => t.languageCode === currentLocale)
            ?.slug || project.translations[0]?.slug
        }`,
        creator: {
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
      <div className="container mx-auto py-16 px-6">
        <h1 className="text-5xl font-bold text-center mb-16 text-primary">
          {t("title")}
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          {t("description")}
        </p>
      </div>
    </>
  );
}
