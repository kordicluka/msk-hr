import React from "react";
import Image from "next/image";

interface SingleImageProps {
  image: string;
  title?: string;
  description?: string;
  className?: string;
}

const SingleImage: React.FC<SingleImageProps> = ({
  image,
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Title and Description */}
        {(title || description) && (
          <div className="text-center mb-8">
            {title && (
              <h2 className="text-3xl font-bold mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Full Width Image */}
        <div className="w-full">
          <Image
            src={image}
            alt={title || "Single image"}
            width={1920}
            height={1080}
            className="w-full h-auto rounded-lg shadow-lg object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default SingleImage;