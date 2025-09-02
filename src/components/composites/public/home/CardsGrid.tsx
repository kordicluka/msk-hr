import React from "react";
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/atoms/card";
import Image from "next/image";
import { Button, ArrowButton } from "@/components/atoms/button";

export const CardsGrid = ({
  cards,
  title,
}: {
  title: string;
  cards: {
    subtitle: string;
    title: string;
    description: string;
    image: string;
  }[];
}) => {
  return (
    <section className="w-full py-30 flex-col flex space-y-20">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h2 className="text-7xl tracking-tighter text-center font-semibold">
          {title}
        </h2>{" "}
      </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card
            className="shadow-none border-none p-0 m-0 gap-0"
            key={card.title}
          >
            <CardHeader className="m-0">
              <Image
                src={card.image}
                alt={card.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </CardHeader>
            <CardContent className="translate-y-[-1rem]">
              <div className="flex flex-col  items-center justify-center">
                <h5 className=" mb-1 text-gray-500 font-medium tracking-tighter uppercase">
                  {card.subtitle}
                </h5>
              </div>
              <CardTitle className="text-5xl tracking-tighter font-semibold mt-4 text-center">
                {card.title}
              </CardTitle>
              <CardDescription className="text-center mt-6 mb-8">
                {card.description}
              </CardDescription>
              <div className="flex items-center justify-center space-x-2">
                <Button className="text-sm">Saznaj više</Button>{" "}
                <ArrowButton variant="ghost" className="text-sm">
                  Saznaj više
                </ArrowButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
