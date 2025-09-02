"use client";
import { Input } from "@/components/atoms/admin/input";
import { Textarea } from "@/components/atoms/admin/textarea";
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

interface MultiLanguageInputProps {
  name: string;
  title: string;
  description: string;
  placeholder: Record<string, string>;
  handleChange: (value: string, language: (typeof locales)[number]) => void;
  isTextarea?: boolean;
  readOnly?: boolean;
  error: Record<string, string | undefined>;
  value?: Record<string, string>;
}

export default function MultiLanguageInput({
  name,
  title,
  description,
  placeholder,
  isTextarea = false,
  readOnly = false,
  error,
  handleChange,
  value,
}: MultiLanguageInputProps) {
  const InputComponent = isTextarea ? Textarea : Input;

  return (
    <FormField
      name={name}
      render={() => (
        <FormItemsContainer className="">
          {" "}
          <FormLabel className="mt-3 mx-4">{title}</FormLabel>
          <FormLabelText className="mx-4 mb-2">{description}</FormLabelText>
          <FormItem className="" key={name + "form-item"}>
            {locales.map((locale, index) => (
              <div key={name + "form-item-locale-" + locale}>
                <FormLabel className="px-4 mb-2 uppercase">{locale}</FormLabel>
                <FormControl
                  className={cn("flex-1 mb-4", {
                    "mb-0": index === locales.length - 1,
                  })}
                >
                  <InputComponent
                    placeholder={placeholder[locale]}
                    {...(value ? { value: value[locale] || "" } : {})}
                    readOnly={readOnly}
                    onChange={(e) =>
                      !readOnly && handleChange(e.target.value, locale)
                    }
                    className={cn(readOnly && "bg-gray-50 cursor-not-allowed")}
                  />
                </FormControl>
                {error[locale] && (
                  <FormMessage className="text-red-500 text-xs my-3 mx-4">
                    {error[locale]}
                  </FormMessage>
                )}
              </div>
            ))}
          </FormItem>
        </FormItemsContainer>
      )}
    />
  );
}
