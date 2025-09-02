import { z } from "zod";

// Schema za pojedinačnu karticu
export const ThreeCardsItemSchema = z.object({
  number: z
    .string()
    .min(1, "Broj je obavezan")
    .max(10, "Broj ne može biti duži od 10 karaktera"),
  title: z
    .string()
    .min(1, "Naslov je obavezan")
    .max(100, "Naslov ne može biti duži od 100 karaktera"),
  description: z
    .string()
    .min(1, "Opis je obavezan")
    .max(500, "Opis ne može biti duži od 500 karaktera"),
  image: z
    .string()
    .min(1, "Slika je obavezna")
    .max(500, "URL slike ne može biti duži od 500 karaktera"),
});

export type ThreeCardsItemData = z.infer<typeof ThreeCardsItemSchema>;

// Schema za ThreeCardsMovingOnHover komponentu
export const ThreeCardsMovingOnHoverSchema = z.object({
  title: z
    .string()
    .max(200, "Naslov ne može biti duži od 200 karaktera")
    .optional(),
  description: z
    .string()
    .max(500, "Opis ne može biti duži od 500 karaktera")
    .optional(),
  items: z
    .array(ThreeCardsItemSchema)
    .min(3, "Morate dodati tačno 3 kartice")
    .max(3, "Možete dodati maksimalno 3 kartice"),
});

export type ThreeCardsMovingOnHoverData = z.infer<typeof ThreeCardsMovingOnHoverSchema>;

// Schema za formu (ista kao glavna schema)
export const ThreeCardsMovingOnHoverFormSchema = ThreeCardsMovingOnHoverSchema;

export type ThreeCardsMovingOnHoverFormData = z.infer<typeof ThreeCardsMovingOnHoverFormSchema>;

// Utility funkcije za validaciju
export const validateThreeCardsMovingOnHoverData = (data: unknown) => {
  return ThreeCardsMovingOnHoverSchema.safeParse(data);
};

export const validateThreeCardsMovingOnHoverFormData = (data: unknown) => {
  return ThreeCardsMovingOnHoverFormSchema.safeParse(data);
};

// Utility funkcija za kreiranje default komponente
export const createDefaultThreeCardsMovingOnHoverData = (): ThreeCardsMovingOnHoverData => ({
  title: "Tri kartice sa hover efektom",
  description: "Dodajte opis sekcije ovdje...",
  items: [
    {
      number: "01",
      title: "Prva kartica",
      description: "Opis prve kartice...",
      image: "/placeholder-image.jpg",
    },
    {
      number: "02",
      title: "Druga kartica",
      description: "Opis druge kartice...",
      image: "/placeholder-image.jpg",
    },
    {
      number: "03",
      title: "Treća kartica",
      description: "Opis treće kartice...",
      image: "/placeholder-image.jpg",
    },
  ],
});