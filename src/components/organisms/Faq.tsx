import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import { SectionTitle } from "../molecules/SectionTitle";

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="container mx-auto px-4 xl:px-0 py-20 xl:py-30 flex flex-col ">
      <SectionTitle
        title={<h2 className="mb-16">FAQ</h2>}
        alignment="left"
        spacing="xl"
      />
      <Accordion type="single" collapsible className="w-full space-y-4">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="first:border-t  last:border-b border-gray-300"
          >
            <AccordionTrigger
              className={`text-lg sm:text-xl md:text-2xl lg:text-3xl w-full max-w-none  cursor-pointer tracking-tighter font-medium py-12`}
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed pb-10">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
