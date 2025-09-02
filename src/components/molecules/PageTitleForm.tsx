import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageTitleSchema, type PageTitleData } from "@/schemas/page-title";
import { Button } from "@/components/atoms/admin/button";
import { Input } from "@/components/atoms/admin/input";
import { Textarea } from "@/components/atoms/admin/textarea";
import { Label } from "@/components/atoms/admin/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
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
import { Languages } from "lucide-react";

// Dodajte ove tipove u vaš types/content.ts ili ih definirajte ovdje
export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type MultiLanguagePageTitleData = {
  [languageCode: string]: PageTitleData;
};

interface PageTitleFormProps {
  languages: Language[];
  defaultLanguage: string;
  initialData?: MultiLanguagePageTitleData;
  onSubmit: (data: MultiLanguagePageTitleData) => void;
  onCancel?: () => void;
}

export function PageTitleForm({
  languages,
  defaultLanguage,
  initialData,
  onSubmit,
  onCancel,
}: PageTitleFormProps) {
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage);
  const [formData, setFormData] = useState<MultiLanguagePageTitleData>(
    initialData || {}
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PageTitleData>({
    resolver: zodResolver(PageTitleSchema),
    defaultValues: formData[activeLanguage] || {
      title: "",
      description: "",
      buttonText: "",
      theme: "default",
      size: "default",
      align: "left",
      buttonVariant: "default",
      href: "",
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
      title: "",
      description: "",
      buttonText: "",
      theme: "default",
      size: "default",
      align: "left",
      buttonVariant: "default",
      href: "",
    };

    reset(newLangData);
  };

  const handleFormSubmit = (data: PageTitleData) => {
    const finalData = {
      ...formData,
      [activeLanguage]: data,
    };
    onSubmit(finalData);
  };

  const getLanguageCompletionStatus = (langCode: string) => {
    const langData = formData[langCode];
    if (!langData) return "empty";
    if (langData.title.trim()) return "complete";
    return "partial";
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Page Title Block
        </CardTitle>
        <CardDescription>
          Configure the page title block for multiple languages
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
                      Description
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

                  <div>
                    <Label htmlFor={`buttonText-${lang.code}`}>
                      Button Text
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

                  <div>
                    <Label htmlFor={`href-${lang.code}`}>Button URL</Label>
                    <Input
                      id={`href-${lang.code}`}
                      {...register("href")}
                      placeholder={`Enter button URL (e.g. /contact, https://example.com)`}
                      className={errors.href ? "border-red-500" : ""}
                    />
                    {errors.href && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.href.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Style Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`theme-${lang.code}`}>Theme</Label>
                    <Select
                      value={watch("theme")}
                      onValueChange={(
                        value: "default" | "primary" | "transparent"
                      ) => setValue("theme", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="transparent">Transparent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`size-${lang.code}`}>Size</Label>
                    <Select
                      value={watch("size")}
                      onValueChange={(value: "sm" | "default" | "lg" | "xl") =>
                        setValue("size", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                        <SelectItem value="xl">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`align-${lang.code}`}>Alignment</Label>
                    <Select
                      value={watch("align")}
                      onValueChange={(value: "left" | "center" | "right") =>
                        setValue("align", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select alignment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`buttonVariant-${lang.code}`}>
                      Button Variant
                    </Label>
                    <Select
                      value={watch("buttonVariant")}
                      onValueChange={(
                        value: "default" | "outline" | "secondary" | "ghost"
                      ) => setValue("buttonVariant", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select button variant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="ghost">Ghost</SelectItem>
                      </SelectContent>
                    </Select>
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
                    Save Page Title Block
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
