import { Marquee } from "@/components/atoms/marquee";
import Image from "next/image";
import React from "react";
import { SectionTitle } from "@/components/molecules/SectionTitle";

export const LogosMarquee = ({
  title,
  description,
  images,
}: {
  title: string;
  description: string;
  images: {
    title: string;
    image: string;
  }[];
}) => {
  return (
    <section className="w-full xl:py-30 py-20 flex-col flex space-y-20">
      <SectionTitle
        title={<h2>{title}</h2>}
        description={description}
        alignment="center"
        spacing="xl"
      />
      <Marquee speed={500}>
        {images.slice(0, images.length / 2).map((image, index) => (
          <Image
            key={image.title + index + Math.random()}
            src={image.image}
            alt={`Technology + ${index + 1}`}
            width={400}
            height={400}
            className="object-contain grayscale size-30 xl:size-40 mr-40"
          />
        ))}
      </Marquee>
      <Marquee speed={500} reverse>
        {images.slice(images.length / 2, images.length).map((image, index) => (
          <Image
            key={image.title + index + "reverse" + Math.random()}
            src={image.image}
            alt={`Technology + ${index + 1}`}
            width={400}
            height={400}
            className="object-contain grayscale size-30 xl:size-40 mr-40"
          />
        ))}
      </Marquee>
    </section>
  );
};
