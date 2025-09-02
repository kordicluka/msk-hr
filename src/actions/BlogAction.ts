"use server";

import type {
  CreateBlogData,
  UpdateBlogData,
  UpdateBlogTranslationData,
  BlogWithTranslations,
} from "@/types/blog";
import { revalidateTag, unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { serializeContent, deserializeContent } from "@/lib/content";

// Cache tagovi za različite scenarije
const CACHE_TAGS = {
  ALL_BLOGS: "blogs:all",
  BLOG_BY_ID: (id: string) => `blog:${id}`,
  BLOG_BY_SLUG: (slug: string, lang: string) => `blog:slug:${slug}:${lang}`,
  BLOGS_BY_LANG: (lang: string) => `blogs:lang:${lang}`,
} as const;

// Kreiranje novog bloga sa prijevodima
export async function createBlog(data: CreateBlogData) {
  try {
    const blog = await prisma.blog.create({
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
            service: true,
          },
        },
      },
    });

    // Invalidiranje cache-a nakon kreiranja
    revalidateTag(CACHE_TAGS.ALL_BLOGS);

    // Invalidiranje cache-a za sve jezike koji su dodani
    data.translations.forEach((translation) => {
      revalidateTag(CACHE_TAGS.BLOGS_BY_LANG(translation.languageCode));
      revalidateTag(
        CACHE_TAGS.BLOG_BY_SLUG(translation.slug, translation.languageCode)
      );
    });

    return { success: true, data: blog };
  } catch (error) {
    console.error("Error creating blog:", error);
    return { success: false, error: "Failed to create blog" };
  }
}

