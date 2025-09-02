import React from "react";
import BlogHero from "@/components/composites/public/blog/BlogHero";
import { RecentBlogsShowcase } from "@/components/composites/public/blog/BlogShowcase";
import { getAllBlogs } from "@/actions/BlogAction";
import { getUrl } from "@/lib/s3";
import { getAllServices } from "@/actions/ServiceAction";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as "hr" | "en";
  const t = await getTranslations("metadata.blog");

  const title = t("title");
  const description = t("description");
  const keywordsString = t("keywords");
  const keywords = keywordsString.split(",").map((keyword) => keyword.trim());

  const alternateLanguages: { [key: string]: string } = {
    hr: "/blog",
    en: "/en/blog",
  };

  const seoPath = t("path");

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

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as "hr" | "en";
  const t = await getTranslations("blogPage");
  const blogs = await getAllBlogs(currentLocale);
  const services = await getAllServices(currentLocale);

  const blogSchema = generateStructuredData("Blog", {
    title: t("title"),
    description: t("description"),
    url: locale === "hr" ? "blog" : "/en/blog",
    locale: currentLocale,
  });

  const itemListSchema = generateStructuredData("ItemList", {
    title: t("title"),
    description: t("description"),
    url: locale === "hr" ? "blog" : "/en/blog",
    locale: locale,
    numberOfItems: blogs.length,
    items: blogs.map((blog, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        headline: blog.translations[0]?.title,
        description: blog.translations[0]?.shortDescription,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/blog/${blog.translations[0]?.slug}`,
        image: getUrl(blog.image),
        datePublished: blog.createdAt,
        dateModified: blog.updatedAt,
        author: {
          "@type": "Organization",
          name: "MSK",
        },
        publisher: {
          "@type": "Organization",
          name: "MSK",
          logo: {
            "@type": "ImageObject",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/msk-logo.png`,
          },
        },
      },
    })),
  });

  const slides = blogs.map((blog) => ({
    title: blog.translations[0].title,
    excerpt: blog.translations[0].shortDescription,
    image: getUrl(blog.image),
    href: `/blog/${blog.translations[0].slug}`,
    cta: "Pogledaj više",
    category:
      blog.services
        ?.map(
          (service) =>
            services
              .find((s) => s.id === service.serviceId)
              ?.translations?.find((t) => t.languageCode === currentLocale)
              ?.title
        )
        .join(", ") || "",
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />
      <BlogHero slides={slides} />
      <RecentBlogsShowcase blogs={slides} />
    </>
  );
}
