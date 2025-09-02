"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowButton } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

export type StickyScrollableSlidesProps = {
  rowReverse?: boolean;
  items: StickyScrollableSlidesItem[];
};

export type StickyScrollableSlidesItem = {
  id: number;
  title: string;
  description: string;
  link?: string;
  image: string;
};

export default function StickyScrollableSlides({
  rowReverse = false,
  items,
}: StickyScrollableSlidesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    // Only initialize intersection observer on desktop
    if (isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Provjeravamo je li element trenutno presijeca definiranu središnju liniju
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      {
        root: null,
        rootMargin: "-25% 0px -75% 0px",
        threshold: 0,
      }
    );

    const currentSections = sectionsRef.current;
    currentSections.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      currentSections.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [isMobile]);

  if (isMobile) {
    // Mobile: Simple stacked layout with individual images
    return (
      <section className="w-full py-8 px-4">
        <div className="space-y-12">
          {items.map((item) => (
            <div key={item.id} className="space-y-6">
              {/* Image */}
              <div className="h-64 sm:h-80 overflow-hidden rounded-2xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={1500}
                  height={1500}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Content */}
              <div>
                <h4 className="font-semibold mb-4 text-gray-900">
                  {item.title}
                </h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {item.description}
                </p>
                {item.link && (
                  <Link href={item.link}>
                    <ArrowButton className="pl-0 font-semibold" variant="ghost">
                      Saznaj više
                    </ArrowButton>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Desktop: Original sticky scroll layout
  return (
    <section className="w-full py-16 flex flex-col items-center container mx-auto px-4">
      <div
        className={cn(
          "w-full flex justify-between relative gap-8 xl:gap-16",
          rowReverse ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Image - Desktop */}
        <div className="h-[50rem] overflow-hidden sticky top-60 w-1/2 min-w-[400px]">
          <div className="w-full h-full bg-muted rounded-2xl overflow-hidden">
            <Image
              src={items[activeIndex].image}
              alt={items[activeIndex].title}
              width={2000}
              height={2000}
              className="object-cover object-top w-full h-full"
            />
          </div>
        </div>

        {/* Content - Desktop */}
        <div className="flex flex-col flex-1 max-w-2xl">
          {items.map((item, index) => (
            <div
              key={item.id}
              data-index={index}
              ref={(el) => {
                if (el) {
                  sectionsRef.current[index] = el;
                }
              }}
              className="py-16 lg:py-20 xl:py-26 last:mb-60 border-b border-border last:border-b-0"
            >
              {/* Text */}
              <div
                className={`w-full transition-opacity duration-500 ${
                  activeIndex === index
                    ? "opacity-100 text-black"
                    : "opacity-40 text-gray-400"
                }`}
              >
                <h4 className="mb-8 lg:mb-12 xl:mb-14  font-semibold">
                  {item.title}
                </h4>
                <p className="mb-8 lg:mb-10 font-light leading-relaxed">
                  {item.description}
                </p>
                {item.link && (
                  <Link href={item.link}>
                    <ArrowButton className="pl-0 font-semibold" variant="ghost">
                      Saznaj više
                    </ArrowButton>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
