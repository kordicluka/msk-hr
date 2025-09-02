import { z } from "zod";

// Schema za SingleImage komponentu
export const SingleImageSchema = z.object({
  image: z
    .string()
    .min(1, "Slika je obavezna")
    .max(500, "URL slike ne može biti duži od 500 karaktera"),
  title: z
    .string()
    .max(200, "Naslov ne može biti duži od 200 karaktera")
    .optional(),
  description: z
    .string()
    .max(500, "Opis ne može biti duži od 500 karaktera")
    .optional(),
});

export type SingleImageData = z.infer<typeof SingleImageSchema>;

// Schema za formu (ista kao glavna schema)
export const SingleImageFormSchema = SingleImageSchema;

export type SingleImageFormData = z.infer<typeof SingleImageFormSchema>;

// Utility funkcije za validaciju
export const validateSingleImageData = (data: unknown) => {
  return SingleImageSchema.safeParse(data);
};

export const validateSingleImageFormData = (data: unknown) => {
  return SingleImageFormSchema.safeParse(data);
};

// Utility funkcija za kreiranje default komponente
export const createDefaultSingleImageData = (): SingleImageData => ({
  image: "/placeholder-image.jpg",
  title: "Slika",
  description: "Dodajte opis slike ovdje...",
});