"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/atoms/carousel";
import { ArrowButton } from "@/components/atoms/button";
import Image from "next/image";

interface SeubryDevice {
  id: number;
  title: string;
  description: string;
  image: string;
}

const devices: SeubryDevice[] = [
  {
    id: 1,
    title: "BC-2000",
    description:
      "Kompaktni POS sustav koji možete ponijeti bilo gdje. Idealan za mala poduzeća i mobilne trgovce. ",
    image: "/sebury-devices/bc-2000.png",
  },
  {
    id: 2,
    title: "BC-20000",
    description:
      "Kompaktni POS sustav koji možete ponijeti bilo gdje. Idealan za mala poduzeća i mobilne trgovce. ",
    image: "/sebury-devices/bc-2000.png",
  },
  {
    id: 3,
    title: "BC-2000",
    description:
      "Kompaktni POS sustav koji možete ponijeti bilo gdje. Idealan za mala poduzeća i mobilne trgovce. ",
    image: "/sebury-devices/bc-2000.png",
  },
];

export default function CardsList2() {
  return (
    <section className="py-20 px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full -translate-x-4"
      >
        {" "}
        <div className="container flex justify-between mx-auto mb-12 translate-x-4">
          <div className="flex flex-col">
            {" "}
            <h2 className="text-7xl tracking-tighter font-semibold">
              Uređaji kontrole pristupa
            </h2>{" "}
            <p className="text-xl text-gray-800 mt-8 max-w-2xl">
              Uređaji kontrole pristupa koji su namijenjeni za zaštitu vaših
              podataka i osobnih informacija.
            </p>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <CarouselPrevious
              variant="ghost"
              className="relative size-14 bg-muted left-0 top-0 translate-y-0"
            />
            <CarouselNext
              variant="ghost"
              className="relative size-14 bg-muted right-0 top-0 translate-y-0"
            />
          </div>
        </div>
        <CarouselContent className="container mx-auto ">
          {devices.map((device) => (
            <CarouselItem key={device.id} className="container cursor-grab">
              <div
                className={`rounded-2xl pl-40 bg-muted flex flex-col justify-center h-[45rem] relative overflow-hidden`}
              >
                {/* Content */}
                <div className="z-10 relative">
                  <div className="mb-8">
                    <h3
                      className={`text-5xl tracking-tighter font-semibold mb-14 `}
                    >
                      {device.title}
                    </h3>

                    <p className={`text-lg mb-6 text-gray-700 max-w-sm`}>
                      {device.description}
                    </p>
                  </div>

                  <ArrowButton className="pl-0 font-semibold" variant="ghost">
                    Explore
                  </ArrowButton>
                </div>

                {/* Device Image */}
                <div className="absolute bottom-10 right-0 w-2/3 h-2/3">
                  <div className="relative w-full h-full">
                    <Image
                      src={device.image}
                      alt={device.title}
                      fill
                      className="object-contain "
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
