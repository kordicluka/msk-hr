import React from "react";
import { ContactForm } from "./ContactForm";
import { getParentServices } from "@/actions/ServiceAction";

interface ContactFormWrapperProps {
  locale: "hr" | "en";
}

export async function ContactFormWrapper({ locale }: ContactFormWrapperProps) {
  const services = await getParentServices(locale);
  
  // Transform services for ContactForm
  const formattedServices = services.map(service => {
    const translation = service.translations[0];
    return {
      id: service.id,
      slug: translation?.slug || '',
      title: translation?.title || '',
      order: service.order || 0
    };
  });

  return <ContactForm services={formattedServices} />;
}