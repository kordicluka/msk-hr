import { useState, useCallback, useMemo } from "react";
import { ContentPreview } from "./renderer";
import {
  PageTitleForm,
  type MultiLanguagePageTitleData,
} from "@/components/molecules/PageTitleForm";
import {
  StickyScrollableSlidesForm,
  type MultiLanguageStickyScrollableSlidesData,
} from "@/components/molecules/StickyScrollableSlidesForm";
import {
  TwoColumnForm,
  type MultiLanguageTwoColumnData,
} from "@/components/molecules/TwoColumnForm";
import {
  CardSectionForm,
  type MultiLanguageCardSectionData,
} from "@/components/molecules/CardSectionForm";
import {
  ImageGalleryForm,
  type MultiLanguageImageGalleryData,
} from "@/components/molecules/ImageGalleryForm";
import {
  ThreeCardsMovingOnHoverForm,
  type MultiLanguageThreeCardsMovingOnHoverData,
} from "@/components/molecules/ThreeCardsMovingOnHoverForm";
import {
  SingleImageForm,
  type MultiLanguageSingleImageData,
} from "@/components/molecules/SingleImageForm";
import {
  CTAForm,
  type MultiLanguageCTAData,
} from "@/components/molecules/CTAForm";
import { type Content } from "@/types/content";
import {
  createPageTitleBlock,
  createStickyScrollableSlidesBlock,
  createTwoColumnBlock,
  createCardSectionBlock,
  createImageGalleryBlock,
  createThreeCardsMovingOnHoverBlock,
  createSingleImageBlock,
  createCTABlock,
} from "@/schemas/content";
import { createDefaultStickyScrollableSlidesData } from "@/schemas/sticky-scrollable-slides";
import { createDefaultTwoColumnData } from "@/schemas/two-column";
import { createDefaultCardSectionData } from "@/schemas/card-section";
import { createDefaultImageGalleryData } from "@/schemas/image-gallery";
import { createDefaultThreeCardsMovingOnHoverData } from "@/schemas/three-cards-moving-on-hover";
import { createDefaultSingleImageData } from "@/schemas/single-image";
import { createDefaultCTAData } from "@/schemas/cta";
import { Button } from "@/components/atoms/admin/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/admin/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/admin/select";
import { Badge } from "@/components/atoms/badge";
import { ScrollArea } from "@/components/atoms/scroll-area";
import {
  Plus,
  Edit3,
  Trash2,
  MoveUp,
  MoveDown,
  Languages,
  Save,
  X,
} from "lucide-react";

// Tipovi koji bi trebali biti u vašem types/content.ts
export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type MultiLanguageContent = {
  [languageCode: string]: Content;
};

interface ContentEditorProps {
  languages: Language[];
  defaultLanguage: string;
  content: MultiLanguageContent;
  onContentChange: (content: MultiLanguageContent) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

type EditorMode = "preview" | "edit";
type EditingBlock = {
  type: "pageTitle" | "stickyScrollableSlides" | "twoColumn" | "cardSection" | "imageGallery" | "threeCardsMovingOnHover" | "singleImage" | "cta";
  index?: number; // undefined za novi blok
  data?: MultiLanguagePageTitleData | MultiLanguageStickyScrollableSlidesData | MultiLanguageTwoColumnData | MultiLanguageCardSectionData | MultiLanguageImageGalleryData | MultiLanguageThreeCardsMovingOnHoverData | MultiLanguageSingleImageData | MultiLanguageCTAData;
};

export function ContentEditor({
  languages,
  defaultLanguage,
  content,
  onContentChange,
  onSave,
  onCancel,
}: ContentEditorProps) {
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage);
  const [editorMode, setEditorMode] = useState<EditorMode>("preview");
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<
    number | undefined
  >(undefined);
  const [editingBlock, setEditingBlock] = useState<EditingBlock | null>(null);

  const currentContent = useMemo(() => content[activeLanguage] || [], [content, activeLanguage]);

