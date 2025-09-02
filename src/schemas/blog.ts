import { z } from "zod";
import { ContentSchema } from "./content";

// Schema za prvi korak - osnovne informacije (bez content-a)
export const createBlogTranslationBasicSchema = z.object({
  languageCode: z.string({ message: "Jezik je obavezan." }).min(1),
  slug: z.string({ message: "URL slug je obavezan." }).min(1, {
    message: "URL slug je obavezan.",
  }),
  title: z.string({ message: "Naslov je obavezan." }).min(1, {
    message: "Naslov je obavezan.",
  }),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  content: ContentSchema,
});

// Schema za osnovne informacije - prvi korak
export const createBlogBasicSchema = z.object({
  image: z.string().min(1, { message: "Slika je obavezna." }),
  order: z
    .number()
    .int()
    .min(0, { message: "Redoslijed mora biti pozitivan broj." }),
  serviceIds: z.array(z.string()).optional().default([]),
  translations: z.array(createBlogTranslationBasicSchema),
});

// Kompletna schema za finalno stvaranje bloga (s content-om)
export const createBlogTranslationSchema = z.object({
  languageCode: z.string({ message: "Jezik je obavezan." }).min(1),
  slug: z.string({ message: "URL slug je obavezan." }).min(1, {
    message: "URL slug je obavezan.",
  }),
  title: z.string({ message: "Naslov je obavezan." }).min(1, {
    message: "Naslov je obavezan.",
  }),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  content: ContentSchema,
});

export const createBlogSchema = z.object({
  image: z.string().min(1, { message: "Slika je obavezna." }),
  order: z
    .number()
    .int()
    .min(0, { message: "Redoslijed mora biti pozitivan broj." }),
  serviceIds: z.array(z.string()).optional().default([]),
  translations: z.array(createBlogTranslationSchema),
});
