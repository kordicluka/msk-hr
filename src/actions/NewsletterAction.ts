"use server";

import type {
  CreateNewsletterData,
  UpdateNewsletterData,
  Newsletter,
  NewsletterSubscribeData,
  NewsletterStatus,
} from "@/types/newsletter";
import { revalidateTag, unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { newsletterSubscribeSchema } from "@/schemas/newsletter";

// Cache tagovi za različite scenarije
const CACHE_TAGS = {
  ALL_NEWSLETTERS: "newsletters:all",
  NEWSLETTER_BY_ID: (id: string) => `newsletter:${id}`,
  NEWSLETTER_BY_EMAIL: (email: string) => `newsletter:email:${email}`,
} as const;

// Subscribiranje na newsletter (public funkcija)
export async function subscribeToNewsletter(data: NewsletterSubscribeData) {
  try {
    // Validacija
    const result = newsletterSubscribeSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: "Molimo unesite valjan email.",
      };
    }

    // Provjeri postoji li već email
    const existingNewsletter = await prisma.newsletter.findUnique({
      where: { email: data.email },
    });

    if (existingNewsletter) {
      // Ako je odjavljeni, ponovno ih pretplati
      if (existingNewsletter.status === "UNSUBSCRIBED") {
        const updated = await prisma.newsletter.update({
          where: { email: data.email },
          data: { status: "SUBSCRIBED" },
        });

        // Invalidiranje cache-a
        revalidateTag(CACHE_TAGS.ALL_NEWSLETTERS);
        revalidateTag(CACHE_TAGS.NEWSLETTER_BY_ID(updated.id));
        revalidateTag(CACHE_TAGS.NEWSLETTER_BY_EMAIL(data.email));

        return {
          success: true,
          message: "Uspješno ste se ponovno pretplatili na newsletter!",
          data: updated,
        };
      } else {
        return {
          success: false,
          error: "Već ste pretplaćeni na newsletter.",
        };
      }
    }

    // Stvori novi newsletter subscription
    const newsletter = await prisma.newsletter.create({
      data: {
        email: data.email,
        status: "SUBSCRIBED",
      },
    });

    // Invalidiranje cache-a
    revalidateTag(CACHE_TAGS.ALL_NEWSLETTERS);
    revalidateTag(CACHE_TAGS.NEWSLETTER_BY_EMAIL(data.email));

    return {
      success: true,
      message: "Uspješno ste se pretplatili na newsletter!",
      data: newsletter,
    };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return {
      success: false,
      error: "Greška pri pretplati na newsletter. Molimo pokušajte ponovo.",
    };
  }
}

// Odjavljavanje s newslettera (public funkcija)
export async function unsubscribeFromNewsletter(email: string) {
  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!newsletter) {
      return {
        success: false,
        error: "Email nije pronađen u našoj bazi.",
      };
    }

    const updated = await prisma.newsletter.update({
      where: { email },
      data: { status: "UNSUBSCRIBED" },
    });

    // Invalidiranje cache-a
    revalidateTag(CACHE_TAGS.ALL_NEWSLETTERS);
    revalidateTag(CACHE_TAGS.NEWSLETTER_BY_ID(updated.id));
    revalidateTag(CACHE_TAGS.NEWSLETTER_BY_EMAIL(email));

    return {
      success: true,
      message: "Uspješno ste se odjavili s newslettera.",
      data: updated,
    };
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    return {
      success: false,
      error: "Greška pri odjavi s newslettera.",
    };
  }
}

// Kreiranje newsletter-a (admin funkcija)
export async function createNewsletter(data: CreateNewsletterData) {
  try {
    const newsletter = await prisma.newsletter.create({
      data: {
        email: data.email,
        status: data.status || "SUBSCRIBED",
      },
    });

    // Invalidiranje cache-a
    revalidateTag(CACHE_TAGS.ALL_NEWSLETTERS);
    revalidateTag(CACHE_TAGS.NEWSLETTER_BY_EMAIL(data.email));

    return { success: true, data: newsletter };
  } catch (error) {
    console.error("Error creating newsletter:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Email već postoji u bazi." };
    }
    return {
      success: false,
      error: "Failed to create newsletter subscription",
    };
  }
}

