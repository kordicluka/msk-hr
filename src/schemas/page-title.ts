import { z } from "zod";

// Tip izveden iz schame
export type PageTitleData = z.infer<typeof PageTitleSchema>;

export type PageTitleDataOnly = z.infer<typeof PageTitleDataSchema>;

// Schama za formu (samo potrebni podaci)
export const PageTitleSchema = z.object({
  title: z
    .string()
    .min(1, "Naslov je obavezan")
    .max(200, "Naslov ne može biti duži od 200 karaktera"),
  description: z
    .string()
    .max(500, "Opis ne može biti duži od 500 karaktera")
    .optional(),
  buttonText: z
    .string()
    .max(50, "Tekst dugmeta ne može biti duži od 50 karaktera")
    .optional(),
  theme: z.enum(["default", "primary", "transparent"]).optional(),
  size: z.enum(["sm", "default", "lg", "xl"]).optional(),
  align: z.enum(["left", "center", "right"]).optional(),
  buttonVariant: z
    .enum(["default", "outline", "secondary", "ghost"])
    .optional(),
  href: z
    .string()
    .max(500, "URL ne može biti duži od 500 karaktera")
    .optional(),
});

// Schama za validaciju samo osnovnih podataka
export const PageTitleDataSchema = PageTitleSchema;
