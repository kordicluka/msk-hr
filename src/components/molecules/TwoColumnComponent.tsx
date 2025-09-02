import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/atoms/button";

interface TwoColumnComponentProps {
  image: string;
  title: string;
  paragraph: string;
  theme?: "light" | "dark";
  reverse?: boolean;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost";
  href?: string;
}

export default function TwoColumnComponent({
  image,
  title,
  paragraph,
  theme = "light",
  reverse = false,
  buttonText,
  buttonVariant = "default",
  href,
}: TwoColumnComponentProps) {
  return (
    <div className={`w-full ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <div className="container mx-auto px-4 py-10 md:py-12 lg:py-16">
        <div
          className={`flex flex-wrap gap-8 lg:gap-22 ${
            reverse
              ? "flex-col-reverse lg:flex-row-reverse"
              : "flex-col-reverse lg:flex-row"
          }`}
        >
          {/* Image Column */}
          <div className="flex-1 min-w-[300px] lg:min-w-[400px]">
            <div
              className="relative w-full aspect-square overflow-hidden rounded-lg"
              style={{ aspectRatio: "1000/1300" }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                width={1500}
                height={1500}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-1 min-w-[300px] lg:min-w-[400px] flex flex-col justify-center">
            <div className="space-y-10">
              <h2
                className={` font-medium max-w-2xl ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </h2>
              <p
                className={`max-w-xl text-base  ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {paragraph}
              </p>
              {/* Optional Button */}
              {buttonText && href && (
                <div className="flex">
                  <Button variant={buttonVariant} size="lg" asChild>
                    <Link href={href}>{buttonText}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
