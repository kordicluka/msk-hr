"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/atoms/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/atoms/carousel";
import { SectionTitle } from "@/components/molecules/SectionTitle";
import { ProjectCard } from "@/components/molecules/ProjectCard";

export type Card = {
  id: number;
  title: string;
  description: string;
  icon: string;
  ctaText: string;
  badge: string;
  link: {
    href: string;
    text: string;
  };
};

const CardsList = ({
  cards,
  title,
  description,
}: {
  cards: Card[];
  title: string;
  description: string;
  link: {
    href: string;
    text: string;
  };
}) => {
  return (
    <section className="z-30 w-full relative flex overflow-hidden">
      <div className="w-full h-full flex relative py-16 md:py-20 lg:py-24 xl:py-30 justify-center items-center">
        <div className="flex flex-col xl:flex-row container min-h-[35rem] md:min-h-[40rem] xl:h-[45rem] px-4">
          <div className="flex z-20 flex-col py-0 md:py-8 lg:py-10 xl:py-12 xl:pr-10 items-start justify-start w-full xl:w-2/5 mb-8 xl:mb-0">
            <SectionTitle
              title={<h2 className="mr-10 mt-10">{title}</h2>}
              description={
                <p className="text-base md:text-lg lg:text-xl xl:leading-10 mt-4 text-gray-800 max-w-lg">
                  {description}
                </p>
              }
              alignment="left"
              spacing="xl"
              buttons={[]}
            />
          </div>

          <div className="relative z-20 xl:absolute xl:translate-x-20 xl:left-2/5 h-[35rem] md:h-[40rem] xl:h-full w-full xl:w-3/5 overflow-x-visible">
            <Carousel
              className="w-full h-full overflow-x-visible"
              opts={{
                align: "start",
                containScroll: "trimSnaps",
                dragFree: true,
              }}
            >
              <CarouselContent className="h-full ml-0 overflow-x-visible cursor-grab">
                {cards.map((item, index) => (
                  <CarouselItem
                    key={`carousel-item-${item.id}-${index}`}
                    className="pl-2 md:pl-3 xl:pl-4 h-full pr-0 basis-full lg:basis-[30rem] xl:basis-[40rem] transition-opacity duration-300"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-[35rem] md:h-[40rem] xl:h-[45rem]"
                    >
                      <ProjectCard
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        badge={item.badge}
                        link={{
                          cta: item.ctaText,
                          href: item.link.href,
                        }}
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className="absolute text-white bg-gray-700 shadow-sm size-10 md:size-12 xl:size-14 top-1/2 left-2 xl:left-0 -translate-y-1/2 xl:-translate-y-full"
                variant="ghost"
                size="icon"
              />
              <CarouselNext
                className="absolute text-white bg-gray-700 shadow-sm size-10 md:size-12 xl:size-14 top-1/2 right-2 xl:right-30 -translate-y-1/2 xl:-translate-y-full"
                variant="ghost"
                size="icon"
              />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardsList;
