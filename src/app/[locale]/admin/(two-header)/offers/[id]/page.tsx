import React from "react";
import { getOfferById } from "@/actions/OfferAction";
import Image from "next/image";

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOfferById(id);

  return (
    <div className="flex flex-col p-4">
      <Image
        src={offer?.icon || "/placeholder.png"}
        alt="Offer Icon"
        width={2000}
        height={2000}
        className="w-full rounded-xl h-[30rem] shadow-lg
         object-cover"
      />
      <div className="mx-auto container mt-20">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">
            {offer?.translations[0]?.title}
          </h1>
          <p className="text-gray-700">{offer?.translations[0]?.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-green-600">
              {offer?.priceFrom} - {offer?.priceTo} €
            </span>
          </div>
          {offer?.translations[0]?.subtitle && (
            <p className="text-lg text-gray-600 font-medium">
              {offer.translations[0].subtitle}
            </p>
          )}
          <div
            className="prose max-w-none mt-8"
            dangerouslySetInnerHTML={{
              __html: offer?.translations[0]?.content || "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
