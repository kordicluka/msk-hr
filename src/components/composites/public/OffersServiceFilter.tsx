"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/atoms/button";
import { Check } from "lucide-react";
import { ServiceWithTranslations } from "@/types/service";

interface OffersServiceFilterProps {
  services: ServiceWithTranslations[];
}

export function OffersServiceFilter({ services }: OffersServiceFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Dobijanje trenutno odabranih usluga iz searchParams
  const selectedServices =
    searchParams.get("services")?.split(",").filter(Boolean) || [];

  // Dodavanje ili uklanjanje usluge iz filtra
  const toggleService = (serviceSlug: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const currentServices =
      current.get("services")?.split(",").filter(Boolean) || [];

    let newServices: string[];
    if (currentServices.includes(serviceSlug)) {
      // Uklanjanje usluge
      newServices = currentServices.filter((slug) => slug !== serviceSlug);
    } else {
      // Dodavanje usluge
      newServices = [...currentServices, serviceSlug];
    }

    if (newServices.length === 0) {
      current.delete("services");
    } else {
      current.set("services", newServices.join(","));
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/offers${query}`);
  };

  // Resetovanje filtra
  const resetFilter = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("services");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/offers${query}`);
  };

  return (
    <div className="bg-white xl:translate-y-[-6rem] pb-8 px-4 lg:px-20">
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-2 justify-center">
          {/* Gumb za sve ponude */}
          <Button
            variant={selectedServices.length === 0 ? "default" : "outline"}
            onClick={resetFilter}
            className="flex items-center gap-2"
          >
            {selectedServices.length === 0 && <Check className="w-4 h-4" />}
            Sve ponude
          </Button>

          {services.map((service) => {
            const serviceSlug = service.translations?.[0]?.slug || "";
            const isSelected = selectedServices.includes(serviceSlug);
            const serviceTitle =
              service.translations?.[0]?.title || "Nepoznata usluga";

            return (
              <Button
                key={service.id}
                variant={isSelected ? "default" : "outline"}
                onClick={() => toggleService(serviceSlug)}
                className="flex items-center gap-2"
              >
                {isSelected && <Check className="w-4 h-4" />}
                {serviceTitle}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
