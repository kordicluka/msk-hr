import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ThreeCardsMovingOnHoverSchema, 
  type ThreeCardsMovingOnHoverData 
} from "@/schemas/three-cards-moving-on-hover";
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

export type MultiLanguageThreeCardsMovingOnHoverData = {
  [languageCode: string]: ThreeCardsMovingOnHoverData;
};

interface ThreeCardsMovingOnHoverFormProps {
  languages: Language[];
  defaultLanguage: string;
  initialData?: MultiLanguageThreeCardsMovingOnHoverData;
  onSubmit: (data: MultiLanguageThreeCardsMovingOnHoverData) => void;
  onCancel?: () => void;
}

export function ThreeCardsMovingOnHoverForm({
  languages,
  defaultLanguage,
  initialData,
  onSubmit,
  onCancel,
}: ThreeCardsMovingOnHoverFormProps) {
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage);
  const [formData, setFormData] = useState<MultiLanguageThreeCardsMovingOnHoverData>(
    initialData || {}
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ThreeCardsMovingOnHoverData>({
    resolver: zodResolver(ThreeCardsMovingOnHoverSchema),
    defaultValues: formData[activeLanguage] || {
      title: "",
      description: "",
      items: [
        { number: "01", title: "", description: "", image: "" },
        { number: "02", title: "", description: "", image: "" },
        { number: "03", title: "", description: "", image: "" },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
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
      title: "",
      description: "",
      items: [
        { number: "01", title: "", description: "", image: "" },
        { number: "02", title: "", description: "", image: "" },
        { number: "03", title: "", description: "", image: "" },
      ],
    };

    reset(newLangData);
  };

  const handleFormSubmit = (data: ThreeCardsMovingOnHoverData) => {
    const finalData = {
      ...formData,
      [activeLanguage]: data,
    };
    onSubmit(finalData);
  };

  const getLanguageCompletionStatus = (langCode: string) => {
    const langData = formData[langCode];
    if (!langData) return "empty";
    
    const hasValidItems = langData.items && 
      langData.items.length === 3 && 
      langData.items.every(item => 
        item.title.trim() && 
        item.description.trim() && 
        item.image.trim() && 
        item.number.trim()
      );
    
    if (hasValidItems) return "complete";
    return "partial";
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Three Cards Moving On Hover Block
        </CardTitle>
        <CardDescription>
          Configure the three cards component with hover effects for multiple languages
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
                {/* Section Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`title-${lang.code}`}>
                      Section Title (Optional)
                    </Label>
                    <Input
                      id={`title-${lang.code}`}
                      {...register("title")}
                      placeholder={`Enter section title in ${lang.name}`}
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
                      Section Description (Optional)
                    </Label>
                    <Textarea
                      id={`description-${lang.code}`}
                      {...register("description")}
                      placeholder={`Enter section description in ${lang.name}`}
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

                {/* Cards */}
                <div className="space-y-6">
                  <Label className="text-lg font-semibold">
                    Cards <span className="text-red-500">*</span>
                  </Label>
                  
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base">
                          Card {index + 1}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`items.${index}.number-${lang.code}`}>
                              Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`items.${index}.number-${lang.code}`}
                              {...register(`items.${index}.number`)}
                              placeholder={`0${index + 1}`}
                              className={errors.items?.[index]?.number ? "border-red-500" : ""}
                            />
                            {errors.items?.[index]?.number && (
                              <p className="text-sm text-red-500 mt-1">
                                {errors.items[index]?.number?.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor={`items.${index}.title-${lang.code}`}>
                              Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`items.${index}.title-${lang.code}`}
                              {...register(`items.${index}.title`)}
                              placeholder={`Enter title for card ${index + 1} in ${lang.name}`}
                              className={errors.items?.[index]?.title ? "border-red-500" : ""}
                            />
                            {errors.items?.[index]?.title && (
                              <p className="text-sm text-red-500 mt-1">
                                {errors.items[index]?.title?.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`items.${index}.description-${lang.code}`}>
                            Description <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id={`items.${index}.description-${lang.code}`}
                            {...register(`items.${index}.description`)}
                            placeholder={`Enter description for card ${index + 1} in ${lang.name}`}
                            rows={3}
                            className={errors.items?.[index]?.description ? "border-red-500" : ""}
                          />
                          {errors.items?.[index]?.description && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.items[index]?.description?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <ImageUpload
                            value={watch(`items.${index}.image`) || ""}
                            onChange={(url) => setValue(`items.${index}.image`, url)}
                            label={`Card ${index + 1} Image`}
                            description={`Upload image for card ${index + 1}`}
                            error={errors.items?.[index]?.image}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {errors.items && (
                    <p className="text-sm text-red-500">
                      {errors.items.message}
                    </p>
                  )}
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
                    Save Three Cards Block
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