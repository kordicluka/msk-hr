"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createNewsletterSchema,
  updateNewsletterSchema,
} from "@/schemas/newsletter";
import type {
  CreateNewsletterData,
  UpdateNewsletterData,
  Newsletter,
} from "@/types/newsletter";
import { NewsletterStatus } from "@/types/newsletter";
import { createNewsletter, updateNewsletter } from "@/actions/NewsletterAction";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormItemsContainer,
  FormLabelText,
} from "@/components/atoms/admin/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/admin/select";
import { Button } from "@/components/atoms/admin/button";

export function NewsletterForm({
  newsletter,
}: {
  newsletter?: Newsletter | null;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Provjeri da li je u edit modu
  const isEditMode = !!newsletter;

  const methods = useForm<CreateNewsletterData | UpdateNewsletterData>({
    resolver: zodResolver(
      isEditMode ? updateNewsletterSchema : createNewsletterSchema
    ),
    defaultValues: {
      email: newsletter?.email || "",
      status: newsletter?.status || NewsletterStatus.SUBSCRIBED,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      let result;

      if (isEditMode && newsletter) {
        // Update postojeće newsletter pretplate
        result = await updateNewsletter(
          newsletter.id,
          data as UpdateNewsletterData
        );
      } else {
        // Kreiranje nove newsletter pretplate
        result = await createNewsletter(data as CreateNewsletterData);
      }

      if (result.success) {
        console.log(
          `Newsletter ${isEditMode ? "updated" : "created"} successfully:`,
          result.data
        );

        // U edit modu ne resetiramo formu
        if (!isEditMode) {
          methods.reset({
            email: "",
            status: NewsletterStatus.SUBSCRIBED,
          });
        }
      } else {
        console.error(
          `Error ${isEditMode ? "updating" : "creating"} newsletter:`,
          result.error
        );
        // Prikaži greška u UI-u
        methods.setError("email", {
          type: "manual",
          message: result.error,
        });
      }
    } catch (error) {
      console.error("Error processing newsletter:", error);
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
              ? "Uređivanje newsletter pretplate"
              : "Nova newsletter pretplata"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? "Uredite podatke newsletter pretplate."
              : "Dodajte novu newsletter pretplatu."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Email Field */}
          <FormField
            control={methods.control}
            name="email"
            render={({ field }) => (
              <FormItemsContainer>
                <FormLabel className="mx-4">Email adresa</FormLabel>
                <FormLabelText className="mx-4 mb-2">
                  Unesite email adresu pretplatnika.
                </FormLabelText>
                <FormItem className="w-full">
                  <FormControl>
                    <input
                      type="email"
                      placeholder="ime@example.com"
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

          {/* Status Selection */}
          <FormField
            control={methods.control}
            name="status"
            render={({ field }) => (
              <FormItemsContainer>
                <FormLabel className="mx-4">Status</FormLabel>
                <FormLabelText className="mx-4 mb-2">
                  Odaberite status newsletter pretplate.
                </FormLabelText>
                <FormItem className="w-full">
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value as NewsletterStatus)
                    }
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full rounded-none border-none">
                        <SelectValue placeholder="Odaberite status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-none">
                      <SelectItem value={NewsletterStatus.SUBSCRIBED}>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                            ●
                          </span>
                          Pretplaćen
                        </div>
                      </SelectItem>
                      <SelectItem value={NewsletterStatus.UNSUBSCRIBED}>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                            ●
                          </span>
                          Odjavljen
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {methods.formState.errors.status && (
                    <FormMessage className="text-red-500 text-xs my-3 mx-4">
                      {methods.formState.errors.status.message}
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
                ? "Ažuriraj pretplatu"
                : "Kreiraj pretplatu"}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
