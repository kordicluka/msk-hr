import { z } from "zod";
import { NewsletterStatus } from "@/types/newsletter";

export const newsletterSubscribeSchema = z.object({
  email: z
    .string({ message: "Email je obavezan." })
    .email({ message: "Molimo unesite valjan email." }),
});

export const createNewsletterSchema = z.object({
  email: z
    .string({ message: "Email je obavezan." })
    .email({ message: "Molimo unesite valjan email." }),
  status: z.nativeEnum(NewsletterStatus).optional(),
});

export const updateNewsletterSchema = z.object({
  email: z
    .string()
    .email({ message: "Molimo unesite valjan email." })
    .optional(),
  status: z.nativeEnum(NewsletterStatus).optional(),
});