  // Dodaj novi blok
  const handleAddBlock = useCallback(
    (blockType: string) => {
      if (blockType === "pageTitle") {
        // Kreiraj defaultne vrijednosti za sve jezike
        const defaultPageTitleData = {
          title: "New Page Title",
          description: "Add description here...",
          buttonText: "Learn More",
          theme: "default" as const,
          size: "default" as const,
          align: "left" as const,
          buttonVariant: "default" as const,
          href: "/contact",
        };

        const newContent = { ...content };
        const newBlockIndex = currentContent.length;

        // Dodaj blok za sve jezike s defaultnim vrijednostima
        languages.forEach((lang) => {
          if (!newContent[lang.code]) {
            newContent[lang.code] = [];
          }
          const block = createPageTitleBlock(defaultPageTitleData);
          newContent[lang.code].push(block);
        });

        // Ažuriraj content odmah
        onContentChange(newContent);

        // Pripremi edit podatke za sve jezike
        const multiLangData: MultiLanguagePageTitleData = {};
        languages.forEach((lang) => {
          multiLangData[lang.code] = defaultPageTitleData;
        });

        // Selektiraj novi blok i otvori edit
        setSelectedBlockIndex(newBlockIndex);
        setEditingBlock({
          type: "pageTitle",
          index: newBlockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (blockType === "stickyScrollableSlides") {
        // Kreiraj defaultne vrijednosti za StickyScrollableSlides
        const defaultStickyScrollableSlidesData =
          createDefaultStickyScrollableSlidesData();

        const newContent = { ...content };
        const newBlockIndex = currentContent.length;

        // Dodaj blok za sve jezike s defaultnim vrijednostima
        languages.forEach((lang) => {
          if (!newContent[lang.code]) {
            newContent[lang.code] = [];
          }
          const block = createStickyScrollableSlidesBlock(
            defaultStickyScrollableSlidesData
          );
          newContent[lang.code].push(block);
        });

        // Ažuriraj content odmah
        onContentChange(newContent);

        // Pripremi edit podatke za sve jezike
        const multiLangData: MultiLanguageStickyScrollableSlidesData = {};
        languages.forEach((lang) => {
          multiLangData[lang.code] = defaultStickyScrollableSlidesData;
        });

        // Selektiraj novi blok i otvori edit
        setSelectedBlockIndex(newBlockIndex);
        setEditingBlock({
          type: "stickyScrollableSlides",
          index: newBlockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (blockType === "twoColumn") {
        // Kreiraj defaultne vrijednosti za TwoColumn
        const defaultTwoColumnData = createDefaultTwoColumnData();

        const newContent = { ...content };
        const newBlockIndex = currentContent.length;

        // Dodaj blok za sve jezike s defaultnim vrijednostima
        languages.forEach((lang) => {
          if (!newContent[lang.code]) {
            newContent[lang.code] = [];
          }
          const block = createTwoColumnBlock(defaultTwoColumnData);
          newContent[lang.code].push(block);
        });

        // Ažuriraj content odmah
        onContentChange(newContent);

        // Pripremi edit podatke za sve jezike
        const multiLangData: MultiLanguageTwoColumnData = {};
        languages.forEach((lang) => {
          multiLangData[lang.code] = defaultTwoColumnData;
        });

        // Selektiraj novi blok i otvori edit
        setSelectedBlockIndex(newBlockIndex);
        setEditingBlock({
          type: "twoColumn",
          index: newBlockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (blockType === "cardSection") {
        // Kreiraj defaultne vrijednosti za CardSection
        const defaultCardSectionData = createDefaultCardSectionData();

        const newContent = { ...content };
        const newBlockIndex = currentContent.length;

        // Dodaj blok za sve jezike s defaultnim vrijednostima
        languages.forEach((lang) => {
          if (!newContent[lang.code]) {
            newContent[lang.code] = [];
          }
          const block = createCardSectionBlock(defaultCardSectionData);
          newContent[lang.code].push(block);
        });

        // Ažuriraj content odmah
        onContentChange(newContent);

        // Pripremi edit podatke za sve jezike
        const multiLangData: MultiLanguageCardSectionData = {};
        languages.forEach((lang) => {
          multiLangData[lang.code] = defaultCardSectionData;
        });

        // Selektiraj novi blok i otvori edit
        setSelectedBlockIndex(newBlockIndex);
        setEditingBlock({
          type: "cardSection",
          index: newBlockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (blockType === "imageGallery") {
        // Kreiraj defaultne vrijednosti za ImageGallery
        const defaultImageGalleryData = createDefaultImageGalleryData();

        const newContent = { ...content };
        const newBlockIndex = currentContent.length;

        // Dodaj blok za sve jezike s defaultnim vrijednostima
        languages.forEach((lang) => {
          if (!newContent[lang.code]) {
            newContent[lang.code] = [];
          }
          const block = createImageGalleryBlock(defaultImageGalleryData);
          newContent[lang.code].push(block);
        });

        // Ažuriraj content odmah
        onContentChange(newContent);

        // Pripremi edit podatke za sve jezike
        const multiLangData: MultiLanguageImageGalleryData = {};
        languages.forEach((lang) => {
          multiLangData[lang.code] = defaultImageGalleryData;
        });

        // Selektiraj novi blok i otvori edit
        setSelectedBlockIndex(newBlockIndex);
        setEditingBlock({
          type: "imageGallery",
          index: newBlockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (blockType === "threeCardsMovingOnHover") {
        // Kreiraj defaultne vrijednosti za ThreeCardsMovingOnHover
        const defaultThreeCardsMovingOnHoverData = createDefaultThreeCardsMovingOnHoverData();

        const newContent = { ...content };
        const newBlockIndex = currentContent.length;

        // Dodaj blok za sve jezike s defaultnim vrijednostima
        languages.forEach((lang) => {
          if (!newContent[lang.code]) {
            newContent[lang.code] = [];
          }
          const block = createThreeCardsMovingOnHoverBlock(defaultThreeCardsMovingOnHoverData);
          newContent[lang.code].push(block);
        });

        // Ažuriraj content odmah
        onContentChange(newContent);

        // Pripremi edit podatke za sve jezike
        const multiLangData: MultiLanguageThreeCardsMovingOnHoverData = {};
        languages.forEach((lang) => {
          multiLangData[lang.code] = defaultThreeCardsMovingOnHoverData;
        });

        // Selektiraj novi blok i otvori edit
        setSelectedBlockIndex(newBlockIndex);
        setEditingBlock({
          type: "threeCardsMovingOnHover",
          index: newBlockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (blockType === "singleImage") {
        // Kreiraj defaultne vrijednosti za SingleImage
        const defaultSingleImageData = createDefaultSingleImageData();

        const newContent = { ...content };
        const newBlockIndex = currentContent.length;

        // Dodaj blok za sve jezike s defaultnim vrijednostima
        languages.forEach((lang) => {
          if (!newContent[lang.code]) {
            newContent[lang.code] = [];
          }
          const block = createSingleImageBlock(defaultSingleImageData);
          newContent[lang.code].push(block);
        });

        // Ažuriraj content odmah
        onContentChange(newContent);

        // Pripremi edit podatke za sve jezike
        const multiLangData: MultiLanguageSingleImageData = {};
        languages.forEach((lang) => {
          multiLangData[lang.code] = defaultSingleImageData;
        });

        // Selektiraj novi blok i otvori edit
        setSelectedBlockIndex(newBlockIndex);
        setEditingBlock({
          type: "singleImage",
          index: newBlockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (blockType === "cta") {
        // Kreiraj defaultne vrijednosti za CTA
        const defaultCTAData = createDefaultCTAData();

        const newContent = { ...content };
        const newBlockIndex = currentContent.length;

        // Dodaj blok za sve jezike s defaultnim vrijednostima
        languages.forEach((lang) => {
          if (!newContent[lang.code]) {
            newContent[lang.code] = [];
          }
          const block = createCTABlock(defaultCTAData);
          newContent[lang.code].push(block);
        });

        // Ažuriraj content odmah
        onContentChange(newContent);

        // Pripremi edit podatke za sve jezike
        const multiLangData: MultiLanguageCTAData = {};
        languages.forEach((lang) => {
          multiLangData[lang.code] = defaultCTAData;
        });

        // Selektiraj novi blok i otvori edit
        setSelectedBlockIndex(newBlockIndex);
        setEditingBlock({
          type: "cta",
          index: newBlockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      }
    },
    [content, languages, onContentChange, currentContent.length]
  );

  // Uređuj postojeći blok
  const handleEditBlock = useCallback(
    (blockIndex: number) => {
      const currentBlock = currentContent[blockIndex];

      if (currentBlock?.type === "pageTitle") {
        // Pripremi podatke za sve jezike
        const multiLangData: MultiLanguagePageTitleData = {};

        languages.forEach((lang) => {
          const langContent = content[lang.code] || [];
          const langBlock = langContent[blockIndex];
          if (langBlock?.type === "pageTitle") {
            multiLangData[lang.code] = langBlock.data;
          }
        });

        setEditingBlock({
          type: "pageTitle",
          index: blockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (currentBlock?.type === "stickyScrollableSlides") {
        // Pripremi podatke za sve jezike za StickyScrollableSlides
        const multiLangData: MultiLanguageStickyScrollableSlidesData = {};

        languages.forEach((lang) => {
          const langContent = content[lang.code] || [];
          const langBlock = langContent[blockIndex];
          if (langBlock?.type === "stickyScrollableSlides") {
            multiLangData[lang.code] = langBlock.data;
          }
        });

        setEditingBlock({
          type: "stickyScrollableSlides",
          index: blockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (currentBlock?.type === "twoColumn") {
        // Pripremi podatke za sve jezike za TwoColumn
        const multiLangData: MultiLanguageTwoColumnData = {};

        languages.forEach((lang) => {
          const langContent = content[lang.code] || [];
          const langBlock = langContent[blockIndex];
          if (langBlock?.type === "twoColumn") {
            multiLangData[lang.code] = langBlock.data;
          }
        });

        setEditingBlock({
          type: "twoColumn",
          index: blockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (currentBlock?.type === "cardSection") {
        // Pripremi podatke za sve jezike za CardSection
        const multiLangData: MultiLanguageCardSectionData = {};

        languages.forEach((lang) => {
          const langContent = content[lang.code] || [];
          const langBlock = langContent[blockIndex];
          if (langBlock?.type === "cardSection") {
            multiLangData[lang.code] = langBlock.data;
          }
        });

        setEditingBlock({
          type: "cardSection",
          index: blockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (currentBlock?.type === "imageGallery") {
        // Pripremi podatke za sve jezike za ImageGallery
        const multiLangData: MultiLanguageImageGalleryData = {};

        languages.forEach((lang) => {
          const langContent = content[lang.code] || [];
          const langBlock = langContent[blockIndex];
          if (langBlock?.type === "imageGallery") {
            multiLangData[lang.code] = langBlock.data;
          }
        });

        setEditingBlock({
          type: "imageGallery",
          index: blockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (currentBlock?.type === "threeCardsMovingOnHover") {
        // Pripremi podatke za sve jezike za ThreeCardsMovingOnHover
        const multiLangData: MultiLanguageThreeCardsMovingOnHoverData = {};

        languages.forEach((lang) => {
          const langContent = content[lang.code] || [];
          const langBlock = langContent[blockIndex];
          if (langBlock?.type === "threeCardsMovingOnHover") {
            multiLangData[lang.code] = langBlock.data;
          }
        });

        setEditingBlock({
          type: "threeCardsMovingOnHover",
          index: blockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (currentBlock?.type === "singleImage") {
        // Pripremi podatke za sve jezike za SingleImage
        const multiLangData: MultiLanguageSingleImageData = {};

        languages.forEach((lang) => {
          const langContent = content[lang.code] || [];
          const langBlock = langContent[blockIndex];
          if (langBlock?.type === "singleImage") {
            multiLangData[lang.code] = langBlock.data;
          }
        });

        setEditingBlock({
          type: "singleImage",
          index: blockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      } else if (currentBlock?.type === "cta") {
        // Pripremi podatke za sve jezike za CTA
        const multiLangData: MultiLanguageCTAData = {};

        languages.forEach((lang) => {
          const langContent = content[lang.code] || [];
          const langBlock = langContent[blockIndex];
          if (langBlock?.type === "cta") {
            multiLangData[lang.code] = langBlock.data;
          }
        });

        setEditingBlock({
          type: "cta",
          index: blockIndex,
          data: multiLangData,
        });
        setEditorMode("edit");
      }
    },
    [currentContent, content, languages]
  );

  // Obriši blok
  const handleDeleteBlock = useCallback(
    (blockIndex: number) => {
      const newContent = { ...content };

      languages.forEach((lang) => {
        const langContent = newContent[lang.code] || [];
        if (langContent[blockIndex]) {
          langContent.splice(blockIndex, 1);
          newContent[lang.code] = [...langContent];
        }
      });

      onContentChange(newContent);
      setSelectedBlockIndex(undefined);
    },
    [content, languages, onContentChange]
  );

  // Pomijeri blok
  const handleMoveBlock = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= currentContent.length) return;

      const newContent = { ...content };

      languages.forEach((lang) => {
        const langContent = [...(newContent[lang.code] || [])];
        if (langContent[fromIndex]) {
          const [movedBlock] = langContent.splice(fromIndex, 1);
          langContent.splice(toIndex, 0, movedBlock);
          newContent[lang.code] = langContent;
        }
      });

      onContentChange(newContent);
      setSelectedBlockIndex(toIndex);
    },
    [content, languages, onContentChange, currentContent.length]
  );

  // Spremi blok
  const handleSaveBlock = useCallback(
    (
      data: MultiLanguagePageTitleData | MultiLanguageStickyScrollableSlidesData | MultiLanguageTwoColumnData | MultiLanguageCardSectionData | MultiLanguageImageGalleryData | MultiLanguageThreeCardsMovingOnHoverData | MultiLanguageSingleImageData | MultiLanguageCTAData
    ) => {
      const newContent = { ...content };

      if (editingBlock?.type === "pageTitle") {
        const pageData = data as MultiLanguagePageTitleData;

        languages.forEach((lang) => {
          const langData = pageData[lang.code];
          if (langData && langData.title.trim()) {
            const block = createPageTitleBlock(langData);

            if (!newContent[lang.code]) {
              newContent[lang.code] = [];
            }

            if (editingBlock?.index !== undefined) {
              // Uređuj postojeći blok
              newContent[lang.code][editingBlock.index] = block;
            } else {
              // Dodaj novi blok
              newContent[lang.code].push(block);
            }
          }
        });
      } else if (editingBlock?.type === "stickyScrollableSlides") {
        const slidesData = data as MultiLanguageStickyScrollableSlidesData;

        languages.forEach((lang) => {
          const langData = slidesData[lang.code];
          if (langData && langData.items && langData.items.length > 0) {
            const block = createStickyScrollableSlidesBlock(langData);

            if (!newContent[lang.code]) {
              newContent[lang.code] = [];
            }

            if (editingBlock?.index !== undefined) {
              // Uređuj postojeći blok
              newContent[lang.code][editingBlock.index] = block;
            } else {
              // Dodaj novi blok
              newContent[lang.code].push(block);
            }
          }
        });
      } else if (editingBlock?.type === "twoColumn") {
        const twoColumnData = data as MultiLanguageTwoColumnData;

        languages.forEach((lang) => {
          const langData = twoColumnData[lang.code];
          if (langData && langData.title.trim() && langData.paragraph.trim()) {
            const block = createTwoColumnBlock(langData);

            if (!newContent[lang.code]) {
              newContent[lang.code] = [];
            }

            if (editingBlock?.index !== undefined) {
              // Uređuj postojeći blok
              newContent[lang.code][editingBlock.index] = block;
            } else {
              // Dodaj novi blok
              newContent[lang.code].push(block);
            }
          }
        });
      } else if (editingBlock?.type === "cardSection") {
        const cardSectionData = data as MultiLanguageCardSectionData;

        languages.forEach((lang) => {
          const langData = cardSectionData[lang.code];
          if (langData && langData.title.trim() && langData.description.trim()) {
            const block = createCardSectionBlock(langData);

            if (!newContent[lang.code]) {
              newContent[lang.code] = [];
            }

            if (editingBlock?.index !== undefined) {
              // Uređuj postojeći blok
              newContent[lang.code][editingBlock.index] = block;
            } else {
              // Dodaj novi blok
              newContent[lang.code].push(block);
            }
          }
        });
      } else if (editingBlock?.type === "imageGallery") {
        const imageGalleryData = data as MultiLanguageImageGalleryData;

        languages.forEach((lang) => {
          const langData = imageGalleryData[lang.code];
          if (langData && langData.images && langData.images.length > 0 && langData.images.every(img => img.trim())) {
            const block = createImageGalleryBlock(langData);

            if (!newContent[lang.code]) {
              newContent[lang.code] = [];
            }

            if (editingBlock?.index !== undefined) {
              // Uređuj postojeći blok
              newContent[lang.code][editingBlock.index] = block;
            } else {
              // Dodaj novi blok
              newContent[lang.code].push(block);
            }
          }
        });
      } else if (editingBlock?.type === "threeCardsMovingOnHover") {
        const threeCardsData = data as MultiLanguageThreeCardsMovingOnHoverData;

        languages.forEach((lang) => {
          const langData = threeCardsData[lang.code];
          if (langData && langData.items && langData.items.length === 3 && 
              langData.items.every(item => item.title.trim() && item.description.trim() && item.image.trim() && item.number.trim())) {
            const block = createThreeCardsMovingOnHoverBlock(langData);

            if (!newContent[lang.code]) {
              newContent[lang.code] = [];
            }

            if (editingBlock?.index !== undefined) {
              // Uređuj postojeći blok
              newContent[lang.code][editingBlock.index] = block;
            } else {
              // Dodaj novi blok
              newContent[lang.code].push(block);
            }
          }
        });
      } else if (editingBlock?.type === "singleImage") {
        const singleImageData = data as MultiLanguageSingleImageData;

        languages.forEach((lang) => {
          const langData = singleImageData[lang.code];
          if (langData && langData.image.trim()) {
            const block = createSingleImageBlock(langData);

            if (!newContent[lang.code]) {
              newContent[lang.code] = [];
            }

            if (editingBlock?.index !== undefined) {
              // Uređuj postojeći blok
              newContent[lang.code][editingBlock.index] = block;
            } else {
              // Dodaj novi blok
              newContent[lang.code].push(block);
            }
          }
        });
      } else if (editingBlock?.type === "cta") {
        const ctaData = data as MultiLanguageCTAData;

        languages.forEach((lang) => {
          const langData = ctaData[lang.code];
          if (langData && langData.title.trim() && langData.description.trim() && langData.buttonText.trim()) {
            const block = createCTABlock(langData);

            if (!newContent[lang.code]) {
              newContent[lang.code] = [];
            }

            if (editingBlock?.index !== undefined) {
              // Uređuj postojeći blok
              newContent[lang.code][editingBlock.index] = block;
            } else {
              // Dodaj novi blok
              newContent[lang.code].push(block);
            }
          }
        });
      }

      onContentChange(newContent);
      setEditingBlock(null);
      setEditorMode("preview");
    },
    [content, languages, onContentChange, editingBlock]
  );

  // Otkaži uređivanje
  const handleCancelEdit = useCallback(() => {
    setEditingBlock(null);
    setEditorMode("preview");
  }, []);

  // Provjeri da li je content potpun za jezik
  const getLanguageCompletionStatus = useCallback(
    (langCode: string) => {
      const langContent = content[langCode];
      if (!langContent || langContent.length === 0) return "empty";

      const hasContent = langContent.some((block) => {
        if (block.type === "pageTitle") {
          return block.data.title.trim() !== "";
        }
        if (block.type === "stickyScrollableSlides") {
          return (
            block.data.items &&
            block.data.items.length > 0 &&
            block.data.items.some((item) => item.title.trim() !== "")
          );
        }
        if (block.type === "twoColumn") {
          return block.data.title.trim() !== "" && block.data.paragraph.trim() !== "";
        }
        if (block.type === "cardSection") {
          return block.data.title.trim() !== "" && block.data.description.trim() !== "";
        }
        if (block.type === "imageGallery") {
          return block.data.images && block.data.images.length > 0 && block.data.images.every(img => img.trim() !== "");
        }
        if (block.type === "threeCardsMovingOnHover") {
          return block.data.items && block.data.items.length === 3 && 
                 block.data.items.every(item => item.title.trim() !== "" && item.description.trim() !== "" && item.image.trim() !== "" && item.number.trim() !== "");
        }
        if (block.type === "singleImage") {
          return block.data.image.trim() !== "";
        }
        if (block.type === "cta") {
          return block.data.title.trim() !== "" && block.data.description.trim() !== "" && block.data.buttonText.trim() !== "";
        }
        return true;
      });

      return hasContent ? "complete" : "partial";
    },
    [content]
  );

  return (
    <div className="flex h-[88.5vh] relative bg-gray-50">
      {/* Sidebar */}
      <div className="w-200 h-full bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Content Editor</h2>
            <div className="flex gap-2">
              {onSave && (
                <Button size="sm" onClick={onSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              )}
              {onCancel && (
                <Button size="sm" variant="outline" onClick={onCancel}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Language selector */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span className="text-sm font-medium">Language</span>
            </div>
            <Select value={activeLanguage} onValueChange={setActiveLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      <Badge
                        variant={
                          getLanguageCompletionStatus(lang.code) === "complete"
                            ? "default"
                            : getLanguageCompletionStatus(lang.code) ===
                              "partial"
                            ? "secondary"
                            : "outline"
                        }
                        className="ml-auto"
                      >
                        {getLanguageCompletionStatus(lang.code)}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-4">
          {editorMode === "preview" ? (
            <div className="space-y-4">
              {/* Add Block Button */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Add Content Block</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock("pageTitle")}
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Page Title
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock("stickyScrollableSlides")}
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Sticky Scrollable Slides
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock("twoColumn")}
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Two Column
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock("cardSection")}
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Card Section
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock("imageGallery")}
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Image Gallery
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock("threeCardsMovingOnHover")}
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Three Cards Moving
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock("singleImage")}
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Single Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock("cta")}
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    CTA
                  </Button>
                </CardContent>
              </Card>

              {/* Block List */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Content Blocks</CardTitle>
                  <CardDescription>
                    {currentContent.length} blocks in{" "}
                    {languages.find((l) => l.code === activeLanguage)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentContent.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No blocks yet. Add your first block above.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentContent.map((block, index) => (
                        <div
                          key={index}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedBlockIndex === index
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedBlockIndex(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm capitalize">
                                {block.type} #{index + 1}
                              </div>
                              {block.type === "pageTitle" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {block.data.title || "Untitled"}
                                </div>
                              )}
                              {block.type === "stickyScrollableSlides" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {block.data.items?.length || 0} items
                                </div>
                              )}
                              {block.type === "twoColumn" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {block.data.title || "Untitled"}
                                </div>
                              )}
                              {block.type === "cardSection" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {block.data.title || "Untitled"}
                                </div>
                              )}
                              {block.type === "imageGallery" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {block.data.images?.length || 0} images
                                </div>
                              )}
                              {block.type === "threeCardsMovingOnHover" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {block.data.title || "Three Cards"}
                                </div>
                              )}
                              {block.type === "singleImage" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {block.data.title || "Single Image"}
                                </div>
                              )}
                              {block.type === "cta" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {block.data.title || "CTA Block"}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditBlock(index);
                                }}
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveBlock(index, index - 1);
                                }}
                                disabled={index === 0}
                              >
                                <MoveUp className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveBlock(index, index + 1);
                                }}
                                disabled={index === currentContent.length - 1}
                              >
                                <MoveDown className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteBlock(index);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-4">
              {editingBlock?.type === "pageTitle" && (
                <PageTitleForm
                  languages={languages}
                  defaultLanguage={activeLanguage}
                  initialData={editingBlock.data as MultiLanguagePageTitleData}
                  onSubmit={handleSaveBlock}
                  onCancel={handleCancelEdit}
                />
              )}
              {editingBlock?.type === "stickyScrollableSlides" && (
                <StickyScrollableSlidesForm
                  languages={languages}
                  defaultLanguage={activeLanguage}
                  initialData={
                    editingBlock.data as MultiLanguageStickyScrollableSlidesData
                  }
                  onSubmit={handleSaveBlock}
                  onCancel={handleCancelEdit}
                />
              )}
              {editingBlock?.type === "twoColumn" && (
                <TwoColumnForm
                  languages={languages}
                  defaultLanguage={activeLanguage}
                  initialData={editingBlock.data as MultiLanguageTwoColumnData}
                  onSubmit={handleSaveBlock}
                  onCancel={handleCancelEdit}
                />
              )}
              {editingBlock?.type === "cardSection" && (
                <CardSectionForm
                  languages={languages}
                  defaultLanguage={activeLanguage}
                  initialData={editingBlock.data as MultiLanguageCardSectionData}
                  onSubmit={handleSaveBlock}
                  onCancel={handleCancelEdit}
                />
              )}
              {editingBlock?.type === "imageGallery" && (
                <ImageGalleryForm
                  languages={languages}
                  defaultLanguage={activeLanguage}
                  initialData={editingBlock.data as MultiLanguageImageGalleryData}
                  onSubmit={handleSaveBlock}
                  onCancel={handleCancelEdit}
                />
              )}
              {editingBlock?.type === "threeCardsMovingOnHover" && (
                <ThreeCardsMovingOnHoverForm
                  languages={languages}
                  defaultLanguage={activeLanguage}
                  initialData={editingBlock.data as MultiLanguageThreeCardsMovingOnHoverData}
                  onSubmit={handleSaveBlock}
                  onCancel={handleCancelEdit}
                />
              )}
              {editingBlock?.type === "singleImage" && (
                <SingleImageForm
                  languages={languages}
                  defaultLanguage={activeLanguage}
                  initialData={editingBlock.data as MultiLanguageSingleImageData}
                  onSubmit={handleSaveBlock}
                  onCancel={handleCancelEdit}
                />
              )}
              {editingBlock?.type === "cta" && (
                <CTAForm
                  languages={languages}
                  defaultLanguage={activeLanguage}
                  initialData={editingBlock.data as MultiLanguageCTAData}
                  onSubmit={handleSaveBlock}
                  onCancel={handleCancelEdit}
                />
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Preview Content */}
        <ScrollArea className="flex-1">
          <ContentPreview
            content={currentContent}
            onBlockClick={setSelectedBlockIndex}
            selectedBlockIndex={selectedBlockIndex}
            className="min-h-full"
          />
        </ScrollArea>
      </div>
    </div>
  );
}
