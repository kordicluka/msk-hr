import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SingleImageSchema, type SingleImageData } from "@/schemas/single-image";
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

export type MultiLanguageSingleImageData = {
  [languageCode: string]: SingleImageData;
};

interface SingleImageFormProps {
  languages: Language[];
  defaultLanguage: string;
  initialData?: MultiLanguageSingleImageData;
  onSubmit: (data: MultiLanguageSingleImageData) => void;
  onCancel?: () => void;
}

export function SingleImageForm({
  languages,
  defaultLanguage,
  initialData,
  onSubmit,
  onCancel,
}: SingleImageFormProps) {
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage);
  const [formData, setFormData] = useState<MultiLanguageSingleImageData>(
    initialData || {}
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SingleImageData>({
    resolver: zodResolver(SingleImageSchema),
    defaultValues: formData[activeLanguage] || {
      image: "",
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
      image: "",
      title: "",
      description: "",
    };

    reset(newLangData);
  };

  const handleFormSubmit = (data: SingleImageData) => {
    const finalData = {
      ...formData,
      [activeLanguage]: data,
    };
    onSubmit(finalData);
  };

  const getLanguageCompletionStatus = (langCode: string) => {
    const langData = formData[langCode];
    if (!langData) return "empty";
    if (langData.image && langData.image.trim()) {
      return "complete";
    }
    return "partial";
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Single Image Block
        </CardTitle>
        <CardDescription>
          Configure the single image block for multiple languages
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
                {/* Image Upload */}
                <div className="space-y-4">
                  <ImageUpload
                    value={watch("image") || ""}
                    onChange={(url) => setValue("image", url)}
                    label="Image"
                    description="Upload a single image"
                    error={errors.image}
                  />
                  {errors.image && (
                    <p className="text-sm text-red-500">
                      {errors.image.message}
                    </p>
                  )}
                </div>

                {/* Optional Content */}
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
                    Save Single Image Block
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