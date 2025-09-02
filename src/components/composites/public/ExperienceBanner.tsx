import { ArrowButton } from "@/components/atoms/button";
import Image from "next/image";
import Link from "next/link";
const ExperienceBanner = () => {
  return (
    <div className="my-32">
      <div className="w-[90%] shadow-xl mx-auto rounded-3xl bg-gradient-to-r from-primary/95 to-primary px-8  md:px-20  flex flex-col md:flex-row items-center justify-between overflow-hidden">
        {/* Left - Image */}
        <div className="w-full h-[50rem] flex flex-col justify-end md:w-1/2 relative">
          <Image
            src="/sebury-devices/image.png"
            alt="Square Go App"
            width={600}
            height={400}
            className="object-contain object-bottom h-[80%] w-full"
          />
        </div>

        {/* Right - Text */}
        <div className="w-full md:py-16 py-12 md:w-1/2 text-white">
          <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-10 mr-20">
            Experience it yourself.
          </h2>
          <p className="text-lg font-light leading-10 tracking-wide mb-6 max-w-2xl">
            Download the Square Go app to see exactly what clients see when they
            book, manage, and rebook self-care services with local businesses
            like yours.
          </p>
          <Link href="/">
            <ArrowButton variant="ghost" className="text-white pl-0">
              Learn more
            </ArrowButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceBanner;
