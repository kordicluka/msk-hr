"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { createOfferSchema, createOfferBasicSchema } from "@/schemas/offer";
import type {
  CreateOfferData,
  CreateOfferTranslationData,
  OfferWithTranslations,
} from "@/types/offer";
import type { ServiceWithTranslations } from "@/types/service";
import {
  createOffer,
  updateOffer,
  updateOfferTranslation,
} from "@/actions/OfferAction";
import MultiLanguageInput from "@/components/composites/admin/MultiLanguageInput.tsx";
import MultiLanguageArrayInput from "@/components/composites/admin/MultiLanguageArrayInput";
import ImageUpload from "@/components/organisms/ImageUpload";
import { locales } from "@/lib/locale";
import { generateSlug } from "@/lib/slug";
import {
  MultiStepForm,
  FormStep,
} from "@/components/atoms/admin/multi-step-form";
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
  ContentEditor,
  type MultiLanguageContent,
  type Language,
} from "@/components/organisms/content/editor";

export function OfferForm({
  services,
  offer,
}: {
  services: ServiceWithTranslations[];
  offer?: OfferWithTranslations | null;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<{ [key: number]: boolean }>({});
  const [slugErrors, setSlugErrors] = useState<Record<string, string>>({});

  // Content editor configuration
  const contentLanguages: Language[] = [
    { code: "hr", name: "Croatian", flag: "🇭🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
  ];

  // Provjeri da li je u edit modu
  const isEditMode = !!offer;

  const methods = useForm<CreateOfferData>({
    // Bez resolver-a - manual validacija po koracima
    defaultValues: {
      priceFrom: offer?.priceFrom || "",
      priceTo: offer?.priceTo || "",
      icon: offer?.icon || "",
      order: offer?.order || 0,
      serviceIds: offer?.services?.map((s) => s.serviceId) || [],
      translations: locales.map((locale) => {
        const existingTranslation = offer?.translations?.find(
          (t) => t.languageCode === locale
        );
        return {
          languageCode: locale,
          slug: existingTranslation?.slug || "",
          title: existingTranslation?.title || "",
          subtitle: existingTranslation?.subtitle || "",
          description: existingTranslation?.description || "",
          keywords: existingTranslation?.keywords || [],
          content: existingTranslation?.content || [],
        };
      }),
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Funkcija za provjeru postoji li već slug
  const checkSlugExists =
    (/* slug: string, languageCode: string */): boolean => {
      // Trebamo dohvatiti sve postojeće ponude da provjerimo slug
      // Za sada vraćamo false, ali trebalo bi implementirati pravu provjeru
      return false;
    };

  // Validacija slug-ova
  const validateSlugs = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    locales.forEach((locale, index) => {
      const slug = methods.watch(`translations.${index}.slug`);
      const title = methods.watch(`translations.${index}.title`);

      if (title && slug) {
        // U edit modu, provjeri da li je slug promijenjen od originalnog
        if (isEditMode && offer) {
          const originalTranslation = offer.translations?.find(
            (t) => t.languageCode === locale
          );
          // Ako je slug isti kao originalni, ne provjeri duplikate
          if (originalTranslation && originalTranslation.slug === slug) {
            return; // Preskoči validaciju za nepromijenjen slug
          }
        }

        if (checkSlugExists(/* slug, locale */)) {
          errors[
            locale
          ] = `Ponuda s URL-om "${slug}" već postoji za ${locale.toUpperCase()} jezik`;
        }
      }
    });

    return errors;
  };

  const setFieldValue = (
    field: keyof CreateOfferTranslationData,
    lang: (typeof locales)[number],
    value: string
  ) => {
    const langIndex = locales.indexOf(lang);
    methods.setValue(`translations.${langIndex}.${field}`, value, {
      shouldValidate: false, // Ne validiramo automatski
    });

    // Automatska generacija slug-a iz naslova
    if (field === "title" && value) {
      const slug = generateSlug(value);
      methods.setValue(`translations.${langIndex}.slug`, slug, {
        shouldValidate: false,
      });

      // Provjeri slug konflikt u real-time
      const newSlugErrors = validateSlugs();
      setSlugErrors(newSlugErrors);
    }

    // Očisti greške za trenutni korak nakon promjene
    setStepErrors((prev) => ({ ...prev, 0: false }));
  };

  // Dobivanje trenutnih vrijednosti za prikaz - string polja
  const getCurrentStringValues = (
    field: Exclude<keyof CreateOfferTranslationData, "content" | "keywords">
  ) => {
    return locales.reduce((acc, locale, index) => {
      const value = methods.watch(`translations.${index}.${field}`);
      acc[locale] = value || "";
      return acc;
    }, {} as Record<string, string>);
  };

  // Dobivanje trenutnih vrijednosti za content polje
  const getCurrentContentValues = () => {
    return locales.reduce((acc, locale, index) => {
      const value = methods.watch(`translations.${index}.content`);
      acc[locale] = value || [];
      return acc;
    }, {} as Record<string, import("@/types/content").Content>);
  };

  // Dobivanje trenutnih vrijednosti za keywords kao string[]
  const getCurrentKeywordArrayValues = () => {
    return locales.reduce((acc, locale, index) => {
      const value = methods.watch(`translations.${index}.keywords`);
      acc[locale] = Array.isArray(value) ? value : [];
      return acc;
    }, {} as Record<string, string[]>);
  };

  // Postavljanje keywords array vrijednosti
  const setKeywordArrayValue = (
    lang: (typeof locales)[number],
    value: string[]
  ) => {
    const langIndex = locales.indexOf(lang);
    methods.setValue(`translations.${langIndex}.keywords`, value, {
      shouldValidate: false,
    });
  };

  const getMultiLanguageFieldErrors = (
    fieldName: keyof CreateOfferTranslationData
  ) => {
    return locales.reduce((acc, locale, index) => {
      // Provjeri greške iz react-hook-form
      const formError =
        methods.formState.errors.translations?.[index]?.[fieldName];

      // Za slug polje, provjeri i slug greške iz custom validacije
      if (fieldName === "slug" && slugErrors[locale]) {
        acc[locale] = slugErrors[locale];
      } else if (formError) {
        acc[locale] = formError.message;
      } else {
        acc[locale] = undefined;
      }

      return acc;
    }, {} as Record<string, string | undefined>);
  };

  const handleImageChange = (imageUrl: string) => {
    methods.setValue("icon", imageUrl, { shouldValidate: false });
    // Očisti greške za trenutni korak
    setStepErrors((prev) => ({ ...prev, 0: false }));
  };

  // Handler za promjene sadržaja
  const handleContentChange = (content: MultiLanguageContent) => {
    locales.forEach((locale, index) => {
      const localeContent = content[locale] || [];
      methods.setValue(`translations.${index}.content`, localeContent, {
        shouldValidate: false,
      });
    });
  };

  // Validacija određenog koraka
  const validateStep = async (stepIndex: number): Promise<boolean> => {
    if (stepIndex === 0) {
      // Prvo očisti postojeće greške
      methods.clearErrors();

      // Provjeri slug konflikte prvo
      const slugValidationErrors = validateSlugs();
      setSlugErrors(slugValidationErrors);

      if (Object.keys(slugValidationErrors).length > 0) {
        setStepErrors((prev) => ({ ...prev, [stepIndex]: true }));
        console.log("Slug validation errors:", slugValidationErrors);
        return false;
      }

      // Zatim standardna validacija
      const currentValues = methods.getValues();
      const result = createOfferBasicSchema.safeParse(currentValues);

      if (!result.success) {
        setStepErrors((prev) => ({ ...prev, [stepIndex]: true }));
        console.log("Validation errors:", result.error.flatten());

        // Postavi greške u react-hook-form za prikaz u UI-u
        const fieldErrors = result.error.flatten().fieldErrors;

        // Postavi greške za osnovne podatke
        if (fieldErrors.priceFrom) {
          methods.setError("priceFrom", {
            type: "manual",
            message: fieldErrors.priceFrom[0],
          });
        }

        if (fieldErrors.priceTo) {
          methods.setError("priceTo", {
            type: "manual",
            message: fieldErrors.priceTo[0],
          });
        }

        if (fieldErrors.icon) {
          methods.setError("icon", {
            type: "manual",
            message: fieldErrors.icon[0],
          });
        }

        // Postavi greške za translations - provjeri svaku translation posebno
        locales.forEach((locale, langIndex) => {
          const title = methods.watch(`translations.${langIndex}.title`);
          const slug = methods.watch(`translations.${langIndex}.slug`);

          if (!title) {
            methods.setError(`translations.${langIndex}.title`, {
              type: "manual",
              message: "Naslov je obavezan.",
            });
          }

          if (!slug) {
            methods.setError(`translations.${langIndex}.slug`, {
              type: "manual",
              message: "URL slug je obavezan.",
            });
          }
        });

        return false;
      } else {
        setStepErrors((prev) => ({ ...prev, [stepIndex]: false }));
        setSlugErrors({}); // Očisti slug greške
        return true;
      }
    } else {
      // Content koraci se ne validiraju
      return true;
    }
  };

  // Provjeri ima li grešaka u trenutnom koraku
  const hasErrorsInStep = (stepIndex: number): boolean => {
    return (
      !!stepErrors[stepIndex] ||
      (stepIndex === 0 && Object.keys(slugErrors).length > 0)
    );
  };

  const onSubmit = methods.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      // Finalna validacija slug-ova
      const finalSlugErrors = validateSlugs();
      if (Object.keys(finalSlugErrors).length > 0) {
        console.error("Final slug validation failed:", finalSlugErrors);
        setSlugErrors(finalSlugErrors);
        return;
      }

      // Finalna validacija s kompletnom schema
      const finalResult = createOfferSchema.safeParse(data);

      if (!finalResult.success) {
        console.error("Final validation failed:", finalResult.error);
        return;
      }

      let result;

      if (isEditMode && offer) {
        // Update postojeće ponude - prvo osnovne podatke
        const basicUpdateResult = await updateOffer(offer.id, {
          priceFrom: data.priceFrom,
          priceTo: data.priceTo,
          icon: data.icon,
          order: data.order,
          serviceIds: data.serviceIds,
        });

        if (!basicUpdateResult.success) {
          console.error(
            "Error updating basic offer data:",
            basicUpdateResult.error
          );
          return;
        }

        // Zatim updateiraj svi prijevodi
        let allTranslationsUpdated = true;
        for (const translation of data.translations) {
          const translationResult = await updateOfferTranslation(
            offer.id,
            translation.languageCode,
            {
              slug: translation.slug,
              title: translation.title,
              subtitle: translation.subtitle,
              description: translation.description,
              keywords: translation.keywords || [],
              content: translation.content,
            }
          );

          if (!translationResult.success) {
            console.error(
              `Error updating translation for ${translation.languageCode}:`,
              translationResult.error
            );
            allTranslationsUpdated = false;
          }
        }

        if (allTranslationsUpdated) {
          console.log("Offer updated successfully");
          result = { success: true, data: basicUpdateResult.data };
        } else {
          result = {
            success: false,
            error: "Some translations failed to update",
          };
        }

        // U edit modu ne resetiramo formu, već ostavljamo postojeće podatke
      } else {
        // Kreiranje nove ponude
        result = await createOffer(data);

        if (result.success) {
          console.log("Offer created successfully:", result.data);

          // Resetiraj formu nakon uspješnog kreiranja
          methods.reset({
            priceFrom: "",
            priceTo: "",
            icon: "",
            order: 0,
            serviceIds: [],
            translations: locales.map((locale) => ({
              languageCode: locale,
              slug: "",
              title: "",
              subtitle: "",
              description: "",
              keywords: [],
              content: [],
            })),
          });

          // Resetiraj i lokalni state
          setCurrentStep(0);
          setStepErrors({});
          setSlugErrors({});
        } else {
          console.error("Error creating offer:", result.error);
        }
      }
    } catch (error) {
      console.error("Error processing offer:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  const [currentStep, setCurrentStep] = useState(0);

  // Custom step change handler koji validira prije prelaska
  const handleStepChange = async (newStep: number) => {
    if (newStep > currentStep) {
      // Validiraj trenutni korak prije prelaska
      const isValid = await validateStep(currentStep);
      if (!isValid) {
        return; // Ne dozvoli prelazak ako validacija ne prođe
      }
    }

    setCurrentStep(newStep);
  };

  const steps: FormStep[] = [
    {
      label: "Osnovne informacije",
      status: hasErrorsInStep(0)
        ? "error"
        : currentStep > 0
        ? "complete"
        : "current",
      children: (
        <div className="flex flex-wrap">
          <ImageUpload
            value={methods.watch("icon")}
            onChange={handleImageChange}
            label="Ikona ponude"
            description="Dodajte ikonu ponude (obavezno)"
            error={methods.formState.errors.icon}
          />

          {/* Order Selection */}
          <FormField
            control={methods.control}
            name="order"
            render={({ field }) => (
              <FormItemsContainer className="">
                <FormLabel className="mt-3 mx-4">Redoslijed</FormLabel>
                <FormLabelText className="mx-4 mb-2">
                  Unesite broj redoslijeda za sortiranje ponuda. Manji brojevi
                  će se prikazati prvi.
                </FormLabelText>
                <FormItem className="w-full">
                  <FormControl>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  {methods.formState.errors.order && (
                    <FormMessage className="text-red-500 text-xs my-3 mx-4">
                      {methods.formState.errors.order.message}
                    </FormMessage>
                  )}
                </FormItem>
              </FormItemsContainer>
            )}
          />

          {/* Price From */}
          <FormField
            control={methods.control}
            name="priceFrom"
            render={({ field }) => (
              <FormItemsContainer className="">
                <FormLabel className="mt-3 mx-4">Početna cijena</FormLabel>
                <FormLabelText className="mx-4 mb-2">
                  Unesite početnu cijenu ponude (obavezno)
                </FormLabelText>
                <FormItem className="w-full">
                  <FormControl>
                    <input
                      type="text"
                      placeholder="300"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  {methods.formState.errors.priceFrom && (
                    <FormMessage className="text-red-500 text-xs my-3 mx-4">
                      {methods.formState.errors.priceFrom.message}
                    </FormMessage>
                  )}
                </FormItem>
              </FormItemsContainer>
            )}
          />

          {/* Price To */}
          <FormField
            control={methods.control}
            name="priceTo"
            render={({ field }) => (
              <FormItemsContainer className="">
                <FormLabel className="mt-3 mx-4">Konačna cijena</FormLabel>
                <FormLabelText className="mx-4 mb-2">
                  Unesite konačnu cijenu ponude (obavezno)
                </FormLabelText>
                <FormItem className="w-full">
                  <FormControl>
                    <input
                      type="text"
                      placeholder="1000"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  {methods.formState.errors.priceTo && (
                    <FormMessage className="text-red-500 text-xs my-3 mx-4">
                      {methods.formState.errors.priceTo.message}
                    </FormMessage>
                  )}
                </FormItem>
              </FormItemsContainer>
            )}
          />

          {/* Services Selection */}
          <FormField
            control={methods.control}
            name="serviceIds"
            render={({ field }) => (
              <FormItemsContainer className="">
                <FormLabel className="mt-3 mx-4">Usluge</FormLabel>
                <FormLabelText className="mx-4 mb-2">
                  Odaberite usluge koje ova ponuda obuhvaća (opcionalno)
                </FormLabelText>
                <FormItem className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mx-4">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={field.value.includes(service.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, service.id]);
                            } else {
                              field.onChange(
                                field.value.filter((id) => id !== service.id)
                              );
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">
                          {service.translations?.[0]?.title ||
                            `Service ${service.id}`}
                        </span>
                      </label>
                    ))}
                  </div>
                  {methods.formState.errors.serviceIds && (
                    <FormMessage className="text-red-500 text-xs my-3 mx-4">
                      {methods.formState.errors.serviceIds.message}
                    </FormMessage>
                  )}
                </FormItem>
              </FormItemsContainer>
            )}
          />

          <MultiLanguageInput
            name="title"
            title="Naslov"
            description="Unesite naslov ponude na oba jezika (obavezno)"
            placeholder={locales.reduce((acc, locale) => {
              acc[locale] = `Naslov (${locale})`;
              return acc;
            }, {} as Record<string, string>)}
            value={getCurrentStringValues("title")}
            handleChange={(value, language) =>
              setFieldValue("title", language, value)
            }
            error={getMultiLanguageFieldErrors("title")}
          />

          <MultiLanguageInput
            name="subtitle"
            title="Podnaslov"
            description="Unesite podnaslov ponude na oba jezika (neobavezno)"
            placeholder={locales.reduce((acc, locale) => {
              acc[locale] = `Podnaslov (${locale})`;
              return acc;
            }, {} as Record<string, string>)}
            value={getCurrentStringValues("subtitle")}
            handleChange={(value, language) =>
              setFieldValue("subtitle", language, value)
            }
            error={getMultiLanguageFieldErrors("subtitle")}
          />

          {/* Prikaz generiranih slug-ova */}
          <MultiLanguageInput
            name="slug"
            title="URL (slug)"
            description="Automatski generirano iz naziva - koristiće se u URL-u stranice"
            placeholder={locales.reduce((acc, locale) => {
              acc[locale] = `URL za ${locale}`;
              return acc;
            }, {} as Record<string, string>)}
            value={getCurrentStringValues("slug")}
            handleChange={() => {}} // Ne dozvoljavamo ručno mijenjanje
            readOnly={true}
            error={getMultiLanguageFieldErrors("slug")}
          />
          <MultiLanguageArrayInput
            name="keywords"
            title="Ključne riječi"
            description="Dodajte ključne riječi za svaki jezik (neobavezno, korisno za SEO)"
            placeholder={locales.reduce((acc, locale) => {
              acc[locale] = `Ključna riječ (${locale})`;
              return acc;
            }, {} as Record<string, string>)}
            value={getCurrentKeywordArrayValues()}
            handleChange={(value, language) =>
              setKeywordArrayValue(language, value)
            }
            error={getMultiLanguageFieldErrors("keywords")}
          />
          <MultiLanguageInput
            name="description"
            title="Opis"
            description="Unesite opis ponude (neobavezno)"
            placeholder={locales.reduce((acc, locale) => {
              acc[locale] = `Opis (${locale})`;
              return acc;
            }, {} as Record<string, string>)}
            value={getCurrentStringValues("description")}
            handleChange={(value, language) =>
              setFieldValue("description", language, value)
            }
            error={getMultiLanguageFieldErrors("description")}
          />
        </div>
      ),
    },
    // Content editor korak
    {
      label: "Sadržaj",
      status:
        currentStep > 1
          ? ("complete" as const)
          : currentStep === 1
          ? ("current" as const)
          : ("upcoming" as const),
      children: (
        <div className="h-full">
          <ContentEditor
            languages={contentLanguages}
            defaultLanguage="hr"
            content={getCurrentContentValues()}
            onContentChange={handleContentChange}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    console.log(methods.formState.errors);
  }, [methods.formState.errors]);

  return (
    <FormProvider {...methods}>
      <form className="bg-white" onSubmit={(e) => e.preventDefault()}>
        <MultiStepForm
          title={
            isEditMode ? "Uređivanje ponude" : "Dodavanje ponude na stranicu"
          }
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          isSubmitting={isSubmitting}
          hasErrorsInStep={hasErrorsInStep}
          onSubmit={() => onSubmit()}
        />
      </form>
    </FormProvider>
  );
}
