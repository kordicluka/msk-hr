import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StickyScrollableSlidesFormSchema,
  type StickyScrollableSlidesFormData,
  createDefaultStickyScrollableSlidesItem,
} from "@/schemas/sticky-scrollable-slides";
import { Button } from "@/components/atoms/admin/button";
import { Input } from "@/components/atoms/admin/input";
import { Textarea } from "@/components/atoms/admin/textarea";
import { Label } from "@/components/atoms/admin/label";
import { Checkbox } from "@/components/atoms/admin/checkbox";
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
import {
  Languages,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Link as LinkIcon,
} from "lucide-react";

// Tipovi za multilingual podršku
export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type MultiLanguageStickyScrollableSlidesData = {
  [languageCode: string]: StickyScrollableSlidesFormData;
};

interface StickyScrollableSlidesFormProps {
  languages: Language[];
  defaultLanguage: string;
  initialData?: MultiLanguageStickyScrollableSlidesData;
  onSubmit: (data: MultiLanguageStickyScrollableSlidesData) => void;
  onCancel?: () => void;
}

export function StickyScrollableSlidesForm({
  languages,
  defaultLanguage,
  initialData,
  onSubmit,
  onCancel,
}: StickyScrollableSlidesFormProps) {
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage);
  const [formData, setFormData] =
    useState<MultiLanguageStickyScrollableSlidesData>(initialData || {});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm<StickyScrollableSlidesFormData>({
    resolver: zodResolver(StickyScrollableSlidesFormSchema),
    defaultValues: formData[activeLanguage] || {
      rowReverse: false,
      items: [
        createDefaultStickyScrollableSlidesItem(1),
        createDefaultStickyScrollableSlidesItem(2),
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
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
      rowReverse: false,
      items: [
        createDefaultStickyScrollableSlidesItem(1),
        createDefaultStickyScrollableSlidesItem(2),
      ],
    };

    reset(newLangData);
  };

  const handleFormSubmit = (data: StickyScrollableSlidesFormData) => {
    console.log("=== FORM SUBMIT DEBUG ===");
    console.log("Current form data:", data);
    console.log("Form errors:", errors);
    console.log("Active language:", activeLanguage);
    console.log("All form data:", formData);
    
    const finalData = {
      ...formData,
      [activeLanguage]: data,
    };
    
    console.log("Final data to submit:", finalData);
    console.log("=== END FORM SUBMIT DEBUG ===");
    
    onSubmit(finalData);
  };

  const getLanguageCompletionStatus = (langCode: string) => {
    const langData = formData[langCode];
    if (!langData) return "empty";

    const hasValidItems = langData.items?.some(
      (item) => item.title.trim() && item.description.trim()
    );

    return hasValidItems ? "complete" : "partial";
  };

  const addNewItem = () => {
    const currentItems = watch("items") || [];
    const existingIds = currentItems.map((item) => item.id).filter((id) => typeof id === "number");
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    append(createDefaultStickyScrollableSlidesItem(newId));
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex >= 0 && toIndex < fields.length) {
      move(fromIndex, toIndex);
    }
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Sticky Scrollable Slides Block
        </CardTitle>
        <CardDescription>
          Configure the sticky scrollable slides block for multiple languages
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
                {/* General Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">General Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`rowReverse-${lang.code}`}
                        checked={watch("rowReverse")}
                        onCheckedChange={(checked) =>
                          setValue("rowReverse", checked as boolean)
                        }
                      />
                      <Label htmlFor={`rowReverse-${lang.code}`}>
                        Reverse row layout (image on right)
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Items */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Slide Items</CardTitle>
                        <CardDescription>
                          Add and configure slide items (minimum 1, maximum 20)
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addNewItem}
                        disabled={fields.length >= 20}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Item #{index + 1}</h4>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveItem(index, index - 1)}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveItem(index, index + 1)}
                              disabled={index === fields.length - 1}
                            >
                              <MoveDown className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(index)}
                              disabled={fields.length <= 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor={`items.${index}.title-${lang.code}`}
                            >
                              Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`items.${index}.title-${lang.code}`}
                              {...register(`items.${index}.title`)}
                              placeholder={`Enter title in ${lang.name}`}
                              className={
                                errors.items?.[index]?.title
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {errors.items?.[index]?.title && (
                              <p className="text-sm text-red-500 mt-1">
                                {errors.items[index]?.title?.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor={`items.${index}.link-${lang.code}`}>
                              <LinkIcon className="h-4 w-4 inline mr-1" />
                              Link
                            </Label>
                            <Input
                              id={`items.${index}.link-${lang.code}`}
                              {...register(`items.${index}.link`)}
                              placeholder="/contact or https://example.com"
                              className={
                                errors.items?.[index]?.link
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {errors.items?.[index]?.link && (
                              <p className="text-sm text-red-500 mt-1">
                                {errors.items[index]?.link?.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <Label
                              htmlFor={`items.${index}.description-${lang.code}`}
                            >
                              Description{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id={`items.${index}.description-${lang.code}`}
                              {...register(`items.${index}.description`)}
                              placeholder={`Enter description in ${lang.name}`}
                              rows={3}
                              className={
                                errors.items?.[index]?.description
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {errors.items?.[index]?.description && (
                              <p className="text-sm text-red-500 mt-1">
                                {errors.items[index]?.description?.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <ImageUpload
                              value={watch(`items.${index}.image`) || ""}
                              onChange={(url) =>
                                setValue(`items.${index}.image`, url)
                              }
                              label="Image"
                              description="Upload an image for this slide item"
                              error={errors.items?.[index]?.image}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}

                    {errors.items &&
                      typeof errors.items === "object" &&
                      "message" in errors.items && (
                        <p className="text-sm text-red-500 mt-2">
                          {errors.items.message}
                        </p>
                      )}
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
                        console.log("=== VALIDATION ERRORS ===");
                        console.log("All validation errors:", errors);
                        console.log("Current form state:", watch());
                        console.log("=== END VALIDATION ERRORS ===");
                      }
                    )}
                  >
                    Save Sticky Scrollable Slides Block
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
