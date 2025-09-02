import { Marquee } from "@/components/atoms/marquee";
import Image from "next/image";
import React from "react";
import { SectionTitle } from "../molecules/SectionTitle";

export default function MarqueeImages({
  title,
  images,
}: {
  title: React.ReactNode;
  images: {
    title: string;
    image: string;
  }[];
}) {
  return (
    <section className="xl:py-30  py-14  px-4">
      <div className="container mx-auto">
        <SectionTitle
          title={<h2 className="mb-8 xl:mb-24">{title}</h2>}
          alignment="left"
          spacing="lg"
        />
      </div>
      <Marquee className="w-full" direction="horizontal" speed={100}>
        {images.map((image) => (
          <div
            key={image.title}
            className="h-[20rem] xl:h-[35rem] aspect-square mr-10"
          >
            <Image
              src={image.image}
              alt={image.title}
              width={1000}
              height={1000}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
