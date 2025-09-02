import { getBlogBySlug } from "@/actions/BlogAction";
import { notFound } from "next/navigation";
import { ContentRenderer } from "@/components/organisms/content/renderer";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";
import { Metadata } from "next";
import { getAllBlogs } from "@/actions/BlogAction";
import { getTranslations } from "next-intl/server";
import { contactData } from "@/data/contactData";
import { getUrl } from "@/lib/s3";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ blogSlug: string; locale: string }>;
}): Promise<Metadata> {
  const { blogSlug, locale } = await params;
  const currentLocale = locale as "hr" | "en";

  const blog = await getBlogBySlug(blogSlug, currentLocale);

  if (!blog) {
    return {};
  }

  const translation = blog.translations?.find(
    (t) => t.languageCode === currentLocale
  );

  const t = await getTranslations("metadata.contact");
  const metadata_t = await getTranslations("metadata");
  const header_t = await getTranslations("header");

  const baseTitle = translation?.title || t("title");
  const categoryName = header_t("blog").toUpperCase();
  const title = `${baseTitle} - ${categoryName} - MSK`;
  const description = translation?.description || t("description");
  const path = t("path");

  // Combine blog-specific keywords with general blog keywords
  const blogKeywords = translation?.keywords || [];
  const generalKeywords = metadata_t("blogKeywords").split(", ");
  const combinedKeywords = [...blogKeywords, ...generalKeywords];

  const alternateLanguages: { [key: string]: string } = {};
  blog.translations?.forEach((trans) => {
    if (trans.languageCode !== currentLocale) {
      alternateLanguages[
        trans.languageCode
      ] = `/${trans.languageCode}/${path}/${trans.slug}`;
    }
  });

  return await generateSEOMetadata({
    title,
    description,
    image: getUrl(blog.image),
    url: `/${currentLocale}/${path}/${blogSlug}`,
    type: "article",
    locale: currentLocale,
    keywords: combinedKeywords,
    alternateLanguages,
    publishedTime: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
    modifiedTime: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
    author: "MSK",
  });
}

export async function generateStaticParams() {
  const hrBlogs = await getAllBlogs("hr");
  const enBlogs = await getAllBlogs("en");

  const params = [];

  // Generate params for HR blogs
  for (const blog of hrBlogs) {
    const hrTranslation = blog.translations?.find(
      (t) => t.languageCode === "hr"
    );
    if (hrTranslation) {
      params.push({
        locale: "hr",
        blogSlug: hrTranslation.slug,
      });
    }
  }

  // Generate params for EN blogs
  for (const blog of enBlogs) {
    const enTranslation = blog.translations?.find(
      (t) => t.languageCode === "en"
    );
    if (enTranslation) {
      params.push({
        locale: "en",
        blogSlug: enTranslation.slug,
      });
    }
  }

  return params;
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ blogSlug: string; locale: string }>;
}) {
  const { blogSlug, locale } = await params;

  const currentLocale = locale as "hr" | "en";

  const blog = await getBlogBySlug(blogSlug, currentLocale);

  if (!blog) {
    return notFound();
  }

  // Dohvati lokalizirani sadržaj iz translations
  const translation = blog.translations?.find(
    (t) => t.languageCode === currentLocale
  );
  const blogRichContent = translation?.content;

  const t = await getTranslations("metadata.contact");

  const path = t("path");

  const structuredData = generateStructuredData("Article", {
    title: translation?.title,
    description: translation?.description,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/${path}/${blogSlug}`,
    image: blog.image || "",
    author: blog.author || "MSK",
    publishedTime: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
    modifiedTime: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
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
        name: currentLocale === "hr" ? "Blog" : "Blog",
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/${path}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: translation?.title,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/${path}/${blogSlug}`,
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
      {blogRichContent &&
      Array.isArray(blogRichContent) &&
      blogRichContent.length > 0 ? (
        <ContentRenderer content={blogRichContent} className="w-full" />
      ) : (
        <div className="container mx-auto mb-20 text-center">
          <p>Detaljniji opis za ovu blog post trenutno nije dostupan.</p>
        </div>
      )}
    </>
  );
}
