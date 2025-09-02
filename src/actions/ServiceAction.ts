"use server";

import type {
  CreateServiceData,
  UpdateServiceData,
  UpdateServiceTranslationData,
  ServiceWithTranslations,
  ServiceHierarchy,
} from "@/types/service";
import { revalidateTag, unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { deserializeContent, serializeContent } from "@/lib/content";

// Cache tagovi za različite scenarije
const CACHE_TAGS = {
  ALL_SERVICES: "services:all",
  SERVICE_HIERARCHY: "services:hierarchy",
  PARENT_SERVICES: "services:parent",
  SERVICE_BY_ID: (id: string) => `service:${id}`,
  SERVICE_BY_SLUG: (slug: string, lang: string) =>
    `service:slug:${slug}:${lang}`,
  SERVICES_BY_PARENT: (parentId: string) => `services:parent:${parentId}`,
  SERVICES_BY_LANG: (lang: string) => `services:lang:${lang}`,
} as const;

// Kreiranje novog servisa sa prijevodima
export async function createService(data: CreateServiceData) {
  try {
    const service = await prisma.service.create({
      data: {
        parentServiceId: data.parentServiceId,
        image: data.image,
        order: data.order,
        translations: {
          create: data.translations.map((translation) => ({
            languageCode: translation.languageCode,
            slug: translation.slug,
            title: translation.title,
            subtitle: translation.subtitle,
            description: translation.description,
            shortDescription: translation.shortDescription,
            keywords: translation.keywords || [],
            content: serializeContent(translation.content).data || "",
          })),
        },
      },
      include: {
        translations: true,
        parentService: true,
        childServices: true,
      },
    });

    // Invalidiranje cache-a nakon kreiranja
    revalidateTag(CACHE_TAGS.ALL_SERVICES);
    revalidateTag(CACHE_TAGS.SERVICE_HIERARCHY);
    revalidateTag(CACHE_TAGS.PARENT_SERVICES);

    // Invalidiranje cache-a za parent servis ako postoji
    if (data.parentServiceId) {
      revalidateTag(CACHE_TAGS.SERVICE_BY_ID(data.parentServiceId));
      revalidateTag(CACHE_TAGS.SERVICES_BY_PARENT(data.parentServiceId));
    }

    // Invalidiranje cache-a za sve jezike koji su dodani
    data.translations.forEach((translation) => {
      revalidateTag(CACHE_TAGS.SERVICES_BY_LANG(translation.languageCode));
      revalidateTag(
        CACHE_TAGS.SERVICE_BY_SLUG(translation.slug, translation.languageCode)
      );
    });

    return { success: true, data: service };
  } catch (error) {
    console.error("Error creating service:", error);
    return { success: false, error: "Failed to create service" };
  }
}

// Dohvaćanje svih servisa sa prijevodima - CACHED
export async function getAllServices(
  lang?: "en" | "hr"
): Promise<ServiceWithTranslations[]> {
  return unstable_cache(
    async () => {
      try {
        const services = await prisma.service.findMany({
          include: {
            translations: lang ? { where: { languageCode: lang } } : true,
            parentService: true,
            childServices: {
              include: {
                translations: lang ? { where: { languageCode: lang } } : true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        });

        return services.map((service) => ({
          ...service,
          translations: service.translations.map((translation) => ({
            ...translation,
            content: deserializeContent(translation.content).data || [],
          })),
          childServices: service.childServices.map((childService) => ({
            ...childService,
            translations: childService.translations.map((translation) => ({
              ...translation,
              content: deserializeContent(translation.content).data || [],
            })),
          })),
        }));
      } catch (error) {
        console.error("Error fetching services:", error);
        return [];
      }
    },
    [`all-services-${lang || "all"}`],
    {
      tags: [
        CACHE_TAGS.ALL_SERVICES,
        ...(lang ? [CACHE_TAGS.SERVICES_BY_LANG(lang)] : []),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje servisa po ID-u - CACHED
export async function getServiceById(
  id: string,
  lang?: "en" | "hr"
): Promise<ServiceWithTranslations | null> {
  return unstable_cache(
    async () => {
      try {
        const service = await prisma.service.findUnique({
          where: { id },
          include: {
            translations: lang ? { where: { languageCode: lang } } : true,
            parentService: true,
            childServices: {
              include: {
                translations: lang ? { where: { languageCode: lang } } : true,
              },
            },
          },
        });

        if (!service) {
          return null;
        }

        return {
          ...service,
          translations:
            service.translations.map((translation) => ({
              ...translation,
              content: deserializeContent(translation.content).data || [],
            })) || [],
          childServices:
            service.childServices.map((childService) => ({
              ...childService,
              translations: childService.translations.map((translation) => ({
                ...translation,
                content: deserializeContent(translation.content).data || [],
              })),
            })) || [],
        };
      } catch (error) {
        console.error("Error fetching service:", error);
        return null;
      }
    },
    [`service-${id}-${lang || "all"}`],
    {
      tags: [
        CACHE_TAGS.SERVICE_BY_ID(id),
        ...(lang ? [CACHE_TAGS.SERVICES_BY_LANG(lang)] : []),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje servisa po slug-u i jeziku - CACHED
export async function getServiceBySlug(
  slug: string,
  languageCode: "en" | "hr"
): Promise<ServiceWithTranslations | null> {
  return unstable_cache(
    async () => {
      try {
        const serviceTranslation = await prisma.serviceTranslation.findUnique({
          where: {
            slug_languageCode: {
              slug,
              languageCode,
            },
          },
          include: {
            service: {
              include: {
                translations: languageCode ? { where: { languageCode } } : true,
                parentService: {
                  include: {
                    translations: languageCode
                      ? { where: { languageCode } }
                      : true,
                  },
                },
                childServices: {
                  include: {
                    translations: languageCode
                      ? { where: { languageCode } }
                      : true,
                  },
                },
              },
            },
          },
        });

        if (!serviceTranslation?.service) {
          return null;
        }

        return {
          ...serviceTranslation.service,
          translations: serviceTranslation.service.translations.map(
            (translation) => ({
              ...translation,
              content: deserializeContent(translation.content).data || [],
            })
          ),
          parentService: serviceTranslation.service.parentService
            ? {
                ...serviceTranslation.service.parentService,
                translations:
                  serviceTranslation.service.parentService.translations.map(
                    (translation) => ({
                      ...translation,
                      content:
                        deserializeContent(translation.content).data || [],
                    })
                  ),
              }
            : null,
          childServices: serviceTranslation.service.childServices.map(
            (childService) => ({
              ...childService,
              translations: childService.translations.map((translation) => ({
                ...translation,
                content: deserializeContent(translation.content).data || [],
              })),
            })
          ),
        };
      } catch (error) {
        console.error("Error fetching service by slug:", error);
        return null;
      }
    },
    [`service-slug-${slug}-${languageCode}`],
    {
      tags: [
        CACHE_TAGS.SERVICE_BY_SLUG(slug, languageCode),
        CACHE_TAGS.SERVICES_BY_LANG(languageCode),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje hijerarhije servisa (root servisi) - CACHED
export async function getServiceHierarchy(
  lang?: "en" | "hr"
): Promise<ServiceHierarchy[]> {
  return unstable_cache(
    async () => {
      try {
        const rootServices = await prisma.service.findMany({
          where: {
            parentServiceId: null,
          },
          include: {
            translations: lang ? { where: { languageCode: lang } } : true,
            childServices: {
              include: {
                translations: lang ? { where: { languageCode: lang } } : true,
                childServices: {
                  include: {
                    translations: true,
                  },
                },
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        });

        return rootServices.map((service) => ({
          ...service,
          translations: service.translations.map((translation) => ({
            ...translation,
            content: deserializeContent(translation.content).data || [],
          })),
          childServices: service.childServices.map((childService) => ({
            ...childService,
            translations: childService.translations.map((translation) => ({
              ...translation,
              content: deserializeContent(translation.content).data || [],
            })),
            childServices: childService.childServices.map((nestedChild) => ({
              ...nestedChild,
              translations: nestedChild.translations.map((translation) => ({
                ...translation,
                content: deserializeContent(translation.content).data || [],
              })),
              childServices: [], // Nested children don't have further children in this query
            })),
          })),
        }));
      } catch (error) {
        console.error("Error fetching service hierarchy:", error);
        return [];
      }
    },
    [`service-hierarchy-${lang || "all"}`],
    {
      tags: [
        CACHE_TAGS.SERVICE_HIERARCHY,
        CACHE_TAGS.PARENT_SERVICES,
        CACHE_TAGS.ALL_SERVICES, // Potrebno jer uključuje child servise
        ...(lang ? [CACHE_TAGS.SERVICES_BY_LANG(lang)] : []),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje samo parent usluga (bez child podataka) - CACHED
export async function getParentServices(
  lang?: "en" | "hr"
): Promise<ServiceWithTranslations[]> {
  return unstable_cache(
    async () => {
      try {
        const parentServices = await prisma.service.findMany({
          where: {
            parentServiceId: null,
          },
          include: {
            translations: lang ? { where: { languageCode: lang } } : true,
          },
          orderBy: {
            order: "asc",
          },
        });

        return parentServices.map((service) => ({
          ...service,
          translations: service.translations.map((translation) => ({
            ...translation,
            content: deserializeContent(translation.content).data || [],
          })),
        }));
      } catch (error) {
        console.error("Error fetching parent services:", error);
        return [];
      }
    },
    [`parent-services-${lang || "all"}`],
    {
      tags: [
        CACHE_TAGS.PARENT_SERVICES,
        ...(lang ? [CACHE_TAGS.SERVICES_BY_LANG(lang)] : []),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Ažuriranje servisa
export async function updateService(
  id: string,
  data: UpdateServiceData,
  lang?: "en" | "hr"
) {
  try {
    // Dohvati postojeći servis za potrebe cache invalidiranja
    const existingService = await prisma.service.findUnique({
      where: { id },
      include: { translations: true },
    });

    const service = await prisma.service.update({
      where: { id },
      data: {
        parentServiceId: data.parentServiceId,
        image: data.image,
        order: data.order,
      },
      include: {
        translations: lang ? { where: { languageCode: lang } } : true,
        parentService: true,
        childServices: true,
      },
    });

    // Invalidiranje cache-a nakon ažuriranja
    revalidateTag(CACHE_TAGS.ALL_SERVICES);
    revalidateTag(CACHE_TAGS.SERVICE_HIERARCHY);
    revalidateTag(CACHE_TAGS.PARENT_SERVICES);
    revalidateTag(CACHE_TAGS.SERVICE_BY_ID(id));

    // Invalidiranje cache-a za postojeće prijevode
    existingService?.translations.forEach((translation) => {
      revalidateTag(CACHE_TAGS.SERVICES_BY_LANG(translation.languageCode));
      revalidateTag(
        CACHE_TAGS.SERVICE_BY_SLUG(translation.slug, translation.languageCode)
      );
    });

    // Invalidiranje cache-a za stari i novi parent servis
    if (existingService?.parentServiceId) {
      revalidateTag(CACHE_TAGS.SERVICE_BY_ID(existingService.parentServiceId));
      revalidateTag(
        CACHE_TAGS.SERVICES_BY_PARENT(existingService.parentServiceId)
      );
    }

    if (
      data.parentServiceId &&
      data.parentServiceId !== existingService?.parentServiceId
    ) {
      revalidateTag(CACHE_TAGS.SERVICE_BY_ID(data.parentServiceId));
      revalidateTag(CACHE_TAGS.SERVICES_BY_PARENT(data.parentServiceId));
    }

    return { success: true, data: service };
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, error: "Failed to update service" };
  }
}

// Ažuriranje prijevoda servisa
export async function updateServiceTranslation(
  serviceId: string,
  languageCode: string,
  data: UpdateServiceTranslationData
) {
  try {
    // Dohvati postojeći prijevod za potrebe cache invalidiranja
    const existingTranslation = await prisma.serviceTranslation.findUnique({
      where: {
        serviceId_languageCode: {
          serviceId,
          languageCode,
        },
      },
    });

    const translation = await prisma.serviceTranslation.update({
      where: {
        serviceId_languageCode: {
          serviceId,
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
    revalidateTag(CACHE_TAGS.ALL_SERVICES);
    revalidateTag(CACHE_TAGS.SERVICE_HIERARCHY);
    revalidateTag(CACHE_TAGS.PARENT_SERVICES);
    revalidateTag(CACHE_TAGS.SERVICE_BY_ID(serviceId));
    revalidateTag(CACHE_TAGS.SERVICES_BY_LANG(languageCode));

    // Invalidiranje cache-a za stari slug (ako se promijenio)
    if (existingTranslation?.slug && existingTranslation.slug !== data.slug) {
      revalidateTag(
        CACHE_TAGS.SERVICE_BY_SLUG(existingTranslation.slug, languageCode)
      );
    }

    // Invalidiranje cache-a za novi slug
    if (data.slug) {
      revalidateTag(CACHE_TAGS.SERVICE_BY_SLUG(data.slug, languageCode));
    }

    return { success: true, data: translation };
  } catch (error) {
    console.error("Error updating service translation:", error);
    return { success: false, error: "Failed to update service translation" };
  }
}

// Brisanje servisa
export async function deleteService(id: string) {
  try {
    // Prvo provjeri ima li dijete servise
    const childServices = await prisma.service.findMany({
      where: { parentServiceId: id },
    });

    if (childServices.length > 0) {
      return {
        success: false,
        error:
          "Cannot delete service with child services. Delete child services first.",
      };
    }

    // Dohvati servis prije brisanja za potrebe cache invalidiranja
    const serviceToDelete = await prisma.service.findUnique({
      where: { id },
      include: { translations: true },
    });

    await prisma.service.delete({
      where: { id },
    });

    // Invalidiranje cache-a nakon brisanja
    revalidateTag(CACHE_TAGS.ALL_SERVICES);
    revalidateTag(CACHE_TAGS.SERVICE_HIERARCHY);
    revalidateTag(CACHE_TAGS.PARENT_SERVICES);
    revalidateTag(CACHE_TAGS.SERVICE_BY_ID(id));

    // Invalidiranje cache-a za parent servis ako postoji
    if (serviceToDelete?.parentServiceId) {
      revalidateTag(CACHE_TAGS.SERVICE_BY_ID(serviceToDelete.parentServiceId));
      revalidateTag(
        CACHE_TAGS.SERVICES_BY_PARENT(serviceToDelete.parentServiceId)
      );
    }

    // Invalidiranje cache-a za sve prijevode
    serviceToDelete?.translations.forEach((translation) => {
      revalidateTag(CACHE_TAGS.SERVICES_BY_LANG(translation.languageCode));
      revalidateTag(
        CACHE_TAGS.SERVICE_BY_SLUG(translation.slug, translation.languageCode)
      );
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, error: "Failed to delete service" };
  }
}

// Dodavanje prijevoda postojećem servisu
export async function addServiceTranslation(
  serviceId: string,
  languageCode: string,
  translationData: Omit<UpdateServiceTranslationData, "id">
) {
  try {
    const translation = await prisma.serviceTranslation.create({
      data: {
        serviceId,
        languageCode,
        slug: translationData.slug!,
        title: translationData.title!,
        subtitle: translationData.subtitle,
        description: translationData.description,
        shortDescription: translationData.shortDescription,
        keywords: translationData.keywords || [],
        content: serializeContent(translationData.content).data || "",
      },
    });

    // Invalidiranje cache-a nakon dodavanja prijevoda
    revalidateTag(CACHE_TAGS.ALL_SERVICES);
    revalidateTag(CACHE_TAGS.SERVICE_HIERARCHY);
    revalidateTag(CACHE_TAGS.PARENT_SERVICES);
    revalidateTag(CACHE_TAGS.SERVICE_BY_ID(serviceId));
    revalidateTag(CACHE_TAGS.SERVICES_BY_LANG(languageCode));
    revalidateTag(
      CACHE_TAGS.SERVICE_BY_SLUG(translationData.slug!, languageCode)
    );

    return { success: true, data: translation };
  } catch (error) {
    console.error("Error adding service translation:", error);
    return { success: false, error: "Failed to add service translation" };
  }
}

// Brisanje prijevoda servisa
export async function deleteServiceTranslation(
  serviceId: string,
  languageCode: string
) {
  try {
    // Dohvati prijevod prije brisanja za potrebe cache invalidiranja
    const translationToDelete = await prisma.serviceTranslation.findUnique({
      where: {
        serviceId_languageCode: {
          serviceId,
          languageCode,
        },
      },
    });

    await prisma.serviceTranslation.delete({
      where: {
        serviceId_languageCode: {
          serviceId,
          languageCode,
        },
      },
    });

    // Invalidiranje cache-a nakon brisanja prijevoda
    revalidateTag(CACHE_TAGS.ALL_SERVICES);
    revalidateTag(CACHE_TAGS.SERVICE_HIERARCHY);
    revalidateTag(CACHE_TAGS.PARENT_SERVICES);
    revalidateTag(CACHE_TAGS.SERVICE_BY_ID(serviceId));
    revalidateTag(CACHE_TAGS.SERVICES_BY_LANG(languageCode));

    if (translationToDelete?.slug) {
      revalidateTag(
        CACHE_TAGS.SERVICE_BY_SLUG(translationToDelete.slug, languageCode)
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting service translation:", error);
    return { success: false, error: "Failed to delete service translation" };
  }
}

export async function hardCodeServices() {
  try {
    console.log("Hard-coded services created successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error creating hard-coded services:", error);
    return { success: false, error: "Failed to create hard-coded services" };
  }
}