// Dohvaćanje svih blogova sa prijevodima - CACHED
export async function getAllBlogs(
  lang?: "en" | "hr",
  limit?: number
): Promise<BlogWithTranslations[]> {
  return unstable_cache(
    async () => {
      try {
        const blogs = await prisma.blog.findMany({
          include: {
            translations: lang ? { where: { languageCode: lang } } : true,
            services: {
              include: {
                service: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
          take: limit,
        });

        return blogs.map((blog) => ({
          ...blog,
          translations: blog.translations.map((translation) => ({
            ...translation,
            content: deserializeContent(translation.content).data || [],
          })),
        }));
      } catch (error) {
        console.error("Error fetching blogs:", error);
        return [];
      }
    },
    [`all-blogs-${lang || "all"}-${limit || "all"}`],
    {
      tags: [
        CACHE_TAGS.ALL_BLOGS,
        ...(lang ? [CACHE_TAGS.BLOGS_BY_LANG(lang)] : []),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje bloga po ID-u - CACHED
export async function getBlogById(
  id: string,
  lang?: "en" | "hr"
): Promise<BlogWithTranslations | null> {
  return unstable_cache(
    async () => {
      try {
        const blog = await prisma.blog.findUnique({
          where: { id },
          include: {
            translations: lang ? { where: { languageCode: lang } } : true,
            services: {
              include: {
                service: true,
              },
            },
          },
        });

        if (!blog) {
          return null;
        }

        return {
          ...blog,
          translations: blog.translations.map((translation) => ({
            ...translation,
            content: deserializeContent(translation.content).data || [],
          })),
        };
      } catch (error) {
        console.error("Error fetching blog:", error);
        return null;
      }
    },
    [`blog-${id}-${lang || "all"}`],
    {
      tags: [
        CACHE_TAGS.BLOG_BY_ID(id),
        ...(lang ? [CACHE_TAGS.BLOGS_BY_LANG(lang)] : []),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje bloga po slug-u i jeziku - CACHED
export async function getBlogBySlug(
  slug: string,
  languageCode: "en" | "hr"
): Promise<BlogWithTranslations | null> {
  return unstable_cache(
    async () => {
      try {
        const blogTranslation = await prisma.blogTranslation.findUnique({
          where: {
            slug_languageCode: {
              slug,
              languageCode,
            },
          },
          include: {
            blog: {
              include: {
                translations: true,
                services: {
                  include: {
                    service: true,
                  },
                },
              },
            },
          },
        });

        if (!blogTranslation?.blog) {
          return null;
        }

        return {
          ...blogTranslation.blog,
          translations: blogTranslation.blog.translations.map(
            (translation) => ({
              ...translation,
              content: deserializeContent(translation.content).data || [],
            })
          ),
        };
      } catch (error) {
        console.error("Error fetching blog by slug:", error);
        return null;
      }
    },
    [`blog-slug-${slug}-${languageCode}`],
    {
      tags: [
        CACHE_TAGS.BLOG_BY_SLUG(slug, languageCode),
        CACHE_TAGS.BLOGS_BY_LANG(languageCode),
      ],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Ažuriranje bloga
export async function updateBlog(
  id: string,
  data: UpdateBlogData,
  lang?: "en" | "hr"
) {
  try {
    // Dohvati postojeći blog za potrebe cache invalidiranja
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
      include: { translations: true, services: true },
    });

    // Prvo obriši postojeće veze s uslugama
    await prisma.blogService.deleteMany({
      where: { blogId: id },
    });

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        image: data.image,
        order: data.order,
        services: {
          create: data.serviceIds.map((serviceId) => ({
            serviceId,
          })),
        },
      },
      include: {
        translations: lang ? { where: { languageCode: lang } } : true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    // Invalidiranje cache-a nakon ažuriranja
    revalidateTag(CACHE_TAGS.ALL_BLOGS);
    revalidateTag(CACHE_TAGS.BLOG_BY_ID(id));

    // Invalidiranje cache-a za postojeće prijevode
    existingBlog?.translations.forEach((translation) => {
      revalidateTag(CACHE_TAGS.BLOGS_BY_LANG(translation.languageCode));
      revalidateTag(
        CACHE_TAGS.BLOG_BY_SLUG(translation.slug, translation.languageCode)
      );
    });

    return { success: true, data: blog };
  } catch (error) {
    console.error("Error updating blog:", error);
    return { success: false, error: "Failed to update blog" };
  }
}

// Ažuriranje prijevoda bloga
export async function updateBlogTranslation(
  blogId: string,
  languageCode: string,
  data: UpdateBlogTranslationData
) {
  try {
    // Dohvati postojeći prijevod za potrebe cache invalidiranja
    const existingTranslation = await prisma.blogTranslation.findUnique({
      where: {
        blogId_languageCode: {
          blogId,
          languageCode,
        },
      },
    });

    const translation = await prisma.blogTranslation.update({
      where: {
        blogId_languageCode: {
          blogId,
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
    revalidateTag(CACHE_TAGS.ALL_BLOGS);
    revalidateTag(CACHE_TAGS.BLOG_BY_ID(blogId));
    revalidateTag(CACHE_TAGS.BLOGS_BY_LANG(languageCode));

    // Invalidiranje cache-a za stari slug (ako se promijenio)
    if (existingTranslation?.slug && existingTranslation.slug !== data.slug) {
      revalidateTag(
        CACHE_TAGS.BLOG_BY_SLUG(existingTranslation.slug, languageCode)
      );
    }

    // Invalidiranje cache-a za novi slug
    if (data.slug) {
      revalidateTag(CACHE_TAGS.BLOG_BY_SLUG(data.slug, languageCode));
    }

    return { success: true, data: translation };
  } catch (error) {
    console.error("Error updating blog translation:", error);
    return { success: false, error: "Failed to update blog translation" };
  }
}

// Brisanje bloga
export async function deleteBlog(id: string) {
  try {
    // Dohvati blog prije brisanja za potrebe cache invalidiranja
    const blogToDelete = await prisma.blog.findUnique({
      where: { id },
      include: { translations: true },
    });

    await prisma.blog.delete({
      where: { id },
    });

    // Invalidiranje cache-a nakon brisanja
    revalidateTag(CACHE_TAGS.ALL_BLOGS);
    revalidateTag(CACHE_TAGS.BLOG_BY_ID(id));

    // Invalidiranje cache-a za sve prijevode
    blogToDelete?.translations.forEach((translation) => {
      revalidateTag(CACHE_TAGS.BLOGS_BY_LANG(translation.languageCode));
      revalidateTag(
        CACHE_TAGS.BLOG_BY_SLUG(translation.slug, translation.languageCode)
      );
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting blog:", error);
    return { success: false, error: "Failed to delete blog" };
  }
}

// Dodavanje prijevoda postojećem blogu
export async function addBlogTranslation(
  blogId: string,
  languageCode: string,
  translationData: Omit<UpdateBlogTranslationData, "id">
) {
  try {
    const translation = await prisma.blogTranslation.create({
      data: {
        blogId,
        languageCode,
        slug: translationData.slug!,
        title: translationData.title!,
        description: translationData.description,
        shortDescription: translationData.shortDescription,
        keywords: translationData.keywords || [],
        content: serializeContent(translationData.content || []).data || "",
      },
    });

    // Invalidiranje cache-a nakon dodavanja prijevoda
    revalidateTag(CACHE_TAGS.ALL_BLOGS);
    revalidateTag(CACHE_TAGS.BLOG_BY_ID(blogId));
    revalidateTag(CACHE_TAGS.BLOGS_BY_LANG(languageCode));
    revalidateTag(CACHE_TAGS.BLOG_BY_SLUG(translationData.slug!, languageCode));

    return { success: true, data: translation };
  } catch (error) {
    console.error("Error adding blog translation:", error);
    return { success: false, error: "Failed to add blog translation" };
  }
}

// Brisanje prijevoda bloga
export async function deleteBlogTranslation(
  blogId: string,
  languageCode: string
) {
  try {
    // Dohvati prijevod prije brisanja za potrebe cache invalidiranja
    const translationToDelete = await prisma.blogTranslation.findUnique({
      where: {
        blogId_languageCode: {
          blogId,
          languageCode,
        },
      },
    });

    await prisma.blogTranslation.delete({
      where: {
        blogId_languageCode: {
          blogId,
          languageCode,
        },
      },
    });

    // Invalidiranje cache-a nakon brisanja prijevoda
    revalidateTag(CACHE_TAGS.ALL_BLOGS);
    revalidateTag(CACHE_TAGS.BLOG_BY_ID(blogId));
    revalidateTag(CACHE_TAGS.BLOGS_BY_LANG(languageCode));

    if (translationToDelete?.slug) {
      revalidateTag(
        CACHE_TAGS.BLOG_BY_SLUG(translationToDelete.slug, languageCode)
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting blog translation:", error);
    return { success: false, error: "Failed to delete blog translation" };
  }
}
