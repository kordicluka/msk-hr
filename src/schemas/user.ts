import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({ message: "Ime je obavezno." })
    .min(1, { message: "Ime ne može biti prazno." }),
  email: z
    .string({ message: "Email je obavezan." })
    .email({ message: "Molimo unesite valjan email." }),
  password: z
    .string({ message: "Lozinka je obavezna." })
    .min(6, { message: "Lozinka mora imati najmanje 6 znakova." }),
  image: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Ime ne može biti prazno." })
    .optional(),
  email: z
    .string()
    .email({ message: "Molimo unesite valjan email." })
    .optional(),
  password: z
    .string()
    .min(6, { message: "Lozinka mora imati najmanje 6 znakova." })
    .optional(),
  image: z.string().optional(),
});