"use client";
import { ArrowButton, Button } from "@/components/atoms/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/atoms/carousel";
import { OfferWithTranslations } from "@/types/offer";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  offers: OfferWithTranslations[];
  locale: string;
  title: string;
  description: string;
  firstButton: {
    href: string;
    label: string;
  };
  secondButton: {
    href: string;
    label: string;
  };
}

export default function Hero({
  offers,
  locale,
  title,
  description,
  secondButton,
  firstButton,
}: HeroProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const autoplayRef = useRef(Autoplay({ delay: 2000 }));

  const toggleAutoplay = () => {
    if (isPlaying) {
      autoplayRef.current.stop();
    } else {
      autoplayRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const backgroundImages = [
    "/services/software-development/AdobeStock_471463653.jpeg",
    "/services/logo-design/logo-design-2.jpeg",
    "/services/access-control/access-control-1.jpeg",
  ];

  // Animacija izmjene slika svakih 5 sekundi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const imageVariants = {
    initial: {
      opacity: 0.5,
      scale: 1.1,
    },
    animate: {
      opacity: 1,
      scale: 1.2,
    },
    exit: {
      opacity: 0.5,
      scale: 1,
    },
  };

  return (
    <div className="w-full relative overflow-hidden">
      <section className="w-full overflow-hidden pb-20 pt-34 relative">
        <div className="space-y-10 pt-30 pb-20 z-40 w-full px-4 2xl:px-0 container mx-auto">
          <h1 className="text-white/95">{title}</h1>
          <p className="tracking-wide text-sm lg:text-base leading-relaxed font-light text-white max-w-5xl">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href={firstButton.href}>
              <Button size="lg">{firstButton.label}</Button>
            </Link>
            <Link href={secondButton.href}>
              <ArrowButton variant="ghost" size="lg" className="text-white">
                {secondButton.label}
              </ArrowButton>
            </Link>
          </div>
        </div>
      </section>

      <Carousel
        className="w-full flex flex-col  items-center justify-center"
        opts={{
          loop: true,
          align: "start",
          slidesToScroll: 1,
        }}
        plugins={[autoplayRef.current]}
      >
        <div className="hidden lg:block absolute backdrop-blur top-0 left-0 w-full h-[22rem] bg-gray-900/5"></div>
        <CarouselContent className="hidden lg:flex w-full h-[22rem] cursor-grab relative shadow-xl">
          {offers.map((offer) => {
            const translation = offer.translations?.find(
              (t) => t.languageCode === locale
            );
            return (
              <CarouselItem
                key={offer.id}
                className="basis-full pl-10 lg:pl-0 md:basis-1/2 lg:basis-1/3 max-w-[350px] md:max-w-7xl h-[22rem] flex-col flex relative"
              >
                <div className="px-4 md:px-12 lg:px-20 h-full flex flex-col relative">
                  <div className="absolute top-[15%] left-0 h-[70%] w-full border-r-2 border-white/20"></div>
                  <h5 className="text-blue-300 text-xs md:text-sm mb-2 mt-[10%] font-medium tracking-tighter uppercase">
                    {translation?.subtitle || ""}
                  </h5>
                  <h4 className="text-2xl xl:text-3xl tracking-tighter font-medium text-white/90 mb-6">
                    {translation?.title || ""}
                  </h4>
                  <p className="font-light text-xs max-w-lg lg:text-sm xl:text-[1.05rem]  text-white/50">
                    {translation?.description &&
                    translation.description.length > 150
                      ? `${translation.description.slice(0, 150)}...`
                      : translation?.description || ""}
                  </p>
                  <Link href={`/offers/${translation?.slug}`}>
                    <ArrowButton
                      variant="ghost"
                      className="underline absolute bottom-[10%] left-4 md:left-12 lg:left-20 text-white pl-0"
                    >
                      {locale === "hr" ? "Saznaj više" : "Learn more"}
                    </ArrowButton>
                  </Link>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="hidden lg:flex w-full space-x-4 py-12 justify-center">
          <div className="container mx-auto flex items-start justify-start gap-4">
            <CarouselPrevious
              className="static translate-0 hover:bg-white/10 text-white bg-transparent shadow-sm size-12"
              variant="ghost"
              size="icon"
            />

            <Button
              onClick={toggleAutoplay}
              className="text-white bg-transparent hover:bg-white/10 shadow-sm size-12"
              variant="ghost"
              size="icon"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <CarouselNext
              className="static translate-0 hover:bg-white/10 text-white bg-transparent shadow-sm size-12"
              variant="ghost"
              size="icon"
            />
          </div>
        </div>
      </Carousel>

      {/* Animirane pozadinske slike */}
      <div className="absolute top-0  left-0 w-full h-full -z-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
            className="absolute brightness-40 bg-gray-900 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-full h-full"
          >
            <Image
              src={backgroundImages[currentImageIndex]}
              alt={`Hero background ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              priority={currentImageIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
