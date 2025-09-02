import { type PageTitleDataOnly } from "@/schemas/page-title";
import { type StickyScrollableSlidesData } from "@/schemas/sticky-scrollable-slides";
import { type TwoColumnData } from "@/schemas/two-column";
import { type CTAData } from "@/schemas/cta";

export type CardSectionData = {
  title: string;
  description: string;
  image: string;
  align?: "left" | "right";
};

export type ImageGalleryData = {
  images: string[];
  title?: string;
  description?: string;
};

export type ThreeCardsMovingOnHoverData = {
  items: {
    number: string;
    title: string;
    description: string;
    image: string;
  }[];
  title?: string;
  description?: string;
};

export type SingleImageData = {
  image: string;
  title?: string;
  description?: string;
};

export type PageTitleBlock = {
  type: "pageTitle";
  data: PageTitleDataOnly;
};

export type StickyScrollableSlidesBlock = {
  type: "stickyScrollableSlides";
  data: StickyScrollableSlidesData;
};

export type TwoColumnBlock = {
  type: "twoColumn";
  data: TwoColumnData;
};

export type CardSectionBlock = {
  type: "cardSection";
  data: CardSectionData;
};

export type ImageGalleryBlock = {
  type: "imageGallery";
  data: ImageGalleryData;
};

export type ThreeCardsMovingOnHoverBlock = {
  type: "threeCardsMovingOnHover";
  data: ThreeCardsMovingOnHoverData;
};

export type SingleImageBlock = {
  type: "singleImage";
  data: SingleImageData;
};

export type CTABlock = {
  type: "cta";
  data: CTAData;
};

export type ContentBlock = PageTitleBlock | StickyScrollableSlidesBlock | TwoColumnBlock | CardSectionBlock | ImageGalleryBlock | ThreeCardsMovingOnHoverBlock | SingleImageBlock | CTABlock;

export type Content = ContentBlock[];
