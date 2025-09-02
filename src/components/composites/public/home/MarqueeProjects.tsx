import Image from "next/image";
import { Marquee, MarqueeItem } from "@/components/atoms/marquee";
import { cn } from "@/lib/utils";
import { getMarqueeItems, MarqueItem } from "@/data/marquee-items";

export default function MarqueeProjects() {
  const marqueItems: MarqueItem[] = getMarqueeItems("hr");

  return (
    <>
      <section className="w-full bg-primary overflow-hidden  py-20 relative">
        <div className="relative w-full z-40 flex flex-col items-center justify-center space-y-16">
          <div className="w-full relative h-[42vh] z-10 ">
            <Marquee
              speed={100}
              reverse
              direction="horizontal"
              className="w-full h-full"
            >
              {marqueItems.slice(0, marqueItems.length).map((item) => (
                <MarqueeItem
                  key={item.image.src}
                  className={cn(
                    "rounded-xl p-0 relative aspect-square shadow-none h-full mr-5",
                    item.className
                  )}
                >
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 w-2/3 h-full rounded-4xl overflow-hidden z-10",
                      item.backgroundImage.divClassName
                    )}
                  >
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      className={cn(
                        "object-cover object-top w-full shadow-md h-full ",
                        item.image.imageClassName
                      )}
                      width={1500}
                      height={1500}
                    />
                  </div>
                  <div
                    className={cn(
                      "absolute rounded-4xl bottom-3 overflow-hidden right-0 w-2/4 h-2/3 z-5",
                      item.backgroundImage.divClassName
                    )}
                  >
                    <Image
                      src={item.backgroundImage.src}
                      alt={item.backgroundImage.alt}
                      className={cn(
                        "object-cover object-top w-full shadow-md h-full",
                        item.backgroundImage.imageClassName
                      )}
                      width={1500}
                      height={1500}
                    />
                  </div>

                  <div className="absolute bottom-6 left-6 z-20 bg-background/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-white rounded-lg p-2 shadow-sm h-12 w-12 flex items-center justify-center">
                        <Image
                          src={item.icon.src}
                          alt={item.icon.alt}
                          className={cn("w-8 h-8", item.icon.imageClassName)}
                          width={32}
                          height={32}
                        />
                      </div>
                      <div className="flex flex-col">
                        <h4
                          className={cn(
                            "font-semibold text-lg",
                            item.title.className
                          )}
                        >
                          {item.title.label}
                        </h4>
                        <span
                          className={cn(
                            "text-sm uppercase text-primary",
                            item.service.className
                          )}
                        >
                          {item.service.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </MarqueeItem>
              ))}
            </Marquee>
          </div>
        </div>

        <div className="absolute  aspect-square h-full w-full top-1/2 left-0 z-0bg-[radial-gradient(circle,#09daff1a,transparent_35%)]"></div>
      </section>
    </>
  );
}
