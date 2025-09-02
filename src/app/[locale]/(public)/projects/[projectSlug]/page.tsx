import { getProjectBySlug, getAllProjects } from "@/actions/ProjectAction";
import { notFound } from "next/navigation";
import { ContentRenderer } from "@/components/organisms/content/renderer";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";
import { Metadata } from "next";
import { getUrl } from "@/lib/s3";
import { getTranslations } from "next-intl/server";
import { contactData } from "@/data/contactData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectSlug: string; locale: string }>;
}): Promise<Metadata> {
  const { projectSlug, locale } = await params;
  const currentLocale = locale as "hr" | "en";

  const project = await getProjectBySlug(projectSlug, currentLocale);

  if (!project) {
    return {};
  }

  const seoPath = locale === "hr" ? "projekti" : "projects";

  const translation = project.translations?.find(
    (t) => t.languageCode === currentLocale
  );

  const metadata_t = await getTranslations("metadata");
  const header_t = await getTranslations("header");

  const baseTitle = translation?.title || "MSK - Projekt";
  const categoryName = header_t("ourProjects").toUpperCase();
  const title = `${baseTitle} - ${categoryName} - MSK`;
  const description = translation?.description || "Detalji o projektu.";

  // Combine project-specific keywords with general project keywords
  const projectKeywords = translation?.keywords || [];
  const generalKeywords = metadata_t("projectKeywords").split(", ");
  const combinedKeywords = [...projectKeywords, ...generalKeywords];

  const alternateLanguages: { [key: string]: string } = {};
  project.translations?.forEach((trans) => {
    if (trans.languageCode !== currentLocale) {
      alternateLanguages[
        trans.languageCode
      ] = `/${trans.languageCode}/projects/${trans.slug}`;
    }
  });

  return await generateSEOMetadata({
    title,
    description,
    image: getUrl(project.image),
    url: `/${currentLocale}/${seoPath}/${projectSlug}`,
    type: "website",
    locale: currentLocale,
    keywords: combinedKeywords,
    alternateLanguages,
  });
}

export async function generateStaticParams() {
  const hrProjects = await getAllProjects("hr");
  const enProjects = await getAllProjects("en");

  const params = [];

  // Generate params for HR projects
  for (const project of hrProjects) {
    const hrTranslation = project.translations?.find(
      (t) => t.languageCode === "hr"
    );
    if (hrTranslation) {
      params.push({
        locale: "hr",
        projectSlug: hrTranslation.slug,
      });
    }
  }

  // Generate params for EN projects
  for (const project of enProjects) {
    const enTranslation = project.translations?.find(
      (t) => t.languageCode === "en"
    );
    if (enTranslation) {
      params.push({
        locale: "en",
        projectSlug: enTranslation.slug,
      });
    }
  }

  return params;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectSlug: string; locale: string }>;
}) {
  const { projectSlug, locale } = await params;

  const currentLocale = locale as "hr" | "en";

  const project = await getProjectBySlug(projectSlug, currentLocale);

  if (!project) {
    return notFound();
  }

  // Dohvati lokalizirani sadržaj iz translations
  const translation = project.translations?.find(
    (t) => t.languageCode === currentLocale
  );
  const projectRichContent = translation?.content;

  const structuredData = generateStructuredData("CreativeWork", {
    title: translation?.title || "MSK - Projekt",
    description: translation?.description || "Detalji o projektu.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/projects/${projectSlug}`,
    image: project.featuredImage,
    publishedTime: project.createdAt
      ? new Date(project.createdAt).toISOString()
      : undefined,
    modifiedTime: project.updatedAt
      ? new Date(project.updatedAt).toISOString()
      : undefined,
    locale: currentLocale,
  });

  const organizationSchema = generateStructuredData("Organization", {
    address: contactData.address,
    city: "Zagreb",
    phone: contactData.telephone,
    email: contactData.email,
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
        name: currentLocale === "hr" ? "Projekti" : "Projects",
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: translation?.title,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/projects/${projectSlug}`,
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
      {organizationSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      )}
      {projectRichContent &&
      Array.isArray(projectRichContent) &&
      projectRichContent.length > 0 ? (
        <ContentRenderer content={projectRichContent} className="w-full" />
      ) : (
        <div className="container mx-auto pt-34 mb-20 text-center">
          <p>Detaljniji opis za ovu projekt trenutno nije dostupan.</p>
        </div>
      )}
    </>
  );
}
