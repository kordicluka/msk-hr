import { z } from "zod";

// Schema za CardSection komponentu
export const CardSectionSchema = z.object({
  title: z
    .string()
    .min(1, "Naslov je obavezan")
    .max(200, "Naslov ne može biti duži od 200 karaktera"),
  description: z
    .string()
    .min(1, "Opis je obavezan")
    .max(1000, "Opis ne može biti duži od 1000 karaktera"),
  image: z
    .string()
    .min(1, "Slika je obavezna")
    .max(500, "URL slike ne može biti duži od 500 karaktera"),
  align: z.enum(["left", "right"]).optional(),
});

export type CardSectionData = z.infer<typeof CardSectionSchema>;

// Schema za formu (ista kao glavna schema)
export const CardSectionFormSchema = CardSectionSchema;

export type CardSectionFormData = z.infer<typeof CardSectionFormSchema>;

// Utility funkcije za validaciju
export const validateCardSectionData = (data: unknown) => {
  return CardSectionSchema.safeParse(data);
};

export const validateCardSectionFormData = (data: unknown) => {
  return CardSectionFormSchema.safeParse(data);
};

// Utility funkcija za kreiranje default komponente
export const createDefaultCardSectionData = (): CardSectionData => ({
  title: "Novi naslov sekcije",
  description: "Dodajte opis sekcije ovdje...",
  image: "/placeholder-image.jpg",
  align: "left",
});