import { z } from "zod";
import { PageTitleSchema } from "./page-title";
import { StickyScrollableSlidesSchema } from "./sticky-scrollable-slides";
import { TwoColumnSchema } from "./two-column";
import { CardSectionSchema } from "./card-section";
import { ImageGallerySchema } from "./image-gallery";
import { ThreeCardsMovingOnHoverSchema } from "./three-cards-moving-on-hover";
import { SingleImageSchema } from "./single-image";
import { CTASchema } from "./cta";

// Schema za PageTitle blok
export const PageTitleBlockSchema = z.object({
  type: z.literal("pageTitle"),
  data: PageTitleSchema,
});

export type PageTitleBlock = z.infer<typeof PageTitleBlockSchema>;

// Schema za StickyScrollableSlides blok
export const StickyScrollableSlidesBlockSchema = z.object({
  type: z.literal("stickyScrollableSlides"),
  data: StickyScrollableSlidesSchema,
});

export type StickyScrollableSlidesBlock = z.infer<typeof StickyScrollableSlidesBlockSchema>;

// Schema za TwoColumn blok
export const TwoColumnBlockSchema = z.object({
  type: z.literal("twoColumn"),
  data: TwoColumnSchema,
});

export type TwoColumnBlock = z.infer<typeof TwoColumnBlockSchema>;

// Schema za CardSection blok
export const CardSectionBlockSchema = z.object({
  type: z.literal("cardSection"),
  data: CardSectionSchema,
});

export type CardSectionBlock = z.infer<typeof CardSectionBlockSchema>;

// Schema za ImageGallery blok
export const ImageGalleryBlockSchema = z.object({
  type: z.literal("imageGallery"),
  data: ImageGallerySchema,
});

export type ImageGalleryBlock = z.infer<typeof ImageGalleryBlockSchema>;

// Schema za ThreeCardsMovingOnHover blok
export const ThreeCardsMovingOnHoverBlockSchema = z.object({
  type: z.literal("threeCardsMovingOnHover"),
  data: ThreeCardsMovingOnHoverSchema,
});

export type ThreeCardsMovingOnHoverBlock = z.infer<typeof ThreeCardsMovingOnHoverBlockSchema>;

// Schema za SingleImage blok
export const SingleImageBlockSchema = z.object({
  type: z.literal("singleImage"),
  data: SingleImageSchema,
});

export type SingleImageBlock = z.infer<typeof SingleImageBlockSchema>;

// Schema za CTA blok
export const CTABlockSchema = z.object({
  type: z.literal("cta"),
  data: CTASchema,
});

export type CTABlock = z.infer<typeof CTABlockSchema>;

// Schema za ContentBlock (union svih mogućih blokova)
export const ContentBlockSchema = z.discriminatedUnion("type", [
  PageTitleBlockSchema,
  StickyScrollableSlidesBlockSchema,
  TwoColumnBlockSchema,
  CardSectionBlockSchema,
  ImageGalleryBlockSchema,
  ThreeCardsMovingOnHoverBlockSchema,
  SingleImageBlockSchema,
  CTABlockSchema,
  // Ovde možete dodati druge blokove u budućnosti:
  // TextBlockSchema,
  // VideoBlockSchema,
  // itd.
]);

export type ContentBlock = z.infer<typeof ContentBlockSchema>;

// Schema za Content (niz blokova)
export const ContentSchema = z.array(ContentBlockSchema);

export type Content = z.infer<typeof ContentSchema>;

// Utility funkcije za validaciju
export const validateContentBlock = (data: unknown) => {
  return ContentBlockSchema.safeParse(data);
};

export const validateContent = (data: unknown) => {
  return ContentSchema.safeParse(data);
};

// Funkcija za kreiranje novog PageTitle bloka
export const createPageTitleBlock = (
  data: z.infer<typeof PageTitleSchema>
): PageTitleBlock => {
  return {
    type: "pageTitle",
    data,
  };
};

// Funkcija za kreiranje novog StickyScrollableSlides bloka
export const createStickyScrollableSlidesBlock = (
  data: z.infer<typeof StickyScrollableSlidesSchema>
): StickyScrollableSlidesBlock => {
  return {
    type: "stickyScrollableSlides",
    data,
  };
};

// Funkcija za kreiranje novog TwoColumn bloka
export const createTwoColumnBlock = (
  data: z.infer<typeof TwoColumnSchema>
): TwoColumnBlock => {
  return {
    type: "twoColumn",
    data,
  };
};

// Funkcija za kreiranje novog CardSection bloka
export const createCardSectionBlock = (
  data: z.infer<typeof CardSectionSchema>
): CardSectionBlock => {
  return {
    type: "cardSection",
    data,
  };
};

// Funkcija za kreiranje novog ImageGallery bloka
export const createImageGalleryBlock = (
  data: z.infer<typeof ImageGallerySchema>
): ImageGalleryBlock => {
  return {
    type: "imageGallery",
    data,
  };
};

