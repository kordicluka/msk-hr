"use server";

import type {
  CreateProjectData,
  UpdateProjectData,
  UpdateProjectTranslationData,
  ProjectWithTranslations,
} from "@/types/project";
import { revalidateTag, unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { deserializeContent, serializeContent } from "@/lib/content";

// Cache tagovi za različite scenarije
const CACHE_TAGS = {
  ALL_PROJECTS: "projects:all",
  PROJECT_BY_ID: (id: string) => `project:${id}`,
  PROJECT_BY_SLUG: (slug: string, lang: string) =>
    `project:slug:${slug}:${lang}`,
  PROJECTS_BY_LANG: (lang: string) => `projects:lang:${lang}`,
} as const;

// Kreiranje novog projekta sa prijevodima
export async function createProject(data: CreateProjectData) {
  try {
    const project = await prisma.project.create({
      data: {
        image: data.image,
        order: data.order,
        translations: {
          create: data.translations.map((translation) => ({
            languageCode: translation.languageCode,
            slug: translation.slug,
            title: translation.title,
            description: translation.description,
            shortDescription: translation.shortDescription,
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
    revalidateTag(CACHE_TAGS.ALL_PROJECTS);

    // Invalidiranje cache-a za sve jezike koji su dodani
    data.translations.forEach((translation) => {
      revalidateTag(CACHE_TAGS.PROJECTS_BY_LANG(translation.languageCode));
      revalidateTag(
        CACHE_TAGS.PROJECT_BY_SLUG(translation.slug, translation.languageCode)
      );
    });

    return { success: true, data: project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

// Dohvaćanje svih projekata sa prijevodima - CACHED
export async function getAllProjects(
  lang?: "en" | "hr"
): Promise<ProjectWithTranslations[]> {
  return unstable_cache(
    async () => {
      try {
        const projects = await prisma.project.findMany({
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
          orderBy: {
            order: "asc",
          },
        });

        return projects.map((project) => ({
          ...project,
          translations: project.translations.map((translation) => ({
            ...translation,
            content: deserializeContent(translation.content).data || [],
          })),
          services: project.services.map((projectService) => ({
            ...projectService,
            service: projectService.service
              ? {
                  ...projectService.service,
                  translations:
                    projectService.service.translations?.map((translation) => ({
                      ...translation,
                      content:
                        deserializeContent(translation.content).data || [],
                    })) || [],
                }
              : undefined,
          })),
        }));
      } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
    },
    [`all-projects-${lang || "all"}`],
    {
      tags: [
        CACHE_TAGS.ALL_PROJECTS,
        ...(lang ? [CACHE_TAGS.PROJECTS_BY_LANG(lang)] : []),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje projekta po ID-u - CACHED
export async function getProjectById(
  id: string,
  lang?: "en" | "hr"
): Promise<ProjectWithTranslations | null> {
  return unstable_cache(
    async () => {
      try {
        const project = await prisma.project.findUnique({
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

        if (!project) {
          return null;
        }

        return {
          ...project,
          translations: project.translations.map((translation) => ({
            ...translation,
            content: deserializeContent(translation.content).data || [],
          })),
          services: project.services.map((projectService) => ({
            ...projectService,
            service: projectService.service
              ? {
                  ...projectService.service,
                  translations:
                    projectService.service.translations?.map((translation) => ({
                      ...translation,
                      content:
                        deserializeContent(translation.content).data || [],
                    })) || [],
                }
              : undefined,
          })),
        };
      } catch (error) {
        console.error("Error fetching project:", error);
        return null;
      }
    },
    [`project-${id}-${lang || "all"}`],
    {
      tags: [
        CACHE_TAGS.PROJECT_BY_ID(id),
        ...(lang ? [CACHE_TAGS.PROJECTS_BY_LANG(lang)] : []),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje projekta po slug-u i jeziku - CACHED
export async function getProjectBySlug(
  slug: string,
  languageCode: "en" | "hr"
): Promise<ProjectWithTranslations | null> {
  return unstable_cache(
    async () => {
      try {
        const projectTranslation = await prisma.projectTranslation.findUnique({
          where: {
            slug_languageCode: {
              slug,
              languageCode,
            },
          },
          include: {
            project: {
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

        if (!projectTranslation?.project) {
          return null;
        }

        return {
          ...projectTranslation.project,
          translations: projectTranslation.project.translations.map(
            (translation) => ({
              ...translation,
              content: deserializeContent(translation.content).data || [],
            })
          ),
          services: projectTranslation.project.services.map(
            (projectService) => ({
              ...projectService,
              service: projectService.service
                ? {
                    ...projectService.service,
                    translations:
                      projectService.service.translations?.map(
                        (translation) => ({
                          ...translation,
                          content:
                            deserializeContent(translation.content).data || [],
                        })
                      ) || [],
                  }
                : undefined,
            })
          ),
        };
      } catch (error) {
        console.error("Error fetching project by slug:", error);
        return null;
      }
    },
    [`project-slug-${slug}-${languageCode}`],
    {
      tags: [
        CACHE_TAGS.PROJECT_BY_SLUG(slug, languageCode),
        CACHE_TAGS.PROJECTS_BY_LANG(languageCode),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Ažuriranje projekta
export async function updateProject(
  id: string,
  data: UpdateProjectData,
  lang?: "en" | "hr"
) {
  try {
    // Dohvati postojeći projekt za potrebe cache invalidiranja
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: { translations: true },
    });

    // Ažuriraj osnovne podatke projekta
    const project = await prisma.project.update({
      where: { id },
      data: {
        image: data.image,
        order: data.order,
      },
      include: {
        translations: lang ? { where: { languageCode: lang } } : true,
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

    // Ažuriraj usluge ako su proslijeđene
    if (data.serviceIds) {
      // Obriši postojeće veze s uslugama
      await prisma.projectService.deleteMany({
        where: { projectId: id },
      });

      // Stvori nove veze s uslugama
      await prisma.projectService.createMany({
        data: data.serviceIds.map((serviceId) => ({
          projectId: id,
          serviceId,
        })),
      });
    }

    // Invalidiranje cache-a nakon ažuriranja
    revalidateTag(CACHE_TAGS.ALL_PROJECTS);
    revalidateTag(CACHE_TAGS.PROJECT_BY_ID(id));

    // Invalidiranje cache-a za postojeće prijevode
    existingProject?.translations.forEach((translation) => {
      revalidateTag(CACHE_TAGS.PROJECTS_BY_LANG(translation.languageCode));
      revalidateTag(
        CACHE_TAGS.PROJECT_BY_SLUG(translation.slug, translation.languageCode)
      );
    });

    return { success: true, data: project };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

// Ažuriranje prijevoda projekta
export async function updateProjectTranslation(
  projectId: string,
  languageCode: string,
  data: UpdateProjectTranslationData
) {
  try {
    // Dohvati postojeći prijevod za potrebe cache invalidiranja
    const existingTranslation = await prisma.projectTranslation.findUnique({
      where: {
        projectId_languageCode: {
          projectId,
          languageCode,
        },
      },
    });

    const translation = await prisma.projectTranslation.update({
      where: {
        projectId_languageCode: {
          projectId,
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
    revalidateTag(CACHE_TAGS.ALL_PROJECTS);
    revalidateTag(CACHE_TAGS.PROJECT_BY_ID(projectId));
    revalidateTag(CACHE_TAGS.PROJECTS_BY_LANG(languageCode));

    // Invalidiranje cache-a za stari slug (ako se promijenio)
    if (existingTranslation?.slug && existingTranslation.slug !== data.slug) {
      revalidateTag(
        CACHE_TAGS.PROJECT_BY_SLUG(existingTranslation.slug, languageCode)
      );
    }

    // Invalidiranje cache-a za novi slug
    if (data.slug) {
      revalidateTag(CACHE_TAGS.PROJECT_BY_SLUG(data.slug, languageCode));
    }

    return { success: true, data: translation };
  } catch (error) {
    console.error("Error updating project translation:", error);
    return { success: false, error: "Failed to update project translation" };
  }
}

// Brisanje projekta
export async function deleteProject(id: string) {
  try {
    // Dohvati projekt prije brisanja za potrebe cache invalidiranja
    const projectToDelete = await prisma.project.findUnique({
      where: { id },
      include: { translations: true },
    });

    await prisma.project.delete({
      where: { id },
    });

    // Invalidiranje cache-a nakon brisanja
    revalidateTag(CACHE_TAGS.ALL_PROJECTS);
    revalidateTag(CACHE_TAGS.PROJECT_BY_ID(id));

    // Invalidiranje cache-a za sve prijevode
    projectToDelete?.translations.forEach((translation) => {
      revalidateTag(CACHE_TAGS.PROJECTS_BY_LANG(translation.languageCode));
      revalidateTag(
        CACHE_TAGS.PROJECT_BY_SLUG(translation.slug, translation.languageCode)
      );
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

// Dodavanje prijevoda postojećem projektu
export async function addProjectTranslation(
  projectId: string,
  languageCode: string,
  translationData: Omit<UpdateProjectTranslationData, "id">
) {
  try {
    const translation = await prisma.projectTranslation.create({
      data: {
        projectId,
        languageCode,
        slug: translationData.slug!,
        title: translationData.title!,
        description: translationData.description,
        shortDescription: translationData.shortDescription,
        keywords: translationData.keywords || [],
        content: serializeContent(translationData.content).data || "",
      },
    });

    // Invalidiranje cache-a nakon dodavanja prijevoda
    revalidateTag(CACHE_TAGS.ALL_PROJECTS);
    revalidateTag(CACHE_TAGS.PROJECT_BY_ID(projectId));
    revalidateTag(CACHE_TAGS.PROJECTS_BY_LANG(languageCode));
    revalidateTag(
      CACHE_TAGS.PROJECT_BY_SLUG(translationData.slug!, languageCode)
    );

    return { success: true, data: translation };
  } catch (error) {
    console.error("Error adding project translation:", error);
    return { success: false, error: "Failed to add project translation" };
  }
}

// Brisanje prijevoda projekta
export async function deleteProjectTranslation(
  projectId: string,
  languageCode: string
) {
  try {
    // Dohvati prijevod prije brisanja za potrebe cache invalidiranja
    const translationToDelete = await prisma.projectTranslation.findUnique({
      where: {
        projectId_languageCode: {
          projectId,
          languageCode,
        },
      },
    });

    await prisma.projectTranslation.delete({
      where: {
        projectId_languageCode: {
          projectId,
          languageCode,
        },
      },
    });

    // Invalidiranje cache-a nakon brisanja prijevoda
    revalidateTag(CACHE_TAGS.ALL_PROJECTS);
    revalidateTag(CACHE_TAGS.PROJECT_BY_ID(projectId));
    revalidateTag(CACHE_TAGS.PROJECTS_BY_LANG(languageCode));

    if (translationToDelete?.slug) {
      revalidateTag(
        CACHE_TAGS.PROJECT_BY_SLUG(translationToDelete.slug, languageCode)
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting project translation:", error);
    return { success: false, error: "Failed to delete project translation" };
  }
}

export async function hardCodeProjects() {
  try {
    // Dohvaćanje postojećih usluga za povezivanje
    const services = await prisma.service.findMany({
      take: 3, // Uzmi prve 3 usluge
    });

    if (services.length === 0) {
      return {
        success: false,
        error: "No services found to associate with projects",
      };
    }

    // Prvi projekt
    await createProject({
      image: "/projects/project-1.jpg",
      order: 1,
      serviceIds: [services[0].id, services[1]?.id].filter(Boolean),
      translations: [
        {
          languageCode: "hr",
          slug: "moja-web-stranica",
          title: "Moja Web Stranica",
          description:
            "Kreiranje moderne web stranice za lokalni biznis s potpunom responzivnošću.",
          shortDescription: "Moderna web stranica za lokalni biznis",
          content: [
            {
              type: "pageTitle",
              data: {
                title: "Moja Web Stranica",
                description:
                  "Ovaj projekt uključuje dizajn i razvoj potpuno responzivne web stranice za lokalni biznis. Stranica je optimizirana za SEO i sadrži moderan dizajn.",
                theme: "default",
                size: "default",
                align: "left",
                buttonVariant: "default",
              },
            },
          ],
        },
        {
          languageCode: "en",
          slug: "my-website",
          title: "My Website",
          description:
            "Creating a modern website for local business with full responsiveness.",
          shortDescription: "Modern website for local business",
          content: [
            {
              type: "pageTitle",
              data: {
                title: "My Website",
                description:
                  "This project includes design and development of a fully responsive website for a local business. The site is SEO optimized and features modern design.",
                theme: "default",
                size: "default",
                align: "left",
                buttonVariant: "default",
              },
            },
          ],
        },
      ],
    });

    // Drugi projekt
    await createProject({
      image: "/projects/project-2.jpg",
      order: 2,
      serviceIds: services.slice(0, 2).map((s) => s.id),
      translations: [
        {
          languageCode: "hr",
          slug: "mobilna-aplikacija",
          title: "Mobilna Aplikacija",
          description:
            "Razvoj mobilne aplikacije za upravljanje zalihama s real-time sinkronizacijom.",
          shortDescription: "Mobilna app za upravljanje zalihama",
          content: [
            {
              type: "pageTitle",
              data: {
                title: "Mobilna Aplikacija",
                description:
                  "Kompleksna mobilna aplikacija razvijena u React Native tehnologiji s backend API-jem i real-time funkcionalnostima.",
                theme: "default",
                size: "default",
                align: "left",
                buttonVariant: "default",
              },
            },
          ],
        },
        {
          languageCode: "en",
          slug: "mobile-application",
          title: "Mobile Application",
          description:
            "Development of mobile application for inventory management with real-time synchronization.",
          shortDescription: "Mobile app for inventory management",
          content: [
            {
              type: "pageTitle",
              data: {
                title: "Mobile Application",
                description:
                  "Complex mobile application developed in React Native technology with backend API and real-time functionalities.",
                theme: "default",
                size: "default",
                align: "left",
                buttonVariant: "default",
              },
            },
          ],
        },
      ],
    });

    // Treći projekt
    await createProject({
      image: "/projects/project-3.jpg",
      order: 3,
      serviceIds: [services[services.length - 1].id],
      translations: [
        {
          languageCode: "hr",
          slug: "e-commerce-platforma",
          title: "E-commerce Platforma",
          description:
            "Potpuna e-commerce platforma s integriranim plaćanjem i upravljanjem narudžbama.",
          shortDescription: "Kompletna online trgovina",
          content: [
            {
              type: "pageTitle",
              data: {
                title: "E-commerce Platforma",
                description:
                  "Potpuna e-commerce platforma s integriranim plaćanjem i upravljanjem narudžbama.",
                theme: "default",
                size: "default",
                align: "left",
                buttonVariant: "default",
              },
            },
          ],
        },
        {
          languageCode: "en",
          slug: "ecommerce-platform",
          title: "E-commerce Platform",
          description:
            "Complete e-commerce platform with integrated payments and order management.",
          shortDescription: "Complete online store",
          content: [
            {
              type: "pageTitle",
              data: {
                title: "E-commerce Platform",
                description:
                  "Complete e-commerce platform with integrated payments and order management.",
                theme: "default",
                size: "default",
                align: "left",
                buttonVariant: "default",
              },
            },
          ],
        },
      ],
    });

    console.log("Hard-coded projects created successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error creating hard-coded projects:", error);
    return { success: false, error: "Failed to create hard-coded projects" };
  }
}
