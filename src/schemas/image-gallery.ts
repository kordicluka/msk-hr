import { z } from "zod";

// Schema za ImageGallery komponentu
export const ImageGallerySchema = z.object({
  images: z
    .array(z.string().min(1, "Slika je obavezna"))
    .length(7, "Trebate dodati točno 7 slika"),
  title: z
    .string()
    .max(200, "Naslov ne može biti duži od 200 karaktera")
    .optional(),
  description: z
    .string()
    .max(500, "Opis ne može biti duži od 500 karaktera")
    .optional(),
});

export type ImageGalleryData = z.infer<typeof ImageGallerySchema>;

// Schema za formu (ista kao glavna schema)
export const ImageGalleryFormSchema = ImageGallerySchema;

export type ImageGalleryFormData = z.infer<typeof ImageGalleryFormSchema>;

// Utility funkcije za validaciju
export const validateImageGalleryData = (data: unknown) => {
  return ImageGallerySchema.safeParse(data);
};

export const validateImageGalleryFormData = (data: unknown) => {
  return ImageGalleryFormSchema.safeParse(data);
};

// Utility funkcija za kreiranje default komponente
export const createDefaultImageGalleryData = (): ImageGalleryData => ({
  images: [
    "/placeholder-image.jpg",
    "/placeholder-image.jpg",
    "/placeholder-image.jpg",
    "/placeholder-image.jpg",
    "/placeholder-image.jpg",
    "/placeholder-image.jpg",
    "/placeholder-image.jpg"
  ],
  title: "Galerija slika",
  description: "Dodajte opis galerije ovdje...",
});