// Funkcija za kreiranje novog ThreeCardsMovingOnHover bloka
export const createThreeCardsMovingOnHoverBlock = (
  data: z.infer<typeof ThreeCardsMovingOnHoverSchema>
): ThreeCardsMovingOnHoverBlock => {
  return {
    type: "threeCardsMovingOnHover",
    data,
  };
};

// Funkcija za kreiranje novog SingleImage bloka
export const createSingleImageBlock = (
  data: z.infer<typeof SingleImageSchema>
): SingleImageBlock => {
  return {
    type: "singleImage",
    data,
  };
};

// Funkcija za kreiranje novog CTA bloka
export const createCTABlock = (
  data: z.infer<typeof CTASchema>
): CTABlock => {
  return {
    type: "cta",
    data,
  };
};

// Funkcije za validaciju specifičnih tipova blokova
export const validatePageTitleBlock = (data: unknown) => {
  return PageTitleBlockSchema.safeParse(data);
};

export const validateStickyScrollableSlidesBlock = (data: unknown) => {
  return StickyScrollableSlidesBlockSchema.safeParse(data);
};

export const validateTwoColumnBlock = (data: unknown) => {
  return TwoColumnBlockSchema.safeParse(data);
};

export const validateCardSectionBlock = (data: unknown) => {
  return CardSectionBlockSchema.safeParse(data);
};

export const validateImageGalleryBlock = (data: unknown) => {
  return ImageGalleryBlockSchema.safeParse(data);
};

export const validateThreeCardsMovingOnHoverBlock = (data: unknown) => {
  return ThreeCardsMovingOnHoverBlockSchema.safeParse(data);
};

export const validateSingleImageBlock = (data: unknown) => {
  return SingleImageBlockSchema.safeParse(data);
};

export const validateCTABlock = (data: unknown) => {
  return CTABlockSchema.safeParse(data);
};

// Type guards
export const isPageTitleBlock = (
  block: ContentBlock
): block is PageTitleBlock => {
  return block.type === "pageTitle";
};

export const isStickyScrollableSlidesBlock = (
  block: ContentBlock
): block is StickyScrollableSlidesBlock => {
  return block.type === "stickyScrollableSlides";
};

export const isTwoColumnBlock = (
  block: ContentBlock
): block is TwoColumnBlock => {
  return block.type === "twoColumn";
};

export const isCardSectionBlock = (
  block: ContentBlock
): block is CardSectionBlock => {
  return block.type === "cardSection";
};

export const isImageGalleryBlock = (
  block: ContentBlock
): block is ImageGalleryBlock => {
  return block.type === "imageGallery";
};

export const isThreeCardsMovingOnHoverBlock = (
  block: ContentBlock
): block is ThreeCardsMovingOnHoverBlock => {
  return block.type === "threeCardsMovingOnHover";
};

export const isSingleImageBlock = (
  block: ContentBlock
): block is SingleImageBlock => {
  return block.type === "singleImage";
};

export const isCTABlock = (
  block: ContentBlock
): block is CTABlock => {
  return block.type === "cta";
};

export const getPageTitleBlocks = (content: Content): PageTitleBlock[] => {
  return content.filter(isPageTitleBlock);
};

export const getStickyScrollableSlidesBlocks = (content: Content): StickyScrollableSlidesBlock[] => {
  return content.filter(isStickyScrollableSlidesBlock);
};

export const getTwoColumnBlocks = (content: Content): TwoColumnBlock[] => {
  return content.filter(isTwoColumnBlock);
};

export const getCardSectionBlocks = (content: Content): CardSectionBlock[] => {
  return content.filter(isCardSectionBlock);
};

export const getImageGalleryBlocks = (content: Content): ImageGalleryBlock[] => {
  return content.filter(isImageGalleryBlock);
};

export const getThreeCardsMovingOnHoverBlocks = (content: Content): ThreeCardsMovingOnHoverBlock[] => {
  return content.filter(isThreeCardsMovingOnHoverBlock);
};

export const getSingleImageBlocks = (content: Content): SingleImageBlock[] => {
  return content.filter(isSingleImageBlock);
};

export const getCTABlocks = (content: Content): CTABlock[] => {
  return content.filter(isCTABlock);
};

// Schema za dodavanje novog bloka u content
export const AddContentBlockSchema = z.object({
  index: z.number().int().min(0).optional(),
  block: ContentBlockSchema,
});

export type AddContentBlockData = z.infer<typeof AddContentBlockSchema>;

export const UpdateContentBlockSchema = z.object({
  index: z.number().int().min(0),
  block: ContentBlockSchema,
});

export type UpdateContentBlockData = z.infer<typeof UpdateContentBlockSchema>;

export const DeleteContentBlockSchema = z.object({
  index: z.number().int().min(0),
});

export type DeleteContentBlockData = z.infer<typeof DeleteContentBlockSchema>;