// Dohvaćanje svih newsletter pretplata - CACHED
export async function getAllNewsletters(): Promise<Newsletter[]> {
  return unstable_cache(
    async () => {
      try {
        const newsletters = await prisma.newsletter.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });

        return newsletters.map((newsletter) => ({
          ...newsletter,
          status: newsletter.status as Newsletter["status"],
        }));
      } catch (error) {
        console.error("Error fetching newsletters:", error);
        return [];
      }
    },
    ["all-newsletters"],
    {
      tags: [CACHE_TAGS.ALL_NEWSLETTERS],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje newsletter pretplate po ID-u - CACHED
export async function getNewsletterById(
  id: string
): Promise<Newsletter | null> {
  return unstable_cache(
    async () => {
      try {
        const newsletter = await prisma.newsletter.findUnique({
          where: { id },
        });

        return newsletter
          ? {
              ...newsletter,
              status: newsletter.status as Newsletter["status"],
            }
          : null;
      } catch (error) {
        console.error("Error fetching newsletter:", error);
        return null;
      }
    },
    [`newsletter-${id}`],
    {
      tags: [CACHE_TAGS.NEWSLETTER_BY_ID(id)],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje newsletter pretplate po email-u - CACHED
export async function getNewsletterByEmail(
  email: string
): Promise<Newsletter | null> {
  return unstable_cache(
    async () => {
      try {
        const newsletter = await prisma.newsletter.findUnique({
          where: { email },
        });

        return newsletter
          ? {
              ...newsletter,
              status: newsletter.status as Newsletter["status"],
            }
          : null;
      } catch (error) {
        console.error("Error fetching newsletter by email:", error);
        return null;
      }
    },
    [`newsletter-email-${email}`],
    {
      tags: [CACHE_TAGS.NEWSLETTER_BY_EMAIL(email)],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Ažuriranje newsletter pretplate
export async function updateNewsletter(id: string, data: UpdateNewsletterData) {
  try {
    const newsletter = await prisma.newsletter.update({
      where: { id },
      data,
    });

    // Invalidiranje cache-a
    revalidateTag(CACHE_TAGS.ALL_NEWSLETTERS);
    revalidateTag(CACHE_TAGS.NEWSLETTER_BY_ID(id));
    if (data.email) {
      revalidateTag(CACHE_TAGS.NEWSLETTER_BY_EMAIL(data.email));
    }

    return { success: true, data: newsletter };
  } catch (error) {
    console.error("Error updating newsletter:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Email već postoji u bazi." };
    }
    return {
      success: false,
      error: "Failed to update newsletter subscription",
    };
  }
}

// Brisanje newsletter pretplate
export async function deleteNewsletter(id: string) {
  try {
    const newsletterToDelete = await prisma.newsletter.findUnique({
      where: { id },
    });

    await prisma.newsletter.delete({
      where: { id },
    });

    // Invalidiranje cache-a
    revalidateTag(CACHE_TAGS.ALL_NEWSLETTERS);
    revalidateTag(CACHE_TAGS.NEWSLETTER_BY_ID(id));
    if (newsletterToDelete?.email) {
      revalidateTag(CACHE_TAGS.NEWSLETTER_BY_EMAIL(newsletterToDelete.email));
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting newsletter:", error);
    return {
      success: false,
      error: "Failed to delete newsletter subscription",
    };
  }
}

// Dobivanje statistika za admin - CACHED
export async function getNewsletterStats() {
  return unstable_cache(
    async () => {
      try {
        const [total, subscribed, unsubscribed] = await Promise.all([
          prisma.newsletter.count(),
          prisma.newsletter.count({
            where: { status: "SUBSCRIBED" },
          }),
          prisma.newsletter.count({
            where: { status: "UNSUBSCRIBED" },
          }),
        ]);

        return {
          success: true,
          data: {
            total,
            subscribed,
            unsubscribed,
            subscriptionRate: total > 0 ? (subscribed / total) * 100 : 0,
          },
        };
      } catch (error) {
        console.error("Error fetching newsletter stats:", error);
        return {
          success: false,
          error: "Failed to fetch newsletter statistics",
        };
      }
    },
    ["newsletter-stats"],
    {
      tags: [CACHE_TAGS.ALL_NEWSLETTERS],
      revalidate: 1800, // 30 minutes for stats
    }
  )();
}

export async function hardCodeNewsletters() {
  try {
    const testEmails = [
      {
        email: "john.doe@example.com",
        status: "SUBSCRIBED" as NewsletterStatus,
      },
      {
        email: "jane.smith@example.com",
        status: "SUBSCRIBED" as NewsletterStatus,
      },
      {
        email: "unsubscribed@example.com",
        status: "UNSUBSCRIBED" as NewsletterStatus,
      },
      { email: "admin@msk.hr", status: "SUBSCRIBED" as NewsletterStatus },
      {
        email: "info@testcompany.com",
        status: "SUBSCRIBED" as NewsletterStatus,
      },
    ];

    for (const emailData of testEmails) {
      await createNewsletter(emailData);
    }

    console.log("Hard-coded newsletter subscriptions created successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error creating hard-coded newsletters:", error);
    return { success: false, error: "Failed to create hard-coded newsletters" };
  }
}
