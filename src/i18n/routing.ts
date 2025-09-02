import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "hr"],

  // Used when no locale matches
  defaultLocale: "hr",
  
  // Only add locale prefix when needed (hr has no prefix, en has /en)
  localePrefix: "as-needed",
  pathnames: {
    "/": {
      en: "/",
      hr: "/",
    },
    "/services": {
      en: "/services",
      hr: "/usluge",
    },
    "/services/[slug]": {
      en: "/services/[slug]",
      hr: "/usluge/[slug]",
    },
    "/services/[slug]/[subSlug]": {
      en: "/services/[slug]/[subSlug]",
      hr: "/usluge/[slug]/[subSlug]",
    },
    "/contact": {
      en: "/contact",
      hr: "/kontakt",
    },
    "/about-us": {
      en: "/about-us",
      hr: "/o-nama",
    },
    "/projects": {
      en: "/projects",
      hr: "/projekti",
    },
    "/blog": {
      en: "/blog",
      hr: "/blog",
    },
    "/offers": {
      en: "/offers",
      hr: "/ponude",
    },
    "/offers/[slug]": {
      en: "/offers/[slug]",
      hr: "/ponude/[slug]",
    },
    "/projects/[slug]": {
      en: "/projects/[slug]",
      hr: "/projekti/[slug]",
    },
    "/blog/[slug]": {
      en: "/blog/[slug]",
      hr: "/blog/[slug]",
    },
    "/privacy-policy": {
      en: "/privacy-policy",
      hr: "/politika-privatnosti",
    },
    "/terms-of-service": {
      en: "/terms-of-service",
      hr: "/uvjeti-koristenja",
    },
  },
});
