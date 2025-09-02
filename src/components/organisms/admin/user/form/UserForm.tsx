"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  updateUserSchema,
} from "@/schemas/user";
import type {
  CreateUserData,
  UpdateUserData,
  User,
} from "@/types/user";
import { createUser, updateUser } from "@/actions/UserActions";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormItemsContainer,
  FormLabelText,
} from "@/components/atoms/admin/form";
import { Button } from "@/components/atoms/admin/button";

export function UserForm({
  user,
}: {
  user?: User | null;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Provjeri da li je u edit modu
  const isEditMode = !!user;

  const methods = useForm<CreateUserData | UpdateUserData>({
    resolver: zodResolver(
      isEditMode ? updateUserSchema : createUserSchema
    ),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      image: user?.image || "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      let result;

      if (isEditMode && user) {
        // Update postojećeg korisnika
        result = await updateUser(
          user.id,
          data as UpdateUserData
        );
      } else {
        // Kreiranje novog korisnika
        result = await createUser(data as CreateUserData);
      }

      if (result.success) {
        console.log(
          `User ${isEditMode ? "updated" : "created"} successfully:`,
          result.data
        );

        // U edit modu ne resetiramo formu
        if (!isEditMode) {
          methods.reset({
            name: "",
            email: "",
            password: "",
            image: "",
          });
        }
      } else {
        console.error(
          `Error ${isEditMode ? "updating" : "creating"} user:`,
          result.error
        );
        // Prikaži greška u UI-u
        methods.setError("email", {
          type: "manual",
          message: result.error,
        });
      }
    } catch (error) {
      console.error("Error processing user:", error);
      methods.setError("email", {
        type: "manual",
        message: "Greška pri obradi zahtjeva.",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditMode
              ? "Uređivanje korisnika"
              : "Novi korisnik"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? "Uredite podatke korisnika."
              : "Dodajte novog korisnika."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItemsContainer>
                <FormLabel className="mx-4">Ime</FormLabel>
                <FormLabelText className="mx-4 mb-2">
                  Unesite ime korisnika.
                </FormLabelText>
                <FormItem className="w-full">
                  <FormControl>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  {methods.formState.errors.name && (
                    <FormMessage className="text-red-500 text-xs my-3 mx-4">
                      {methods.formState.errors.name.message}
                    </FormMessage>
                  )}
                </FormItem>
              </FormItemsContainer>
            )}
          />

          {/* Email Field */}
          <FormField
            control={methods.control}
            name="email"
            render={({ field }) => (
              <FormItemsContainer>
                <FormLabel className="mx-4">Email adresa</FormLabel>
                <FormLabelText className="mx-4 mb-2">
                  Unesite email adresu korisnika.
                </FormLabelText>
                <FormItem className="w-full">
                  <FormControl>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  {methods.formState.errors.email && (
                    <FormMessage className="text-red-500 text-xs my-3 mx-4">
                      {methods.formState.errors.email.message}
                    </FormMessage>
                  )}
                </FormItem>
              </FormItemsContainer>
            )}
          />

          {/* Password Field */}
          <FormField
            control={methods.control}
            name="password"
            render={({ field }) => (
              <FormItemsContainer>
                <FormLabel className="mx-4">
                  {isEditMode ? "Nova lozinka (neobavezno)" : "Lozinka"}
                </FormLabel>
                <FormLabelText className="mx-4 mb-2">
                  {isEditMode
                    ? "Ostavite prazno ako ne želite mijenjati lozinku."
                    : "Unesite lozinku korisnika."}
                </FormLabelText>
                <FormItem className="w-full">
                  <FormControl>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  {methods.formState.errors.password && (
                    <FormMessage className="text-red-500 text-xs my-3 mx-4">
                      {methods.formState.errors.password.message}
                    </FormMessage>
                  )}
                </FormItem>
              </FormItemsContainer>
            )}
          />

          {/* Image Field */}
          <FormField
            control={methods.control}
            name="image"
            render={({ field }) => (
              <FormItemsContainer>
                <FormLabel className="mx-4">Slika (neobavezno)</FormLabel>
                <FormLabelText className="mx-4 mb-2">
                  Unesite URL slike korisnika.
                </FormLabelText>
                <FormItem className="w-full">
                  <FormControl>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={field.value || ""}
                      onChange={field.onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  {methods.formState.errors.image && (
                    <FormMessage className="text-red-500 text-xs my-3 mx-4">
                      {methods.formState.errors.image.message}
                    </FormMessage>
                  )}
                </FormItem>
              </FormItemsContainer>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting
                ? isEditMode
                  ? "Ažuriranje..."
                  : "Kreiranje..."
                : isEditMode
                ? "Ažuriraj korisnika"
                : "Kreiraj korisnika"}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}