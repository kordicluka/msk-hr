"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  createServiceSchema,
  createServiceBasicSchema,
} from "@/schemas/service";
import type {
  CreateServiceData,
  CreateServiceTranslationData,
  ServiceWithTranslations,
} from "@/types/service";
import {
  createService,
  updateService,
  updateServiceTranslation,
} from "@/actions/ServiceAction";
import MultiLanguageInput from "@/components/composites/admin/MultiLanguageInput.tsx";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/admin/select";
import {
  ContentEditor,
  type MultiLanguageContent,
  type Language,
} from "@/components/organisms/content/editor";
import MultiLanguageArrayInput from "@/components/composites/admin/MultiLanguageArrayInput";

export function ServiceForm({
  services,
  service,
}: {
  services: ServiceWithTranslations[];
  service?: ServiceWithTranslations | null;
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
  const isEditMode = !!service;

  const methods = useForm<CreateServiceData>({
    // Bez resolver-a - manual validacija po koracima
    defaultValues: {
      image: service?.image || "",
      parentServiceId: service?.parentServiceId || undefined,
      order: service?.order || 0,
      translations: locales.map((locale) => {
        const existingTranslation = service?.translations?.find(
          (t) => t.languageCode === locale
        );
        return {
          languageCode: locale,
          slug: existingTranslation?.slug || "",
          title: existingTranslation?.title || "",
          subtitle: existingTranslation?.subtitle || "",
          description: existingTranslation?.description || "",
          shortDescription: existingTranslation?.shortDescription || "",
          keywords: existingTranslation?.keywords || [],
          content: existingTranslation?.content || [],
        };
      }),
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Funkcija za provjeru postoji li već slug
  const checkSlugExists = (slug: string, languageCode: string): boolean => {
    return services.some((existingService) => {
      // U edit modu, ignoriraj trenutnu uslugu
      if (isEditMode && service && existingService.id === service.id) {
        return false;
      }
      return existingService.translations?.some(
        (translation) =>
          translation.slug === slug && translation.languageCode === languageCode
      );
    });
  };

  // Validacija slug-ova
  const validateSlugs = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    locales.forEach((locale, index) => {
      const slug = methods.watch(`translations.${index}.slug`);
      const title = methods.watch(`translations.${index}.title`);

      if (title && slug) {
        // U edit modu, provjeri da li je slug promijenjen od originalnog
        if (isEditMode && service) {
          const originalTranslation = service.translations?.find(
            (t) => t.languageCode === locale
          );
          // Ako je slug isti kao originalni, ne provjeri duplikate
          if (originalTranslation && originalTranslation.slug === slug) {
            return; // Preskoči validaciju za nepromijenjen slug
          }
        }

        if (checkSlugExists(slug, locale)) {
          errors[
            locale
          ] = `Usluga s URL-om "${slug}" već postoji za ${locale.toUpperCase()} jezik`;
        }
      }
    });

    return errors;
  };

  const setFieldValue = (
    field: keyof CreateServiceTranslationData,
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

  const getCurrentStringValues = (
    field: Exclude<keyof CreateServiceTranslationData, "content" | "keywords">
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
    fieldName: keyof CreateServiceTranslationData
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
    methods.setValue("image", imageUrl, { shouldValidate: false });
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
      const result = createServiceBasicSchema.safeParse(currentValues);

      if (!result.success) {
        setStepErrors((prev) => ({ ...prev, [stepIndex]: true }));
        console.log("Validation errors:", result.error.flatten());

        // Postavi greške u react-hook-form za prikaz u UI-u
        const fieldErrors = result.error.flatten().fieldErrors;

        // Postavi greške za sliku
        if (fieldErrors.image) {
          methods.setError("image", {
            type: "manual",
            message: fieldErrors.image[0],
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
      const finalResult = createServiceSchema.safeParse(data);

      if (!finalResult.success) {
        console.error("Final validation failed:", finalResult.error);
        return;
      }

      let result;

      if (isEditMode && service) {
        // Update postojeće usluge - prvo osnovne podatke
        const basicUpdateResult = await updateService(service.id, {
          parentServiceId: data.parentServiceId,
          image: data.image,
          order: data.order,
        });

        if (!basicUpdateResult.success) {
          console.error(
            "Error updating basic service data:",
            basicUpdateResult.error
          );
          return;
        }

        // Zatim updateiraj svi prijevodi
        let allTranslationsUpdated = true;
        for (const translation of data.translations) {
          const translationResult = await updateServiceTranslation(
            service.id,
            translation.languageCode,
            {
              slug: translation.slug,
              title: translation.title,
              subtitle: translation.subtitle,
              description: translation.description,
              shortDescription: translation.shortDescription,
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
          console.log("Service updated successfully");
          result = { success: true, data: basicUpdateResult.data };
        } else {
          result = {
            success: false,
            error: "Some translations failed to update",
          };
        }

        // U edit modu ne resetiramo formu, već ostavljamo postojeće podatke
      } else {
        // Kreiranje nove usluge
        result = await createService(data);

        if (result.success) {
          console.log("Service created successfully:", result.data);

          // Resetiraj formu nakon uspješnog kreiranja
          methods.reset({
            image: "",
            parentServiceId: undefined,
            order: 0,
            translations: locales.map((locale) => ({
              languageCode: locale,
              slug: "",
              title: "",
              subtitle: "",
              description: "",
              shortDescription: "",
              keywords: [],
              content: [],
            })),
          });

          // Resetiraj i lokalni state
          setCurrentStep(0);
          setStepErrors({});
          setSlugErrors({});
        } else {
          console.error("Error creating service:", result.error);
        }
      }
    } catch (error) {
      console.error("Error processing service:", error);
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
            value={methods.watch("image")}
            onChange={handleImageChange}
            label="Slika usluge"
            description="Dodajte sliku usluge (obavezno)"
            error={methods.formState.errors.image}
          />

          {/* Order Selection */}
          <FormField
            control={methods.control}
            name="order"
            render={({ field }) => (
              <FormItemsContainer className="">
                <FormLabel className="mt-3 mx-4">Redoslijed</FormLabel>
                <FormLabelText className="mx-4 mb-2">
                  Unesite broj redoslijeda za sortiranje usluga. Manje brojevi
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

          {/* Parent Service Selection */}
          <FormField
            control={methods.control}
            name="parentServiceId"
            render={({ field }) => (
              <FormItemsContainer className="">
                <FormLabel className="mt-3 mx-4">Nadusluga</FormLabel>
                <FormLabelText className="mx-4 mb-2">
                  Odaberite nadusludu ako ova usluga pripada pod neku postojeću
                  uslugu. Ovo je opcionalno.
                </FormLabelText>{" "}
                <FormItem className="w-full">
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? undefined : value)
                    }
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full rounded-none border-none">
                        <SelectValue
                          placeholder={"Odaberite nadusludu (opcionalno)"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-none">
                      <SelectItem value="none">
                        <em className="text-sm font-normal">Nema nadusluge</em>
                      </SelectItem>
                      {services
                        .filter((s) => {
                          // U edit modu, ne prikazuj trenutnu uslugu kao opciju
                          if (isEditMode && service && s.id === service.id) {
                            return false;
                          }
                          return true;
                        })
                        .map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.translations?.[0]?.title || `Service ${s.id}`}
                            {s.translations?.[0]?.subtitle && (
                              <span className="text-gray-500 ml-2">
                                - {s.translations[0].subtitle}
                              </span>
                            )}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {methods.formState.errors.parentServiceId && (
                    <FormMessage className="text-red-500 text-xs my-3 mx-4">
                      {methods.formState.errors.parentServiceId.message}
                    </FormMessage>
                  )}
                </FormItem>
              </FormItemsContainer>
            )}
          />

          <MultiLanguageInput
            name="title"
            title="Naslov"
            description="Unesite naslov usluge na oba jezika (obavezno)"
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

          <MultiLanguageInput
            name="subtitle"
            title="Podnaslov"
            description="Unesite podnaslov usluge (neobavezno)"
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

          <MultiLanguageInput
            name="shortDescription"
            title="Kratki opis"
            description="Unesite kratki opis usluge (koristiće se u listama, neobavezno)"
            placeholder={locales.reduce((acc, locale) => {
              acc[locale] = `Kratki opis (${locale})`;
              return acc;
            }, {} as Record<string, string>)}
            value={getCurrentStringValues("shortDescription")}
            handleChange={(value, language) =>
              setFieldValue("shortDescription", language, value)
            }
            error={getMultiLanguageFieldErrors("shortDescription")}
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
            description="Unesite detaljan opis usluge (neobavezno)"
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
            isEditMode ? "Uređivanje usluge" : "Dodavanje usluge na stranicu"
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
