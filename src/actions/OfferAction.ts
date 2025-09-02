"use server";

import type {
  CreateOfferData,
  UpdateOfferData,
  UpdateOfferTranslationData,
  OfferWithTranslations,
} from "@/types/offer";
import { revalidateTag, unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { deserializeContent, serializeContent } from "@/lib/content";

// Cache tagovi za različite scenarije
const CACHE_TAGS = {
  ALL_OFFERS: "offers:all",
  OFFER_BY_ID: (id: string) => `offer:${id}`,
  OFFER_BY_SLUG: (slug: string, lang: string) => `offer:slug:${slug}:${lang}`,
  OFFERS_BY_LANG: (lang: string) => `offers:lang:${lang}`,
} as const;

// Kreiranje nove ponude sa prijevodima
export async function createOffer(data: CreateOfferData) {
  try {
    const offer = await prisma.offer.create({
      data: {
        priceFrom: data.priceFrom,
        priceTo: data.priceTo,
        icon: data.icon,
        order: data.order,
        translations: {
          create: data.translations.map((translation) => ({
            languageCode: translation.languageCode,
            slug: translation.slug,
            title: translation.title,
            subtitle: translation.subtitle,
            description: translation.description,
            keywords: translation.keywords || [],
            content: serializeContent(translation.content).data || "",
          })),
        },
        services: {
          create: data.serviceIds.map((serviceId) => ({
            serviceId,
          })),
        },
      },
      include: {
        translations: true,
        services: {
          include: {
            service: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
    });

    // Invalidiranje cache-a nakon kreiranja
    revalidateTag(CACHE_TAGS.ALL_OFFERS);

    // Invalidiranje cache-a za sve jezike koji su dodani
    data.translations.forEach((translation) => {
      revalidateTag(CACHE_TAGS.OFFERS_BY_LANG(translation.languageCode));
      revalidateTag(
        CACHE_TAGS.OFFER_BY_SLUG(translation.slug, translation.languageCode)
      );
    });

    return { success: true, data: offer };
  } catch (error) {
    console.error("Error creating offer:", error);
    return { success: false, error: "Failed to create offer" };
  }
}

// Dohvaćanje svih ponuda sa prijevodima - CACHED
export async function getAllOffers(
  lang?: "en" | "hr"
): Promise<OfferWithTranslations[]> {
  return unstable_cache(
    async () => {
      try {
        const offers = await prisma.offer.findMany({
          include: {
            translations: lang ? { where: { languageCode: lang } } : true,
            services: {
              include: {
                service: {
                  include: {
                    translations: lang
                      ? { where: { languageCode: lang } }
                      : true,
                    parentService: {
                      include: {
                        translations: lang
                          ? { where: { languageCode: lang } }
                          : true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        });

        return offers.map((offer) => ({
          ...offer,
          translations: offer.translations.map((translation) => ({
            ...translation,
            content: deserializeContent(translation.content).data || [],
          })),
          services: offer.services.map((offerService) => ({
            ...offerService,
            service: {
              ...offerService.service,
              translations: offerService.service.translations.map(
                (translation) => ({
                  ...translation,
                  content: deserializeContent(translation.content).data || [],
                })
              ),
              parentService: offerService.service.parentService
                ? {
                    ...offerService.service.parentService,
                    translations:
                      offerService.service.parentService.translations.map(
                        (translation) => ({
                          ...translation,
                          content:
                            deserializeContent(translation.content).data || [],
                        })
                      ),
                  }
                : null,
            },
          })),
        }));
      } catch (error) {
        console.error("Error fetching offers:", error);
        return [];
      }
    },
    [`all-offers-${lang || "all"}`],
    {
      tags: [
        CACHE_TAGS.ALL_OFFERS,
        ...(lang ? [CACHE_TAGS.OFFERS_BY_LANG(lang)] : []),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje ponude po ID-u - CACHED
export async function getOfferById(
  id: string,
  lang?: "en" | "hr"
): Promise<OfferWithTranslations | null> {
  return unstable_cache(
    async () => {
      try {
        const offer = await prisma.offer.findUnique({
          where: { id },
          include: {
            translations: lang ? { where: { languageCode: lang } } : true,
            services: {
              include: {
                service: {
                  include: {
                    translations: lang
                      ? { where: { languageCode: lang } }
                      : true,
                  },
                },
              },
            },
          },
        });

        if (!offer) {
          return null;
        }

        return {
          ...offer,
          translations: offer.translations.map((translation) => ({
            ...translation,
            content: deserializeContent(translation.content).data || [],
          })),
          services: offer.services.map((offerService) => ({
            ...offerService,
            service: {
              ...offerService.service,
              translations: offerService.service.translations.map(
                (translation) => ({
                  ...translation,
                  content: deserializeContent(translation.content).data || [],
                })
              ),
            },
          })),
        };
      } catch (error) {
        console.error("Error fetching offer:", error);
        return null;
      }
    },
    [`offer-${id}-${lang || "all"}`],
    {
      tags: [
        CACHE_TAGS.OFFER_BY_ID(id),
        ...(lang ? [CACHE_TAGS.OFFERS_BY_LANG(lang)] : []),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje ponude po slug-u i jeziku - CACHED
export async function getOfferBySlug(
  slug: string,
  languageCode: "en" | "hr"
): Promise<OfferWithTranslations | null> {
  return unstable_cache(
    async () => {
      try {
        const offerTranslation = await prisma.offerTranslation.findUnique({
          where: {
            slug_languageCode: {
              slug,
              languageCode,
            },
          },
          include: {
            offer: {
              include: {
                translations: true,
                services: {
                  include: {
                    service: {
                      include: {
                        translations: languageCode
                          ? { where: { languageCode } }
                          : true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!offerTranslation?.offer) {
          return null;
        }

        return {
          ...offerTranslation.offer,
          translations: offerTranslation.offer.translations.map(
            (translation) => ({
              ...translation,
              content: deserializeContent(translation.content).data || [],
            })
          ),
          services: offerTranslation.offer.services.map((offerService) => ({
            ...offerService,
            service: {
              ...offerService.service,
              translations: offerService.service.translations.map(
                (translation) => ({
                  ...translation,
                  content: deserializeContent(translation.content).data || [],
                })
              ),
            },
          })),
        };
      } catch (error) {
        console.error("Error fetching offer by slug:", error);
        return null;
      }
    },
    [`offer-slug-${slug}-${languageCode}`],
    {
      tags: [
        CACHE_TAGS.OFFER_BY_SLUG(slug, languageCode),
        CACHE_TAGS.OFFERS_BY_LANG(languageCode),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Ažuriranje ponude
export async function updateOffer(
  id: string,
  data: UpdateOfferData,
  lang?: "en" | "hr"
) {
  try {
    // Dohvati postojeću ponudu za potrebe cache invalidiranja
    const existingOffer = await prisma.offer.findUnique({
      where: { id },
      include: { translations: true },
    });

    // Ažuriraj osnovne podatke ponude
    const offer = await prisma.offer.update({
      where: { id },
      data: {
        priceFrom: data.priceFrom,
        priceTo: data.priceTo,
        icon: data.icon,
        order: data.order,
      },
      include: {
        translations: lang ? { where: { languageCode: lang } } : true,
        services: {
          include: {
            service: {
              include: {
                translations: lang ? { where: { languageCode: lang } } : true,
              },
            },
          },
        },
      },
    });

    // Ažuriraj veze sa uslugama
    await prisma.offerService.deleteMany({
      where: { offerId: id },
    });

    if (data.serviceIds.length > 0) {
      await prisma.offerService.createMany({
        data: data.serviceIds.map((serviceId) => ({
          offerId: id,
          serviceId,
        })),
      });
    }

    // Invalidiranje cache-a nakon ažuriranja
    revalidateTag(CACHE_TAGS.ALL_OFFERS);
    revalidateTag(CACHE_TAGS.OFFER_BY_ID(id));

    // Invalidiranje cache-a za postojeće prijevode
    existingOffer?.translations.forEach((translation) => {
      revalidateTag(CACHE_TAGS.OFFERS_BY_LANG(translation.languageCode));
      revalidateTag(
        CACHE_TAGS.OFFER_BY_SLUG(translation.slug, translation.languageCode)
      );
    });

    return { success: true, data: offer };
  } catch (error) {
    console.error("Error updating offer:", error);
    return { success: false, error: "Failed to update offer" };
  }
}

// Ažuriranje prijevoda ponude
export async function updateOfferTranslation(
  offerId: string,
  languageCode: string,
  data: UpdateOfferTranslationData
) {
  try {
    // Dohvati postojeći prijevod za potrebe cache invalidiranja
    const existingTranslation = await prisma.offerTranslation.findUnique({
      where: {
        offerId_languageCode: {
          offerId,
          languageCode,
        },
      },
    });

    const translation = await prisma.offerTranslation.update({
      where: {
        offerId_languageCode: {
          offerId,
          languageCode,
        },
      },
      data: {
        ...data,
        keywords: data.keywords || [],
        content: serializeContent(data.content).data || "",
      },
    });

    // Invalidiranje cache-a nakon ažuriranja prijevoda
    revalidateTag(CACHE_TAGS.ALL_OFFERS);
    revalidateTag(CACHE_TAGS.OFFER_BY_ID(offerId));
    revalidateTag(CACHE_TAGS.OFFERS_BY_LANG(languageCode));

    // Invalidiranje cache-a za stari slug (ako se promijenio)
    if (existingTranslation?.slug && existingTranslation.slug !== data.slug) {
      revalidateTag(
        CACHE_TAGS.OFFER_BY_SLUG(existingTranslation.slug, languageCode)
      );
    }

    // Invalidiranje cache-a za novi slug
    if (data.slug) {
      revalidateTag(CACHE_TAGS.OFFER_BY_SLUG(data.slug, languageCode));
    }

    return { success: true, data: translation };
  } catch (error) {
    console.error("Error updating offer translation:", error);
    return { success: false, error: "Failed to update offer translation" };
  }
}

// Brisanje ponude
export async function deleteOffer(id: string) {
  try {
    // Dohvati ponudu prije brisanja za potrebe cache invalidiranja
    const offerToDelete = await prisma.offer.findUnique({
      where: { id },
      include: { translations: true },
    });

    await prisma.offer.delete({
      where: { id },
    });

    // Invalidiranje cache-a nakon brisanja
    revalidateTag(CACHE_TAGS.ALL_OFFERS);
    revalidateTag(CACHE_TAGS.OFFER_BY_ID(id));

    // Invalidiranje cache-a za sve prijevode
    offerToDelete?.translations.forEach((translation) => {
      revalidateTag(CACHE_TAGS.OFFERS_BY_LANG(translation.languageCode));
      revalidateTag(
        CACHE_TAGS.OFFER_BY_SLUG(translation.slug, translation.languageCode)
      );
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting offer:", error);
    return { success: false, error: "Failed to delete offer" };
  }
}

// Dodavanje prijevoda postojećoj ponudi
export async function addOfferTranslation(
  offerId: string,
  languageCode: string,
  translationData: Omit<UpdateOfferTranslationData, "id">
) {
  try {
    const translation = await prisma.offerTranslation.create({
      data: {
        offerId,
        languageCode,
        slug: translationData.slug!,
        title: translationData.title!,
        subtitle: translationData.subtitle,
        description: translationData.description,
        keywords: translationData.keywords || [],
        content: serializeContent(translationData.content).data || "",
      },
    });

    // Invalidiranje cache-a nakon dodavanja prijevoda
    revalidateTag(CACHE_TAGS.ALL_OFFERS);
    revalidateTag(CACHE_TAGS.OFFER_BY_ID(offerId));
    revalidateTag(CACHE_TAGS.OFFERS_BY_LANG(languageCode));
    revalidateTag(
      CACHE_TAGS.OFFER_BY_SLUG(translationData.slug!, languageCode)
    );

    return { success: true, data: translation };
  } catch (error) {
    console.error("Error adding offer translation:", error);
    return { success: false, error: "Failed to add offer translation" };
  }
}

// Brisanje prijevoda ponude
export async function deleteOfferTranslation(
  offerId: string,
  languageCode: string
) {
  try {
    // Dohvati prijevod prije brisanja za potrebe cache invalidiranja
    const translationToDelete = await prisma.offerTranslation.findUnique({
      where: {
        offerId_languageCode: {
          offerId,
          languageCode,
        },
      },
    });

    await prisma.offerTranslation.delete({
      where: {
        offerId_languageCode: {
          offerId,
          languageCode,
        },
      },
    });

    // Invalidiranje cache-a nakon brisanja prijevoda
    revalidateTag(CACHE_TAGS.ALL_OFFERS);
    revalidateTag(CACHE_TAGS.OFFER_BY_ID(offerId));
    revalidateTag(CACHE_TAGS.OFFERS_BY_LANG(languageCode));

    if (translationToDelete?.slug) {
      revalidateTag(
        CACHE_TAGS.OFFER_BY_SLUG(translationToDelete.slug, languageCode)
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting offer translation:", error);
    return { success: false, error: "Failed to delete offer translation" };
  }
}

// Kreiranje test podataka
export async function hardCodeOffers() {
  try {
    // Prva ponuda - Jednostavna web stranica
    await createOffer({
      priceFrom: "300",
      priceTo: "1000",
      icon: "/services/webshop/webshop-3.png",
      order: 1,
      serviceIds: [], // Popunit ćemo kasnije kada budemo imali usluge
      translations: [
        {
          languageCode: "hr",
          slug: "jednostavna-web-stranica",
          title: "Izrada Jednostavnih Web Stranica",
          subtitle: "Profesionalna web rješenja",
          description:
            "Izrada jednostavnih web stranica za vašu firmu ili projekt. Fokusiramo se na izradu responzivnih, brzih i SEO optimiziranih web stranica koje izgledaju sjajno na svakom uređaju. Naš cilj je osigurati snažnu online prisutnost za vaš brend uz čist i učinkovit dizajn.",
          content: [
            {
              type: "pageTitle",
              data: {
                title: "We specialize in SEO, SEM, social media marketing",
                description:
                  "Our approach is data-driven and results-oriented.",
                theme: "transparent",
                size: "default",
                align: "left",
                buttonVariant: "default",
              },
            },
          ],
        },
        {
          languageCode: "en",
          slug: "simple-web-page-design",
          title: "Simple Web Page Design",
          subtitle: "Professional web solutions",
          description:
            "Simple web page design for your business or project. We focus on creating responsive, fast-loading, and SEO-friendly websites that look great on any device. Our goal is to provide a strong online presence for your brand with a clean and effective design.",
          content: [
            {
              type: "pageTitle",
              data: {
                title: "We specialize in SEO, SEM, social media marketing",
                description:
                  "Our approach is data-driven and results-oriented.",
                theme: "transparent",
                size: "default",
                align: "left",
                buttonVariant: "default",
              },
            },
          ],
        },
      ],
    });

    // Druga ponuda - Web shop
    await createOffer({
      priceFrom: "1000",
      priceTo: "3000",
      icon: "/services/webshop/webshop-3.png",
      order: 2,
      serviceIds: [],
      translations: [
        {
          languageCode: "hr",
          slug: "web-shop-aplikacija",
          title: "Izrada Web & Mobilne Web Shop Aplikacije",
          subtitle: "E-commerce platforme",
          description:
            "Dobijate web i mobilnu aplikaciju za vaš web shop. Naša rješenja uključuju sveobuhvatno upravljanje proizvodima, sigurne sustave plaćanja, korisničke račune i praćenje narudžbi. Osiguravamo besprijekorno iskustvo kupovine na svim platformama, uključujući iOS i Android.",
          content: [
            {
              type: "pageTitle",
              data: {
                title: "We specialize in SEO, SEM, social media marketing",
                description:
                  "Our approach is data-driven and results-oriented.",
                theme: "transparent",
                size: "default",
                align: "left",
                buttonVariant: "default",
              },
            },
          ],
        },
        {
          languageCode: "en",
          slug: "web-and-mobile-web-shop-application",
          title: "Web & Mobile Web Shop Application",
          subtitle: "E-commerce platforms",
          description:
            "Get a web and mobile web shop application for your business. Our solutions include comprehensive product management, secure payment gateways, user accounts, and order tracking. We ensure a seamless shopping experience across all platforms, including iOS and Android.",
          content: [
            {
              type: "pageTitle",
              data: {
                title: "We specialize in SEO, SEM, social media marketing",
                description:
                  "Our approach is data-driven and results-oriented.",
                theme: "transparent",
                size: "default",
                align: "left",
                buttonVariant: "default",
              },
            },
          ],
        },
      ],
    });

    // Treća ponuda - Kontrola pristupa
    await createOffer({
      priceFrom: "1000",
      priceTo: "3000",
      icon: "/services/webshop/webshop-3.png",
      order: 3,
      serviceIds: [],
      translations: [
        {
          languageCode: "hr",
          slug: "kontrola-pristupa",
          title: "Ugradnja sustava za kontrolu pristupa",
          subtitle: "Sigurnosni sustavi",
          description:
            "Osigurajte sigurnost vaše firme ili projekta s našim sustavom za kontrolu pristupa. Nudimo napredna rješenja uključujući biometrijske, kartične i sustave za daljinski pristup. Poboljšajte svoju sigurnost, učinkovito upravljajte ulaznim točkama i pratite sva kretanja unutar vašeg prostora.",
          content: [
            {
              type: "pageTitle",
              data: {
                title: "We specialize in SEO, SEM, social media marketing",
                description:
                  "Our approach is data-driven and results-oriented.",
                theme: "transparent",
                size: "default",
                align: "left",
                buttonVariant: "default",
              },
            },
          ],
        },
        {
          languageCode: "en",
          slug: "access-control-system-installation",
          title: "Access Control System Installation",
          subtitle: "Security systems",
          description:
            "Ensure the security of your business or project with our access control system. We offer advanced solutions including biometric, card-based, and remote access systems. Enhance your security, manage entry points efficiently, and keep track of all movements within your premises.",
          content: [
            {
              type: "pageTitle",
              data: {
                title: "We specialize in SEO, SEM, social media marketing",
                description:
                  "Our approach is data-driven and results-oriented.",
                theme: "transparent",
                size: "default",
                align: "left",
                buttonVariant: "default",
              },
            },
          ],
        },
      ],
    });

    console.log("Hard-coded offers created successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error creating hard-coded offers:", error);
    return { success: false, error: "Failed to create hard-coded offers" };
  }
}
