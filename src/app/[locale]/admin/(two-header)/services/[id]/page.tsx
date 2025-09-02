import React from "react";
import { getServiceById } from "@/actions/ServiceAction";
import Image from "next/image";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getServiceById(id);

  return (
    <div className="flex flex-col p-4">
      <Image
        src="/services/software-development/AdobeStock_471463653.jpeg"
        alt="Service Image"
        width={2000}
        height={2000}
        className="w-full rounded-xl h-[30rem] shadow-lg
         object-cover"
      />
      <div className="mx-auto container mt-20">
        <div className="flex flex-col gap-4">
          <h1>{service?.translations[0].title}</h1>
          <p className="text-gray-700">
            {service?.translations[0].description}
          </p>
        </div>
      </div>
    </div>
  );
}
