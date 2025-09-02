import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CTAFormSchema,
  type CTAFormData,
  createDefaultCTAData,
} from "@/schemas/cta";
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
import { MessageSquare } from "lucide-react";

// Tipovi za multilingual podršku
export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type MultiLanguageCTAData = {
  [languageCode: string]: CTAFormData;
};

interface CTAFormProps {
  languages: Language[];
  defaultLanguage: string;
  initialData?: MultiLanguageCTAData;
  onSubmit: (data: MultiLanguageCTAData) => void;
  onCancel?: () => void;
}

export function CTAForm({
  languages,
  defaultLanguage,
  initialData,
  onSubmit,
  onCancel,
}: CTAFormProps) {
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage);
  const [formData, setFormData] =
    useState<MultiLanguageCTAData>(initialData || {});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CTAFormData>({
    resolver: zodResolver(CTAFormSchema),
    defaultValues: formData[activeLanguage] || createDefaultCTAData(),
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
    const newLangData = formData[newLanguage] || createDefaultCTAData();

    reset(newLangData);
  };

  const handleFormSubmit = (data: CTAFormData) => {
    console.log("=== CTA FORM SUBMIT DEBUG ===");
    console.log("Current form data:", data);
    console.log("Form errors:", errors);
    console.log("Active language:", activeLanguage);
    console.log("All form data:", formData);
    
    const finalData = {
      ...formData,
      [activeLanguage]: data,
    };
    
    console.log("Final data to submit:", finalData);
    console.log("=== END CTA FORM SUBMIT DEBUG ===");
    
    onSubmit(finalData);
  };

  const getLanguageCompletionStatus = (langCode: string) => {
    const langData = formData[langCode];
    if (!langData) return "empty";

    const hasRequiredFields = 
      langData.title.trim() && 
      langData.description.trim() && 
      langData.buttonText.trim();

    return hasRequiredFields ? "complete" : "partial";
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          CTA Block
        </CardTitle>
        <CardDescription>
          Configure the Call-to-Action block for multiple languages
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
                {/* Content Fields */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`title-${lang.code}`}>
                        Title <span className="text-red-500">*</span>
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
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id={`description-${lang.code}`}
                        {...register("description")}
                        placeholder={`Enter description in ${lang.name}`}
                        rows={4}
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`buttonText-${lang.code}`}>
                        Button Text <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`buttonText-${lang.code}`}
                        {...register("buttonText")}
                        placeholder={`Enter button text in ${lang.name}`}
                        className={errors.buttonText ? "border-red-500" : ""}
                      />
                      {errors.buttonText && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.buttonText.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Image Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Background Image</CardTitle>
                    <CardDescription>
                      Upload a background image for the CTA section (optional)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      value={watch("image") || ""}
                      onChange={(url) => setValue("image", url)}
                      label="Background Image"
                      description="Upload a background image for the CTA"
                      error={errors.image}
                    />
                  </CardContent>
                </Card>

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
                    onClick={handleSubmit(
                      handleFormSubmit,
                      (errors) => {
                        console.log("=== CTA VALIDATION ERRORS ===");
                        console.log("All validation errors:", errors);
                        console.log("Current form state:", watch());
                        console.log("=== END CTA VALIDATION ERRORS ===");
                      }
                    )}
                  >
                    Save CTA Block
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