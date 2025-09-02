import { z } from "zod";

// Schema za pojedinačnu stavku slide-a
export const StickyScrollableSlidesItemSchema = z.object({
  id: z.number().int().positive(),
  title: z
    .string()
    .min(1, "Naslov je obavezan")
    .max(200, "Naslov ne može biti duži od 200 karaktera"),
  description: z
    .string()
    .min(1, "Opis je obavezan")
    .max(1000, "Opis ne može biti duži od 1000 karaktera"),
  link: z
    .string()
    .max(500, "Link ne može biti duži od 500 karaktera")
    .optional(),
  image: z
    .string()
    .min(1, "Slika je obavezna")
    .max(500, "URL slike ne može biti duži od 500 karaktera"),
});

export type StickyScrollableSlidesItem = z.infer<
  typeof StickyScrollableSlidesItemSchema
>;

// Schema za celu komponentu
export const StickyScrollableSlidesSchema = z.object({
  rowReverse: z.boolean().default(false).optional(),
  items: z
    .array(StickyScrollableSlidesItemSchema)
    .min(1, "Potrebna je najmanje jedna stavka")
    .max(20, "Maksimalno 20 stavki"),
});

export type StickyScrollableSlidesData = z.infer<
  typeof StickyScrollableSlidesSchema
>;

// Schema za formu (sa dodatnim validacijama za multilingual podrsku)
export const StickyScrollableSlidesFormSchema = z.object({
  rowReverse: z.boolean().optional(),
  items: z
    .array(StickyScrollableSlidesItemSchema)
    .min(1, "Potrebna je najmanje jedna stavka")
    .max(20, "Maksimalno 20 stavki"),
});

export type StickyScrollableSlidesFormData = z.infer<
  typeof StickyScrollableSlidesFormSchema
>;

// Utility funkcije za validaciju
export const validateStickyScrollableSlidesData = (data: unknown) => {
  return StickyScrollableSlidesSchema.safeParse(data);
};

export const validateStickyScrollableSlidesFormData = (data: unknown) => {
  return StickyScrollableSlidesFormSchema.safeParse(data);
};

// Utility funkcija za kreiranje nove stavke sa default vrijednostima
export const createDefaultStickyScrollableSlidesItem = (
  id: number
): StickyScrollableSlidesItem => ({
  id,
  title: "Nova stavka",
  description: "Dodajte opis ovdje...",
  link: "",
  image: "/placeholder.png",
});

// Utility funkcija za kreiranje default komponente
export const createDefaultStickyScrollableSlidesData =
  (): StickyScrollableSlidesData => ({
    rowReverse: false,
    items: [
      createDefaultStickyScrollableSlidesItem(1),
      createDefaultStickyScrollableSlidesItem(2),
    ],
  });
