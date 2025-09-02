import React from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images?: string[];
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images = [
    "/AdobeStock_254403672.jpeg",
    "/services/access-control/access-control-1.jpeg",
    "/services/logo-design/logo-design-2.jpeg",
    "/AdobeStock_285871858.jpeg",
    "/about-us/about-us-values.jpeg",
    "/about-us/about-us-1.jpeg",
    "/about-us/about-us-team.jpeg",
  ],
  className = "",
}) => {
  const createColumns = (imageCount: number, columnWidth: string) => {
    const columns = [];
    let i = 0;
    let colIndex = 0;

    while (i < Math.min(images.length, imageCount)) {
      if (colIndex % 2 === 1 && i + 1 < Math.min(images.length, imageCount)) {
        columns.push(
          <div
            key={colIndex}
            className={`flex flex-col gap-4 xl:gap-8 h-full ${columnWidth}`}
          >
            <Image
              className="h-1/2 w-full rounded-sm shadow-lg object-cover"
              src={images[i]}
              alt={`Image ${i}`}
              width={2000}
              height={2000}
            />
            <Image
              className="h-1/2 w-full rounded-sm shadow-lg object-cover"
              src={images[i + 1]}
              alt={`Image ${i + 1}`}
              width={2000}
              height={2000}
            />
          </div>
        );
        i += 2;
      } else {
        columns.push(
          <div
            key={colIndex}
            className={`flex flex-col gap-4 xl:gap-8 h-[80%] items-center justify-center translate-y-[10%] ${columnWidth}`}
          >
            <Image
              className="h-full w-full rounded-sm shadow-lg object-cover"
              src={images[i]}
              alt={`Image ${i}`}
              width={2000}
              height={2000}
            />
          </div>
        );
        i += 1;
      }

      colIndex++;
    }

    return columns;
  };

  return (
    <div
      className={`w-full h-[50vh] xl:h-screen px-4 xl:px-8 flex xl:py-20 py-10 gap-4 xl:gap-8 overflow-auto ${className}`}
    >
      {/* Mobile - 3 slike */}
      <div className="flex gap-4 xl:gap-8 w-full lg:hidden">
        {createColumns(3, "w-1/2")}
      </div>

      {/* Tablet - 4 slike */}
      <div className="hidden lg:flex xl:hidden gap-4 xl:gap-8 w-full">
        {createColumns(4, "w-1/3")}
      </div>

      {/* Desktop - 7 slika */}
      <div className="hidden xl:flex gap-4 xl:gap-8 w-full">
        {createColumns(7, "w-[20%]")}
      </div>
    </div>
  );
};

export default ImageGallery;
