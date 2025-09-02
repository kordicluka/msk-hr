import { z } from "zod";
import { ContentSchema } from "@/schemas/content";

// Schema za prvi korak - osnovne informacije (bez content-a)
export const createServiceTranslationBasicSchema = z.object({
  languageCode: z.string({ message: "Jezik je obavezan." }).min(1),
  slug: z.string({ message: "URL slug je obavezan." }).min(1, {
    message: "URL slug je obavezan.",
  }),
  title: z.string({ message: "Naslov je obavezan." }).min(1, {
    message: "Naslov je obavezan.",
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  content: ContentSchema,
});

// Schema za osnovne informacije - prvi korak
export const createServiceBasicSchema = z.object({
  image: z.string().min(1, { message: "Slika je obavezna." }),
  parentServiceId: z.string().optional(),
  order: z
    .number()
    .int()
    .min(0, { message: "Redoslijed mora biti pozitivan broj." }),
  translations: z.array(createServiceTranslationBasicSchema),
});

// Kompletna schema za finalno stvaranje servisa (s content-om)
export const createServiceTranslationSchema = z.object({
  languageCode: z.string({ message: "Jezik je obavezan." }).min(1),
  slug: z.string({ message: "URL slug je obavezan." }).min(1, {
    message: "URL slug je obavezan.",
  }),
  title: z.string({ message: "Naslov je obavezan." }).min(1, {
    message: "Naslov je obavezan.",
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  content: ContentSchema,
});

export const createServiceSchema = z.object({
  image: z.string().min(1, { message: "Slika je obavezna." }),
  parentServiceId: z.string().optional(),
  order: z
    .number()
    .int()
    .min(0, { message: "Redoslijed mora biti pozitivan broj." }),
  translations: z.array(createServiceTranslationSchema),
});
