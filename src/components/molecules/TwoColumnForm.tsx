import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TwoColumnSchema, type TwoColumnData } from "@/schemas/two-column";
import { Button } from "@/components/atoms/admin/button";
import { Input } from "@/components/atoms/admin/input";
import { Textarea } from "@/components/atoms/admin/textarea";
import { Label } from "@/components/atoms/admin/label";
import { Checkbox } from "@/components/atoms/admin/checkbox";
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
import ImageUpload from "@/components/organisms/ImageUpload";
import { Languages } from "lucide-react";

// Tipovi za multilingual podršku
export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type MultiLanguageTwoColumnData = {
  [languageCode: string]: TwoColumnData;
};

interface TwoColumnFormProps {
  languages: Language[];
  defaultLanguage: string;
  initialData?: MultiLanguageTwoColumnData;
  onSubmit: (data: MultiLanguageTwoColumnData) => void;
  onCancel?: () => void;
}

export function TwoColumnForm({
  languages,
  defaultLanguage,
  initialData,
  onSubmit,
  onCancel,
}: TwoColumnFormProps) {
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage);
  const [formData, setFormData] = useState<MultiLanguageTwoColumnData>(
    initialData || {}
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TwoColumnData>({
    resolver: zodResolver(TwoColumnSchema),
    defaultValues: formData[activeLanguage] || {
      image: "",
      title: "",
      paragraph: "",
      theme: "light",
      reverse: false,
      buttonText: "",
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
      image: "",
      title: "",
      paragraph: "",
      theme: "light",
      reverse: false,
      buttonText: "",
      buttonVariant: "default",
      href: "",
    };

    reset(newLangData);
  };

  const handleFormSubmit = (data: TwoColumnData) => {
    const finalData = {
      ...formData,
      [activeLanguage]: data,
    };
    onSubmit(finalData);
  };

  const getLanguageCompletionStatus = (langCode: string) => {
    const langData = formData[langCode];
    if (!langData) return "empty";
    if (langData.title.trim() && langData.paragraph.trim() && langData.image.trim()) return "complete";
    return "partial";
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Two Column Block
        </CardTitle>
        <CardDescription>
          Configure the two column block for multiple languages
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
                    <Label htmlFor={`paragraph-${lang.code}`}>
                      Paragraph <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id={`paragraph-${lang.code}`}
                      {...register("paragraph")}
                      placeholder={`Enter paragraph in ${lang.name}`}
                      rows={4}
                      className={errors.paragraph ? "border-red-500" : ""}
                    />
                    {errors.paragraph && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.paragraph.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <ImageUpload
                      value={watch("image") || ""}
                      onChange={(url) => setValue("image", url)}
                      label="Image"
                      description="Upload an image for the two column component"
                      error={errors.image}
                    />
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
                      onValueChange={(value: "light" | "dark") =>
                        setValue("theme", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
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

                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id={`reverse-${lang.code}`}
                      checked={watch("reverse")}
                      onCheckedChange={(checked) =>
                        setValue("reverse", checked as boolean)
                      }
                    />
                    <Label htmlFor={`reverse-${lang.code}`}>
                      Reverse layout (image on right)
                    </Label>
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
                    Save Two Column Block
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