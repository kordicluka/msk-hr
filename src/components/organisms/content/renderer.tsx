import { PageTitle } from "@/components/atoms/PageTitle";
import StickyScrollableSlides from "../StickyScrollableSlides";
import TwoColumnComponent from "@/components/molecules/TwoColumnComponent";
import { CardSection } from "../CardSection";
import ImageGallery from "@/components/molecules/ImageGallery";
import ThreeCardsMovingOnHover from "../ThreeCardsMovingOnHover";
import SingleImage from "@/components/molecules/SingleImage";
import CTA from "@/components/molecules/CTA";
import { type Content, type ContentBlock } from "@/types/content";
import { cn } from "@/lib/utils";
import { getUrl } from "@/lib/s3";

interface ContentRendererProps {
  content: Content;
  className?: string;
  preview?: boolean;
}

// Ova komponenta će renderirati content blokove za određeni jezik
export function ContentRenderer({
  content,
  className,
  preview = false,
}: ContentRendererProps) {
  const renderBlock = (block: ContentBlock, index: number) => {
    const key = `${block.type}-${index}`;

    switch (block.type) {
      case "pageTitle":
        return (
          <PageTitle
            key={key}
            title={block.data.title}
            description={block.data.description}
            buttonText={block.data.buttonText}
            theme={block.data.theme}
            size={block.data.size}
            align={block.data.align}
            buttonVariant={block.data.buttonVariant}
            href={block.data.href}
            className={preview ? "pointer-events-none" : ""}
          />
        );

      case "stickyScrollableSlides":
        return (
          <StickyScrollableSlides
            key={key}
            rowReverse={block.data.rowReverse}
            items={block.data.items.map((item) => ({
              ...item,
              image: item.image ? getUrl(item.image) : item.image,
            }))}
          />
        );

      case "twoColumn":
        return (
          <TwoColumnComponent
            key={key}
            image={getUrl(block.data.image)}
            title={block.data.title}
            paragraph={block.data.paragraph}
            theme={block.data.theme}
            reverse={block.data.reverse}
            buttonText={block.data.buttonText}
            buttonVariant={block.data.buttonVariant}
            href={block.data.href}
          />
        );

      case "cardSection":
        return (
          <CardSection
            key={key}
            image={getUrl(block.data.image)}
            title={block.data.title}
            description={block.data.description}
            align={block.data.align || "left"}
          />
        );

      case "imageGallery":
        return (
          <div key={key} className="w-full">
            {(block.data.title || block.data.description) && (
              <div className="text-center mb-8">
                {block.data.title && (
                  <h2 className="text-3xl font-bold mb-4">
                    {block.data.title}
                  </h2>
                )}
                {block.data.description && (
                  <p className="text-lg text-gray-600">
                    {block.data.description}
                  </p>
                )}
              </div>
            )}
            <ImageGallery
              images={block.data.images.map((image) => getUrl(image))}
              className={preview ? "pointer-events-none" : ""}
            />
          </div>
        );

      case "threeCardsMovingOnHover":
        return (
          <ThreeCardsMovingOnHover
            key={key}
            title={block.data.title}
            description={block.data.description}
            items={block.data.items.map((item) => ({
              ...item,
              image: getUrl(item.image),
            }))}
          />
        );

      case "singleImage":
        return (
          <SingleImage
            key={key}
            image={getUrl(block.data.image)}
            title={block.data.title}
            description={block.data.description}
            className={preview ? "pointer-events-none" : ""}
          />
        );

      case "cta":
        return (
          <CTA
            key={key}
            title={block.data.title}
            description={block.data.description}
            buttonText={block.data.buttonText}
            image={block.data.image ? getUrl(block.data.image) : undefined}
          />
        );

      default:
        console.warn(`Unknown block type:`, block);
        return null;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  );
}

// Pomoćna komponenta za preview mode
interface ContentPreviewProps extends ContentRendererProps {
  onBlockClick?: (blockIndex: number) => void;
  selectedBlockIndex?: number;
}

export function ContentPreview({
  content,
  className,
  onBlockClick,
  selectedBlockIndex,
}: ContentPreviewProps) {
  const renderBlock = (block: ContentBlock, index: number) => {
    const key = `${block.type}-${index}`;
    const isSelected = selectedBlockIndex === index;

    const blockElement = (() => {
      switch (block.type) {
        case "pageTitle":
          return (
            <PageTitle
              title={block.data.title}
              description={block.data.description}
              buttonText={block.data.buttonText}
              theme={block.data.theme}
              size={block.data.size}
              align={block.data.align}
              buttonVariant={block.data.buttonVariant}
              href={block.data.href}
              className="pointer-events-none"
            />
          );

        case "stickyScrollableSlides":
          return (
            <div className="pointer-events-none">
              <StickyScrollableSlides
                rowReverse={block.data.rowReverse}
                items={block.data.items.map((item) => ({
                  ...item,
                  image: item.image ? getUrl(item.image) : item.image,
                }))}
              />
            </div>
          );

        case "twoColumn":
          return (
            <div className="pointer-events-none">
              <TwoColumnComponent
                image={getUrl(block.data.image)}
                title={block.data.title}
                paragraph={block.data.paragraph}
                theme={block.data.theme}
                reverse={block.data.reverse}
                buttonText={block.data.buttonText}
                buttonVariant={block.data.buttonVariant}
                href={block.data.href}
              />
            </div>
          );

        case "cardSection":
          return (
            <div className="pointer-events-none">
              <CardSection
                image={getUrl(block.data.image)}
                title={block.data.title}
                description={block.data.description}
                align={block.data.align || "left"}
              />
            </div>
          );

        case "imageGallery":
          return (
            <div className="pointer-events-none w-full">
              {(block.data.title || block.data.description) && (
                <div className="text-center mb-8">
                  {block.data.title && (
                    <h2 className="text-3xl font-bold mb-4">
                      {block.data.title}
                    </h2>
                  )}
                  {block.data.description && (
                    <p className="text-lg text-gray-600">
                      {block.data.description}
                    </p>
                  )}
                </div>
              )}
              <ImageGallery
                images={block.data.images.map((image) => getUrl(image))}
                className="pointer-events-none"
              />
            </div>
          );

        case "threeCardsMovingOnHover":
          return (
            <div className="pointer-events-none">
              <ThreeCardsMovingOnHover
                title={block.data.title}
                description={block.data.description}
                items={block.data.items.map((item) => ({
                  ...item,
                  image: getUrl(item.image),
                }))}
              />
            </div>
          );

        case "singleImage":
          return (
            <div className="pointer-events-none">
              <SingleImage
                image={getUrl(block.data.image)}
                title={block.data.title}
                description={block.data.description}
                className="pointer-events-none"
              />
            </div>
          );

        case "cta":
          return (
            <div className="pointer-events-none">
              <CTA
                title={block.data.title}
                description={block.data.description}
                buttonText={block.data.buttonText}
                image={block.data.image ? getUrl(block.data.image) : undefined}
              />
            </div>
          );

        default:
          return null;
      }
    })();

    return (
      <div
        key={key}
        className={cn(
          "relative group cursor-pointer transition-all duration-200",
          {
            "ring-2 ring-blue-500 ring-offset-2": isSelected,
            "hover:ring-1 hover:ring-gray-300": !isSelected,
          }
        )}
        onClick={() => onBlockClick?.(index)}
      >
        {/* Overlay za hover effect */}
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        {/* Block content */}
        {blockElement}

        {/* Block label */}
        <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {block.type} #{index + 1}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
