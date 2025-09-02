"use client";
import { Input } from "@/components/atoms/admin/input";
import { Button } from "@/components/atoms/admin/button";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
  FormLabelText,
  FormItemsContainer,
} from "@/components/atoms/admin/form";
import { locales } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { X, Plus } from "lucide-react";

interface MultiLanguageArrayInputProps {
  name: string;
  title: string;
  description: string;
  placeholder: Record<string, string>;
  handleChange: (value: string[], language: (typeof locales)[number]) => void;
  readOnly?: boolean;
  error: Record<string, string | undefined>;
  value?: Record<string, string[]>;
}

export default function MultiLanguageArrayInput({
  name,
  title,
  description,
  placeholder,
  readOnly = false,
  error,
  handleChange,
  value,
}: MultiLanguageArrayInputProps) {
  const addItem = (locale: (typeof locales)[number]) => {
    if (readOnly) return;

    const currentValues = value?.[locale] || [];
    handleChange([...currentValues, ""], locale);
  };

  const removeItem = (locale: (typeof locales)[number], index: number) => {
    if (readOnly) return;

    const currentValues = value?.[locale] || [];
    const newValues = currentValues.filter((_, i) => i !== index);
    handleChange(newValues, locale);
  };

  const updateItem = (
    locale: (typeof locales)[number],
    index: number,
    newValue: string
  ) => {
    if (readOnly) return;

    const currentValues = value?.[locale] || [];
    const newValues = [...currentValues];
    newValues[index] = newValue;
    handleChange(newValues, locale);
  };

  return (
    <FormField
      name={name}
      render={() => (
        <FormItemsContainer className="">
          <FormLabel className="mt-3 mx-4">{title}</FormLabel>
          <FormLabelText className="mx-4 mb-2">{description}</FormLabelText>
          <FormItem className="" key={name + "form-item"}>
            {locales.map((locale, index) => {
              const items = value?.[locale] || [""];

              return (
                <div key={name + "form-item-locale-" + locale}>
                  <FormLabel className="px-4 mb-2 uppercase">
                    {locale}
                  </FormLabel>

                  <div className="space-y-2">
                    {items.map((item, itemIndex) => (
                      <div
                        key={`${locale}-${itemIndex}`}
                        className="flex items-center gap-2"
                      >
                        <FormControl className="flex-1">
                          <Input
                            placeholder={placeholder[locale]}
                            value={item}
                            readOnly={readOnly}
                            onChange={(e) =>
                              updateItem(locale, itemIndex, e.target.value)
                            }
                            className={cn(
                              readOnly && "bg-gray-50 cursor-not-allowed"
                            )}
                          />
                        </FormControl>
                        {!readOnly && items.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(locale, itemIndex)}
                            className="shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    {!readOnly && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addItem(locale)}
                        className="mt-2 mx-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Dodaj stavku
                      </Button>
                    )}
                  </div>

                  {error[locale] && (
                    <FormMessage className="text-red-500 text-xs my-3 mx-4">
                      {error[locale]}
                    </FormMessage>
                  )}

                  {index !== locales.length - 1 && <div className="mb-4" />}
                </div>
              );
            })}
          </FormItem>
        </FormItemsContainer>
      )}
    />
  );
}
