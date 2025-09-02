import { ArrowButton } from "@/components/atoms/button";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/atoms/carousel";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

interface BlogHeroSlide {
  title: string;
  excerpt: string;
  image: string;
  href: string;
  cta: string;
  category: string;
}

interface BlogHeroProps {
  slides: BlogHeroSlide[];
}

export default function BlogHero({ slides }: BlogHeroProps) {
  return (
    <section className="z-40 relative h-[40rem] md:h-[50rem] lg:h-[65rem] w-full mx-auto overflow-hidden bg-black flex items-center justify-center">
      <Carousel
        className="w-full h-full overflow-x-visible"
        opts={{
          align: "start",
          containScroll: "trimSnaps",
        }}
      >
        <CarouselContent className="h-full ml-0 overflow-x-visible cursor-grab">
          {slides.map((slide) => (
            <CarouselItem
              key={slide.title}
              className="pl-0 h-[40rem] md:h-[50rem] lg:h-[65rem] pr-0 basis-full transition-opacity duration-300"
            >
              <BlogHeroSlide slide={slide} />
            </CarouselItem>
          ))}
        </CarouselContent>{" "}
        <CarouselPrevious
          className="absolute text-white size-10 md:size-12 lg:size-14 top-1/2 left-4 md:left-8 lg:left-30 -translate-y-1/2"
          variant="ghost"
          size="icon"
        />
        <CarouselNext
          className="absolute text-white size-10 md:size-12 lg:size-14 top-1/2 right-4 md:right-8 lg:right-30 -translate-y-1/2"
          variant="ghost"
          size="icon"
        />
      </Carousel>
    </section>
  );
}

const BlogHeroSlide = ({ slide }: { slide: BlogHeroSlide }) => {
  return (
    <article className="w-full h-full relative">
      <div className="container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-10 flex flex-col justify-center px-4">
        <h6 className="text-blue-300 mb-2 md:mb-4 text-sm md:text-base tracking-tighter uppercase">
          {slide.category}
        </h6>
        <h2 className="text-white mb-6 md:mb-10  max-w-5xl">{slide.title}</h2>
        <p className="text-sm md:text-base lg:text-lg leading-6 md:leading-8 max-w-xl md:max-w-2xl text-gray-200 mb-6 md:mb-8">
          {slide.excerpt}
        </p>
        <Link href={slide.href as never} className="mt-2 md:mt-4">
          <ArrowButton className="text-sm md:text-base">
            {slide.cta}
          </ArrowButton>
        </Link>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-full ">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover brightness-60"
        />{" "}
      </div>{" "}
    </article>
  );
};
