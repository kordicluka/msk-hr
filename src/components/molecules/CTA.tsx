import Image from "next/image";
import { ArrowButton } from "@/components/atoms/button";
import { Link } from "@/i18n/navigation";

export default function CTA({
  title,
  description,
  buttonText,
  image = "/services/software-development/software-development-2.jpeg",
}: {
  title: string;
  description: string;
  buttonText: string;
  image?: string;
}) {
  return (
    <div className=" bg-black text-white">
      <div className="relative rounded-sm overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt="Modern architectural structure with glass ceiling"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black" />
        </div>

        <div className="relative z-10 px-8 py-32 md:py-60 gap-10 flex flex-col items-start lg:items-center justify-center text-left lg:text-center">
          <h2 className="leading-tight whitespace-pre-line">{title}</h2>

          <p className=" text-zinc-200 text-sm xl:text-base mb-8 max-w-3xl lg:mx-auto">
            {description}
          </p>
          <Link href="/contact">
            <ArrowButton size="lg">{buttonText}</ArrowButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
