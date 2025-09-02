import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Helper function to generate correct URL based on new locale structure
 * Croatian (hr): no prefix - /path
 * English (en): /en/path prefix
 */
export function generateLocalizedUrl(path: string, locale: string = "hr"): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.msk.hr";
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (locale === "hr") {
    return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
  } else {
    return cleanPath ? `${baseUrl}/en/${cleanPath}` : `${baseUrl}/en`;
  }
}

interface MetadataParams {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  alternateLanguages?: {
    [key: string]: string;
  };
  siteName?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterCreator?: string;
  twitterSite?: string;
}

export async function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  locale = "hr",
  publishedTime,
  modifiedTime,
  author,
  alternateLanguages = {},
  siteName = "MSK",
  twitterCard = "summary_large_image",
  twitterCreator = "@msk",
  twitterSite = "@msk",
}: MetadataParams): Promise<Metadata> {
  const t = await getTranslations("metadata");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.msk.hr";
  // Use new URL generation logic
  const fullUrl = url ? generateLocalizedUrl(url, locale) : baseUrl;
  const ogImage = image ? `${image}` : `${baseUrl}/og-image.png`;

  const metadata: Metadata = {
    title,
    description: description || t("defaultDescription"),
    keywords: keywords.length > 0 ? keywords : [t("defaultKeywords")],
    authors: author ? [{ name: author }] : [{ name: "MSK" }],
    creator: "MSK",
    publisher: "MSK",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description: description || t("defaultDescription"),
      url: fullUrl,
      siteName: siteName,
      locale: locale === "hr" ? "hr_HR" : "en_US",
      type: type as "website" | "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" &&
        publishedTime && {
          publishedTime,
          modifiedTime,
          authors: [author || "MSK"],
          section: "Technology",
          tags: keywords,
        }),
    },
    twitter: {
      card: twitterCard,
      site: twitterSite,
      creator: twitterCreator,
      title,
      description: description || t("defaultDescription"),
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
      languages: alternateLanguages,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };

  return metadata;
}

export function generateStructuredData(
  type:
    | "Organization"
    | "WebSite"
    | "Article"
    | "Service"
    | "LocalBusiness"
    | "ContactPage"
    | "ItemList"
    | "Blog"
    | "WebPage"
    | "Product"
    | "Offer"
    | "FAQ"
    | "BreadcrumbList"
    | "CreativeWork",
  data: Record<string, unknown>
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.msk.hr";
  const locale = data.locale as string || "hr";

  switch (type) {
    case "Organization":
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "MSK",
        url: baseUrl,
        logo: `${baseUrl}/msk-logo.png`,
        description: "",
        address: {
          "@type": "PostalAddress",
          streetAddress: data.address || "",
          addressLocality: data.city || "Zagreb",
          addressCountry: "HR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: data.phone || "",
          contactType: "customer service",
          email: data.email || "contact@msk.hr",
        },
        sameAs: [
          "https://www.facebook.com/msk",
          "https://www.linkedin.com/company/msk",
          "https://twitter.com/msk",
        ],
      };

    case "WebSite":
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "MSK",
        url: baseUrl,
        description: "",
        inLanguage: ["hr-HR", "en-US"],
      };

    case "Article":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.title,
        description: data.description,
        image: data.image ? `${baseUrl}${data.image}` : undefined,
        author: {
          "@type": "Person",
          name: data.author || "MSK",
        },
        publisher: {
          "@type": "Organization",
          name: "MSK",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/msk-logo.png`,
          },
        },
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime || data.publishedTime,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": generateLocalizedUrl(data.url as string, locale),
        },
      };

    case "Service":
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: data.title,
        description: data.description,
        provider: {
          "@type": "Organization",
          name: "MSK",
          url: baseUrl,
        },
        areaServed: {
          "@type": "Country",
          name: "Croatia",
        },
        serviceType: data.serviceType || "Digital Services",
        url: generateLocalizedUrl(data.url as string, locale),
      };

    case "BreadcrumbList":
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: data.breadcrumbs || [],
      };

    case "CreativeWork":
      return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: data.title,
        description: data.description,
        url: generateLocalizedUrl(data.url as string, locale),
        image: data.image ? `${baseUrl}${data.image}` : undefined,
        creator: {
          "@type": "Organization",
          name: "MSK",
          url: baseUrl,
        },
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime,
        inLanguage: locale === "hr" ? "hr-HR" : "en-US",
      };

    case "FAQ":
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.faqs || [],
      };

    default:
      return null;
  }
}
