import { cn } from "@/lib/utils";
import Image from "next/image";

export const CardSection = ({
  title,
  description,
  image,
  align = "left",
}: {
  title: string;
  description: string;
  image: string;
  align: "left" | "right";
}) => {
  return (
    <section
      className={cn(
        "flex flex-col space-y-8 lg:space-y-14 container mx-auto py-12 lg:py-20 px-4",
        align === "left" ? "items-start" : "items-end"
      )}
    >
      <div
        className={cn(
          "flex flex-col space-y-4 lg:space-y-8 w-full lg:w-1/2",
          align === "left" ? "" : "lg:translate-x-[-12rem]"
        )}
      >
        <h3 className="font-semibold tracking-tighter max-w-[50rem]">
          {title}
        </h3>
        <p className="text-base lg:text-sm max-w-[50rem] text-gray-600">
          {description}
        </p>
      </div>
      <div className="flex flex-col shadow-xs h-64 lg:h-[40rem] w-full lg:w-[60rem] rounded-xl lg:rounded-sm">
        <Image
          src={image}
          alt={title}
          width={1550}
          height={1550}
          className="object-cover rounded-xl lg:rounded-sm w-full h-full"
        />
      </div>
    </section>
  );
};
