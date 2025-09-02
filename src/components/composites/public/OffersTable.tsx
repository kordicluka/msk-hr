"use client";

import React from "react";
import Image from "next/image";
import { ArrowButton } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { SectionTitle } from "@/components/molecules/SectionTitle";
import { Link } from "@/i18n/navigation";
import { OfferWithTranslations } from "@/types/offer";
import { getUrl } from "@/lib/s3";

interface OffersTableProps {
  offers: OfferWithTranslations[];
  locale: string;
  title: string;
}

export default function OffersTable({
  offers,
  locale,
  title,
}: OffersTableProps) {
  return (
    <section className="py-16 md:py-20 lg:py-24 ">
      <div className="container mx-auto px-4">
        <div className="mb-4 md:mb-12">
          <SectionTitle
            title={<h2 className=" font-medium">{title}</h2>}
            alignment="left"
            spacing="xl"
            buttons={[]}
          />
        </div>

        <div className="space-y-0">
          {offers.map((offer) => {
            const translation = offer.translations?.find(
              (t) => t.languageCode === locale
            );

            if (!translation) return null;

            return (
              <article
                key={offer.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-6 md:py-8 border-b border-gray-200 last:border-b-0 hover:bg-white transition-colors duration-200 rounded-lg px-4 md:px-6"
              >
                {/* Image Column */}
                <div className="md:col-span-2 flex justify-center md:justify-start">
                  <div className="w-68 h-68 md:w-44 md:h-44 relative overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={getUrl(offer.icon)}
                      alt={translation.title}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                {/* Title and Subtitle Column */}
                <div className="md:col-span-4 text-center pr-4 md:text-left">
                  {translation.subtitle && (
                    <p className="text-sm md:text-base tracking-tighter text-gray-500 uppercase my-2 md:mt-0">
                      {translation.subtitle}
                    </p>
                  )}
                  <h3 className="text-2xl leading-relaxed md:text-3xl lg:text-3xl font-semibold text-gray-900">
                    {translation.title}
                  </h3>
                </div>

                {/* Price and Description Column */}
                <div className="md:col-span-4 text-center md:text-left">
                  <div className="mb-3">
                    <Badge
                      variant="outline"
                      className=" border-none bg-green-100"
                    >
                      {offer.priceFrom}€ - {offer.priceTo}€
                    </Badge>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {translation.description.length > 200
                      ? `${translation.description.slice(0, 200)}...`
                      : translation.description}
                  </p>
                </div>

                {/* Button Column */}
                <div className="md:col-span-2 flex justify-center md:justify-end items-center">
                  <Link href={`/offers/${translation.slug}` as never}>
                    <ArrowButton>
                      {locale === "hr" ? "Pogledaj više" : "View more"}
                    </ArrowButton>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Optional CTA at the bottom */}
        <div className="mt-12 text-center">
          <Link href="/offers">
            <ArrowButton
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              {locale === "hr" ? "Pogledaj sve ponude" : "View all offers"}
            </ArrowButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
