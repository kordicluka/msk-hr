import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageGallerySchema, type ImageGalleryData } from "@/schemas/image-gallery";
import { Button } from "@/components/atoms/admin/button";
import { Input } from "@/components/atoms/admin/input";
import { Textarea } from "@/components/atoms/admin/textarea";
import { Label } from "@/components/atoms/admin/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/admin/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import ImageUpload from "@/components/organisms/ImageUpload";
import { Languages } from "lucide-react";

// Tipovi za multilingual podršku
export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type MultiLanguageImageGalleryData = {
  [languageCode: string]: ImageGalleryData;
};

interface ImageGalleryFormProps {
  languages: Language[];
  defaultLanguage: string;
  initialData?: MultiLanguageImageGalleryData;
  onSubmit: (data: MultiLanguageImageGalleryData) => void;
  onCancel?: () => void;
}

export function ImageGalleryForm({
  languages,
  defaultLanguage,
  initialData,
  onSubmit,
  onCancel,
}: ImageGalleryFormProps) {
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage);
  const [formData, setFormData] = useState<MultiLanguageImageGalleryData>(
    initialData || {}
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ImageGalleryData>({
    resolver: zodResolver(ImageGallerySchema),
    defaultValues: formData[activeLanguage] || {
      images: ["", "", "", "", "", "", ""],
      title: "",
      description: "",
    },
  });

  // Sync form data when switching languages
  const currentFormData = watch();

  const handleLanguageChange = (newLanguage: string) => {
    // Save current form data
    setFormData((prev) => ({
      ...prev,
      [activeLanguage]: currentFormData,
    }));

    // Switch to new language
    setActiveLanguage(newLanguage);

    // Load data for new language
    const newLangData = formData[newLanguage] || {
      images: ["", "", "", "", "", "", ""],
      title: "",
      description: "",
    };

    reset(newLangData);
  };

  const handleFormSubmit = (data: ImageGalleryData) => {
    const finalData = {
      ...formData,
      [activeLanguage]: data,
    };
    onSubmit(finalData);
  };

  const getLanguageCompletionStatus = (langCode: string) => {
    const langData = formData[langCode];
    if (!langData) return "empty";
    if (langData.images && langData.images.length === 7 && langData.images.every(img => img.trim())) {
      return "complete";
    }
    return "partial";
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Image Gallery Block
        </CardTitle>
        <CardDescription>
          Configure the image gallery block for multiple languages
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Language Tabs */}
        <Tabs value={activeLanguage} onValueChange={handleLanguageChange}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {languages.map((lang) => (
              <TabsTrigger
                key={lang.code}
                value={lang.code}
                className="flex items-center gap-2 relative"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="hidden sm:inline">{lang.name}</span>
                <span className="sm:hidden">{lang.code.toUpperCase()}</span>

                {/* Completion indicator */}
                <Badge
                  variant={
                    getLanguageCompletionStatus(lang.code) === "complete"
                      ? "default"
                      : getLanguageCompletionStatus(lang.code) === "partial"
                      ? "secondary"
                      : "outline"
                  }
                  className="absolute -top-2 -right-2 h-4 w-4 p-0"
                >
                  {getLanguageCompletionStatus(lang.code) === "complete" && "✓"}
                  {getLanguageCompletionStatus(lang.code) === "partial" && "•"}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {languages.map((lang) => (
            <TabsContent
              key={lang.code}
              value={lang.code}
              className="space-y-6"
            >
              <div className="space-y-6">
                {/* Basic Content */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`title-${lang.code}`}>
                      Title (Optional)
                    </Label>
                    <Input
                      id={`title-${lang.code}`}
                      {...register("title")}
                      placeholder={`Enter title in ${lang.name}`}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`description-${lang.code}`}>
                      Description (Optional)
                    </Label>
                    <Textarea
                      id={`description-${lang.code}`}
                      {...register("description")}
                      placeholder={`Enter description in ${lang.name}`}
                      rows={3}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Images - Fixed 7 images */}
                  <div className="space-y-4">
                    <Label>Images <span className="text-red-500">*</span> (Exactly 7 images required)</Label>

                    {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                      <div key={index} className="space-y-2">
                        <ImageUpload
                          value={watch(`images.${index}`) || ""}
                          onChange={(url) => setValue(`images.${index}`, url)}
                          label={`Image ${index + 1}`}
                          description={`Upload image ${index + 1}`}
                          error={errors.images?.[index]}
                        />
                      </div>
                    ))}

                    {errors.images && (
                      <p className="text-sm text-red-500">
                        {errors.images.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-between pt-4">
                  <div className="flex gap-2">
                    {onCancel && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                  <Button 
                    type="button"
                    onClick={handleSubmit(handleFormSubmit)}
                  >
                    Save Image Gallery Block
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}