"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { 
  parsePathname, 
  getSlugInTargetLanguage, 
  buildTargetUrl
} from "@/lib/slug-utils";

interface Language {
  label: string;
  value: string;
  shortLabel: string;
  flag: string;
}

export default function SelectLanguage({
  isDarkMode = false,
}: {
  isDarkMode?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const languages: Language[] = [
    {
      label: "Hrvatski",
      value: "hr",
      shortLabel: "Hr",
      flag: "/flags/hr.png",
    },
    {
      label: "English",
      value: "en",
      shortLabel: "En",
      flag: "/flags/en.png",
    },
  ];

  const handleLanguageChange = async (value: string) => {
    if (value === locale || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Parse the current pathname to understand what content we're on
      const { contentType, slugs, isStatic } = parsePathname(pathname);
      
      // Handle static pages (contact, about, etc.) - use routing config
      if (isStatic || !contentType || slugs.length === 0) {
        // For static pages, next-intl routing will handle the mapping
        router.push(pathname as never, { locale: value });
        return;
      }
      
      // Handle dynamic content pages
      let targetUrl = "/";
      
      if (contentType && slugs.length > 0) {
        // For services, check if it's hierarchical (parent/child)
        if (contentType === "service" && slugs.length === 2) {
          // Hierarchical service: /services/parent-slug/child-slug
          const [parentSlug, childSlug] = slugs;
          
          const childResult = await getSlugInTargetLanguage(
            childSlug, 
            locale, 
            value, 
            contentType,
            parentSlug
          );
          
          if (childResult.targetSlug && childResult.parentSlug) {
            targetUrl = buildTargetUrl(contentType, value, [
              childResult.parentSlug, 
              childResult.targetSlug
            ]);
          } else {
            // Fallback: try to get just the parent service
            const parentResult = await getSlugInTargetLanguage(
              parentSlug, 
              locale, 
              value, 
              contentType
            );
            if (parentResult.targetSlug) {
              targetUrl = buildTargetUrl(contentType, value, [parentResult.targetSlug]);
            }
          }
        } else {
          // Single slug: /services/slug, /offers/slug, /projects/slug, /blog/slug
          const currentSlug = slugs[0];
          
          const result = await getSlugInTargetLanguage(
            currentSlug, 
            locale, 
            value, 
            contentType
          );
          
          if (result.targetSlug) {
            targetUrl = buildTargetUrl(contentType, value, [result.targetSlug]);
          }
        }
      }
      
      // Navigate to the target URL
      router.push(targetUrl as never, { locale: value });
      
    } catch (error) {
      console.error("Error switching language:", error);
      // Fallback to homepage if anything goes wrong
      router.push("/" as never, { locale: value });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select value={locale} onValueChange={handleLanguageChange} disabled={isLoading}>
      <SelectTrigger className="mr-4 bg-transparent border-none w-24 shadow-none">
        <SelectValue className="flex items-center gap-2">
          <Image
            src={
              languages.find((language) => language.value === locale)?.flag ||
              "/placeholder.svg"
            }
            alt={
              languages.find((language) => language.value === locale)?.label ||
              "placeholder"
            }
            width={16}
            height={12}
            className="object-cover"
          />
          <label
            className={`flex items-center gap-2 text-[1.05rem] ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {
              languages.find((language) => language.value === locale)
                ?.shortLabel
            }
          </label>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-background">
        {languages.map((language) => (
          <SelectItem
            key={language.value}
            value={language.value}
            className="hover:bg-background"
          >
            <div className="flex items-center text-[1rem] gap-2 cursor-pointer">
              <Image
                src={language.flag || "/placeholder.svg"}
                alt={language.label}
                width={16}
                height={12}
                className="object-cover"
              />
              {language.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
