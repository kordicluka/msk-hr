// app/sitemap.ts

import { MetadataRoute } from "next";
import { getAllServices } from "@/actions/ServiceAction";
import { getAllBlogs } from "@/actions/BlogAction";
import { getAllOffers } from "@/actions/OfferAction";
import { getAllProjects } from "@/actions/ProjectAction";

// Pretpostavka je da vaši 'getAll' actioni mogu dohvatiti sve objekte
// s njihovim prijevodima ako se ne proslijedi jezik.
// Ako to nije slučaj, trebat ćete prilagoditi dohvaćanje podataka.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.msk.hr";

  // --- 1. Statičke stranice s definiranim alternativama ---
  const staticPaths = [
    { hr: "", en: "" }, // Početna stranica
    { hr: "o-nama", en: "about-us" },
    { hr: "kontakt", en: "contact" },
    { hr: "usluge", en: "services" },
    { hr: "blog", en: "blog" },
    { hr: "ponude", en: "offers" },
    { hr: "projekti", en: "projects" },
  ];

  const staticPages = staticPaths.flatMap(({ hr, en }) => {
    const hrUrl = hr ? `${baseUrl}/${hr}` : baseUrl;
    const enUrl = `${baseUrl}/en/${en}`;
    return [
      {
        url: hrUrl,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
        alternates: {
          languages: {
            hr: hrUrl,
            en: enUrl,
          },
        },
      },
      {
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
        alternates: {
          languages: {
            hr: hrUrl,
            en: enUrl,
          },
        },
      },
    ];
  });

  try {
    // --- 2. Dinamičke stranice ---
    // Dohvaćamo sve objekte odjednom, s uključenim prijevodima
    const allServices = await getAllServices();
    const allBlogs = await getAllBlogs();
    const allOffers = await getAllOffers();
    const allProjects = await getAllProjects();

    const servicePages = allServices.flatMap((service) => {
      const hrTranslation = service.translations?.find(
        (t) => t.languageCode === "hr"
      );
      const enTranslation = service.translations?.find(
        (t) => t.languageCode === "en"
      );

      // Preskačemo ako ne postoje oba prijevoda
      if (!hrTranslation || !enTranslation) return [];

      const pages: MetadataRoute.Sitemap = [];

      // Generiramo linkove za glavnu uslugu
      const hrUrl = `${baseUrl}/usluge/${hrTranslation.slug}`;
      const enUrl = `${baseUrl}/en/services/${enTranslation.slug}`;

      pages.push(
        {
          url: hrUrl,
          lastModified: service.updatedAt || new Date(),
          alternates: { languages: { hr: hrUrl, en: enUrl } },
        },
        {
          url: enUrl,
          lastModified: service.updatedAt || new Date(),
          alternates: { languages: { hr: hrUrl, en: enUrl } },
        }
      );

      // Generiramo linkove za pod-usluge, ako postoje
      if (service.childServices && service.childServices.length > 0) {
        service.childServices.forEach((child) => {
          const hrChild = child.translations?.find(
            (t) => t.languageCode === "hr"
          );
          const enChild = child.translations?.find(
            (t) => t.languageCode === "en"
          );

          if (hrChild && enChild) {
            const hrChildUrl = `${baseUrl}/usluge/${hrTranslation.slug}/${hrChild.slug}`;
            const enChildUrl = `${baseUrl}/en/services/${enTranslation.slug}/${enChild.slug}`;

            pages.push(
              {
                url: hrChildUrl,
                lastModified: child.updatedAt || new Date(),
                alternates: { languages: { hr: hrChildUrl, en: enChildUrl } },
              },
              {
                url: enChildUrl,
                lastModified: child.updatedAt || new Date(),
                alternates: { languages: { hr: hrChildUrl, en: enChildUrl } },
              }
            );
          }
        });
      }

      return pages;
    });

    const blogPages = allBlogs.flatMap((blog) => {
      const hrTranslation = blog.translations?.find(
        (t) => t.languageCode === "hr"
      );
      const enTranslation = blog.translations?.find(
        (t) => t.languageCode === "en"
      );

      if (!hrTranslation || !enTranslation) return [];

      const hrUrl = `${baseUrl}/blog/${hrTranslation.slug}`;
      const enUrl = `${baseUrl}/en/blog/${enTranslation.slug}`;

      return [
        {
          url: hrUrl,
          lastModified: blog.updatedAt || new Date(),
          alternates: { languages: { hr: hrUrl, en: enUrl } },
        },
        {
          url: enUrl,
          lastModified: blog.updatedAt || new Date(),
          alternates: { languages: { hr: hrUrl, en: enUrl } },
        },
      ];
    });

    const offerPages = allOffers.flatMap((offer) => {
      const hrTranslation = offer.translations?.find(
        (t) => t.languageCode === "hr"
      );
      const enTranslation = offer.translations?.find(
        (t) => t.languageCode === "en"
      );

      if (!hrTranslation || !enTranslation) return [];

      const hrUrl = `${baseUrl}/ponude/${hrTranslation.slug}`;
      const enUrl = `${baseUrl}/en/offers/${enTranslation.slug}`;

      return [
        {
          url: hrUrl,
          lastModified: offer.updatedAt || new Date(),
          alternates: { languages: { hr: hrUrl, en: enUrl } },
        },
        {
          url: enUrl,
          lastModified: offer.updatedAt || new Date(),
          alternates: { languages: { hr: hrUrl, en: enUrl } },
        },
      ];
    });

    const projectPages = allProjects.flatMap((project) => {
      const hrTranslation = project.translations?.find(
        (t) => t.languageCode === "hr"
      );
      const enTranslation = project.translations?.find(
        (t) => t.languageCode === "en"
      );

      if (!hrTranslation || !enTranslation) return [];

      const hrUrl = `${baseUrl}/projekti/${hrTranslation.slug}`;
      const enUrl = `${baseUrl}/en/projects/${enTranslation.slug}`;

      return [
        {
          url: hrUrl,
          lastModified: project.updatedAt || new Date(),
          alternates: { languages: { hr: hrUrl, en: enUrl } },
        },
        {
          url: enUrl,
          lastModified: project.updatedAt || new Date(),
          alternates: { languages: { hr: hrUrl, en: enUrl } },
        },
      ];
    });

    return [
      ...staticPages,
      ...servicePages,
      ...blogPages,
      ...offerPages,
      ...projectPages,
    ];
  } catch (error) {
    console.error("Greška pri generiranju sitemapa:", error);
    // Vraćamo samo statičke stranice u slučaju greške
    return staticPages;
  }
}
