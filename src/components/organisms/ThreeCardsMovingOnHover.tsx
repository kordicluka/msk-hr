"use client";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/molecules/SectionTitle";

export default function ThreeCardsMovingOnHover({
  items,
  title,
  description,
}: {
  items: {
    number: string;
    title: string;
    image: string;
    description: string;
  }[];
  title?: string;
  description?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const divClassName = {
    active: "opacity-100 xl:w-1/2 ",
    inactive: "opacity-50 xl:w-1/4",
    default: "opacity-100 xl:w-1/3",
  };

  const titleClassName = {
    active: "absolute left-6 text-gray-700 w-[60rem]",
    inactive: "absolute left-6  text-gray-500 w-[60rem]",
    default: "absolute left-6 text-gray-700 w-[60rem]",
  };

  const descriptionClassName = {
    active: "absolute right-6  w-[20rem] opacity-100 max-xl:hidden",
    inactive: "absolute -right-[20rem] w-[20rem] opacity-0 max-xl:hidden",
    default:
      "absolute -right-[20rem] hidden  w-[20rem] opacity-0 max-xl:hidden",
  };

  const imageClassName = {
    active: "scale-110",
    inactive: "scale-100",
    default: "scale-100",
  };

  return (
    <section className="w-full flex flex-col items-center py-20">
      <SectionTitle
        title={<h2>{title}</h2>}
        description={description}
        alignment="center"
        spacing="xl"
      />
      <div className="container px-4 xl:px-0 mx-auto w-full flex flex-col xl:flex-row  gap-6 mt-10">
        {items.map((item, i) => (
          <div
            key={item.number}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            className={cn(
              "flex flex-col  justify-between rounded-lg overflow-hidden h-[40rem] relative transition-all duration-500 ease-in-out",
              divClassName[
                activeIndex === i
                  ? "active"
                  : activeIndex === null
                  ? "default"
                  : "inactive"
              ]
            )}
          >
            <div className="w-full h-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                width={1500}
                height={1500}
                className={cn(
                  "object-cover w-full h-full rounded-lg transition-transform duration-500 ease-in-out",
                  imageClassName[
                    activeIndex === i
                      ? "active"
                      : activeIndex === null
                      ? "default"
                      : "inactive"
                  ]
                )}
                priority={i === 0}
              />
            </div>
            <div className="absolute flex flex-col justify-between w-[calc(100%-1rem)] bottom-2 bg-white left-2 p-6 h-[10rem] rounded-lg transition-all duration-500 ease-in-out">
              <div className="text-gray-400 text-sm font-medium mb-2 transition-opacity duration-500 ease-in-out">
                {item.number}
              </div>
              <div className="flex justify-between items-end">
                <h4
                  className={cn(
                    " text-base lg:text-xl font-semibold transition-colors duration-200 ease-in-out",
                    titleClassName[
                      activeIndex === i
                        ? "active"
                        : activeIndex === null
                        ? "default"
                        : "inactive"
                    ]
                  )}
                >
                  {item.title}
                </h4>
                <p
                  className={cn(
                    "text-sm text-right transition-all duration-400 ease-in-out ",
                    descriptionClassName[
                      activeIndex === i
                        ? "active"
                        : activeIndex === null
                        ? "default"
                        : "inactive"
                    ]
                  )}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
