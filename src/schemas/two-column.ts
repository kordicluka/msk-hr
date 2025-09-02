import { z } from "zod";

// Schema za TwoColumn komponentu
export const TwoColumnSchema = z.object({
  image: z
    .string()
    .min(1, "Slika je obavezna")
    .max(500, "URL slike ne može biti duži od 500 karaktera"),
  title: z
    .string()
    .min(1, "Naslov je obavezan")
    .max(200, "Naslov ne može biti duži od 200 karaktera"),
  paragraph: z
    .string()
    .min(1, "Paragraf je obavezan")
    .max(1000, "Paragraf ne može biti duži od 1000 karaktera"),
  theme: z.enum(["light", "dark"]).optional(),
  reverse: z.boolean().optional(),
  // Optional button fields
  buttonText: z.string().optional(),
  buttonVariant: z.enum(["default", "outline", "secondary", "ghost"]).optional(),
  href: z.string().optional(),
});

export type TwoColumnData = z.infer<typeof TwoColumnSchema>;

// Schema za formu (ista kao glavna schema)
export const TwoColumnFormSchema = TwoColumnSchema;

export type TwoColumnFormData = z.infer<typeof TwoColumnFormSchema>;

// Utility funkcije za validaciju
export const validateTwoColumnData = (data: unknown) => {
  return TwoColumnSchema.safeParse(data);
};

export const validateTwoColumnFormData = (data: unknown) => {
  return TwoColumnFormSchema.safeParse(data);
};

// Utility funkcija za kreiranje default komponente
export const createDefaultTwoColumnData = (): TwoColumnData => ({
  image: "/placeholder-image.jpg",
  title: "Novi naslov",
  paragraph: "Dodajte paragraf ovdje...",
  theme: "light",
  reverse: false,
  buttonText: "",
  buttonVariant: "default",
  href: "",
});