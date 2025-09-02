import { Marquee } from "@/components/atoms/marquee";
import Image from "next/image";
import React from "react";

// (base) lukakordic@192:~/Documents/msk/msk/website/public/types$ ls
// caffe.jpeg  carpet-cleaning.jpeg  construction.jpeg  kids-workshop.jpeg  lawyer.jpeg  shopping-mall.jpeg
// (base) lukakordic@192:~/Documents/msk/msk/website/public/types$

export default function TypesOfBusineessWeHelp() {
  const images = [
    {
      title: "Caffe",
      image: "/types/caffe.jpeg",
    },
    {
      title: "Carpet Cleaning",
      image: "/types/carpet-cleaning.jpeg",
    },
    {
      title: "Construction",
      image: "/types/construction.jpeg",
    },
    {
      title: "Kids Workshop",
      image: "/types/kids-workshop.jpeg",
    },
    {
      title: "Lawyer",
      image: "/types/lawyer.jpeg",
    },
    {
      title: "Shopping Mall",
      image: "/types/shopping-mall.jpeg",
    },
  ];
  return (
    <section className="py-30 px-4">
      <div className="container mx-auto">
        <h2 className="text-7xl tracking-tighter mb-24 font-semibold">
          Tipovi poslovanja kojima pomažemo
        </h2>{" "}
      </div>
      <Marquee className="w-full" direction="horizontal" speed={100}>
        {images.map((image) => (
          <div key={image.title} className="h-[35rem] aspect-square mr-10">
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
