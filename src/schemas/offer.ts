import { z } from "zod";
import { ContentSchema } from "./content";

// Schema za osnovni prijevod ponude
export const createOfferTranslationBasicSchema = z.object({
  languageCode: z.string({ message: "Jezik je obavezan." }).min(1),
  slug: z.string({ message: "URL slug je obavezan." }).min(1, {
    message: "URL slug je obavezan.",
  }),
  title: z.string({ message: "Naslov je obavezan." }).min(1, {
    message: "Naslov je obavezan.",
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  content: ContentSchema,
});

// Schema za osnovne informacije ponude - prvi korak
export const createOfferBasicSchema = z.object({
  priceFrom: z.string().min(1, { message: "Početna cijena je obavezna." }),
  priceTo: z.string().min(1, { message: "Konačna cijena je obavezna." }),
  icon: z.string().min(1, { message: "Ikona je obavezna." }),
  order: z
    .number()
    .int()
    .min(0, { message: "Redoslijed mora biti pozitivan broj." }),
  serviceIds: z.array(z.string()).optional().default([]),
  translations: z.array(createOfferTranslationBasicSchema),
});

// Kompletna schema za kreiranje ponude
export const createOfferTranslationSchema = z.object({
  languageCode: z.string({ message: "Jezik je obavezan." }).min(1),
  slug: z.string({ message: "URL slug je obavezan." }).min(1, {
    message: "URL slug je obavezan.",
  }),
  title: z.string({ message: "Naslov je obavezan." }).min(1, {
    message: "Naslov je obavezan.",
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  content: ContentSchema,
});

export const createOfferSchema = z.object({
  priceFrom: z.string().min(1, { message: "Početna cijena je obavezna." }),
  priceTo: z.string().min(1, { message: "Konačna cijena je obavezna." }),
  icon: z.string().min(1, { message: "Ikona je obavezna." }),
  order: z
    .number()
    .int()
    .min(0, { message: "Redoslijed mora biti pozitivan broj." }),
  serviceIds: z.array(z.string()).optional().default([]),
  translations: z.array(createOfferTranslationSchema),
});
