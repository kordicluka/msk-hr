import { z } from "zod";

// Schema za CTA komponentu
export const CTASchema = z.object({
  title: z
    .string()
    .min(1, "Naslov je obavezan")
    .max(200, "Naslov ne može biti duži od 200 karaktera"),
  description: z
    .string()
    .min(1, "Opis je obavezan")
    .max(500, "Opis ne može biti duži od 500 karaktera"),
  buttonText: z
    .string()
    .min(1, "Tekst dugmeta je obavezan")
    .max(50, "Tekst dugmeta ne može biti duži od 50 karaktera"),
  image: z
    .string()
    .max(500, "URL slike ne može biti duži od 500 karaktera")
    .optional(),
});

export type CTAData = z.infer<typeof CTASchema>;

// Schema za formu (sa dodatnim validacijama za multilingual podrsku)
export const CTAFormSchema = z.object({
  title: z
    .string()
    .min(1, "Naslov je obavezan")
    .max(200, "Naslov ne može biti duži od 200 karaktera"),
  description: z
    .string()
    .min(1, "Opis je obavezan")
    .max(500, "Opis ne može biti duži od 500 karaktera"),
  buttonText: z
    .string()
    .min(1, "Tekst dugmeta je obavezan")
    .max(50, "Tekst dugmeta ne može biti duži od 50 karaktera"),
  image: z
    .string()
    .max(500, "URL slike ne može biti duži od 500 karaktera")
    .optional(),
});

export type CTAFormData = z.infer<typeof CTAFormSchema>;

// Utility funkcije za validaciju
export const validateCTAData = (data: unknown) => {
  return CTASchema.safeParse(data);
};

export const validateCTAFormData = (data: unknown) => {
  return CTAFormSchema.safeParse(data);
};

// Utility funkcija za kreiranje default CTA komponente
export const createDefaultCTAData = (): CTAData => ({
  title: "Pozovite nas danas",
  description: "Kontaktirajte nas za besplatnu konsultaciju i saznajte kako možemo pomoći vašem biznisu da raste.",
  buttonText: "Kontaktiraj nas",
  image: "/services/software-development/software-development-2.jpeg",
});