"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { ArrowButton } from "@/components/atoms/button";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/atoms/form";
import { SelectItem } from "@/components/atoms/select";
import { FormFloatingLabelInput } from "@/components/atoms/form-floating-label-input";
import { FormFloatingLabelSelect } from "@/components/atoms/form-floating-label-select";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/atoms/checkbox";
import { Label } from "@/components/atoms/admin/label";
import { contactData } from "@/data/contactData";
import {
  sendContactEmail,
  type ContactFormData,
} from "@/actions/ContactActions";

// Create validation schema function that accepts translation function
const createContactFormSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(2, {
      message: t("validation.firstNameMin"),
    }),
    lastName: z.string().min(2, {
      message: t("validation.lastNameMin"),
    }),
    email: z.string().email({
      message: t("validation.emailInvalid"),
    }),
    phone: z.string().min(9, {
      message: t("validation.phoneMin"),
    }),
    service: z
      .string({
        message: t("validation.serviceRequired"),
      })
      .min(1, {
        message: t("validation.serviceRequired"),
      }),
    projectDescription: z.string().min(10, {
      message: t("validation.projectDescriptionMin"),
    }),
    privacyPolicy: z.boolean().refine((val) => val, {
      message: t("validation.privacyPolicyRequired"),
    }),
  });

interface ContactFormProps {
  services: Array<{
    id: string;
    slug: string;
    title: string;
    order: number;
  }>;
}

export function ContactForm({ services }: ContactFormProps) {
  const t = useTranslations("contactForm");
  const tContact = useTranslations("contactPage");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const contactFormSchema = createContactFormSchema(t);
  type ContactFormValues = z.infer<typeof contactFormSchema>;

  // Default form values
  const defaultValues: Partial<ContactFormValues> = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    projectDescription: "",
  };

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: "onBlur", // Validacija pri gubitku fokusa
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);

    try {
      const contactData: ContactFormData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        service: data.service,
        projectDescription: data.projectDescription,
      };

      const result = await sendContactEmail(contactData);

      if (result.success) {
        alert(result.message || t("alerts.success"));
        form.reset();
      } else {
        alert(result.message || t("alerts.error"));
      }
    } catch (error) {
      console.error("Error sending contact form:", error);
      alert(t("alerts.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Get services for select field
  const serviceOptions = [
    ...services.map((service) => ({
      value: service.slug,
      label: service.title,
    })),
    {
      value: "other",
      label: t("otherService"),
    },
  ];

  return (
    <div className="w-full mx-auto mb-20">
      <div className="container mx-auto flex flex-col lg:flex-row justify-start gap-10 px-4">
        <div className="w-full lg:w-1/2 mt-8 lg:mt-22">
          <h3 className="text-2xl md:text-3xl lg:text-4xl tracking-tighter leading-tight lg:leading-14 font-medium">
            {tContact("formTitle")}
          </h3>
          <p className="text-gray-700 mt-4">{tContact("formDescription")}</p>
          <div className="flex flex-col lg:mr-20 gap-4 mt-8">
            {[
              { label: tContact("addressLabel"), value: contactData.address },
              { label: tContact("phoneLabel"), value: contactData.telephone },
              { label: tContact("emailLabel"), value: contactData.email },
              {
                label: tContact("contactPersonLabel"),
                value: contactData.kontaktOsoba,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 py-4 w-full border-b border-gray-200"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <span className="text-sm text-gray-600 font-semibold sm:w-3/10">
                  {item.label}
                </span>
                <span className="text-sm text-gray-600 font-light sm:w-7/10">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-xl shadow-lg bg-white lg:-translate-y-30 p-6 lg:p-8 border border-gray-200 flex w-full lg:w-[calc(50%-4rem)] flex-col gap-4"
          >
            <AnimatePresence mode="wait">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormFloatingLabelInput
                      label={t("firstName")}
                      placeholder={t("firstNamePlaceholder")}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormFloatingLabelInput
                      label={t("lastName")}
                      placeholder={t("lastNamePlaceholder")}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormFloatingLabelInput
                      label={t("email")}
                      placeholder={t("emailPlaceholder")}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormFloatingLabelInput
                      label={t("phone")}
                      placeholder={t("phonePlaceholder")}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormFloatingLabelSelect
                      label={t("service")}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      {serviceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </FormFloatingLabelSelect>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormFloatingLabelInput
                      label={t("projectDescription")}
                      placeholder={t("projectDescriptionPlaceholder")}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col mt-6">
                <FormField
                  control={form.control}
                  name="privacyPolicy"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <div className="flex gap-4">
                        <Checkbox
                          id="privacyPolicy"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor="privacyPolicy"
                          className="text-sm font-normal"
                        >
                          {t("privacyPolicy")}
                        </Label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end mt-6">
                <ArrowButton
                  className="h-16 w-full  font-extrabold  uppercase"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("submitting") : t("submitButton")}
                </ArrowButton>
              </div>
            </AnimatePresence>
          </form>
        </Form>
      </div>
    </div>
  );
}
