"use client";

import type React from "react";

import { useState } from "react";
import {
  FormItem,
  FormItemsContainer,
  FormLabel,
  FormLabelText,
  FormMessage,
} from "@/components/atoms/admin/form";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { X } from "lucide-react";
import { uploadToS3 } from "@/actions/UploadActions";
import { getUrl } from "@/lib/s3";
import { FieldError } from "react-hook-form";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  description: string;
  error?: FieldError;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  error,
  description,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (e.g., 10MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      alert("File is too large. Maximum size is 50MB.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await uploadToS3(formData);
      if (data.success && data.fileName) {
        onChange(data.fileName);
      } else {
        console.error("Error uploading image:", data.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormItemsContainer>
      <FormLabel className="mt-3 mx-4">{label}</FormLabel>
      <FormLabelText className="mx-4">{description}</FormLabelText>
      {error && (
        <FormMessage className="mx-4">{error.message as string}</FormMessage>
      )}

      <FormItem className="mt-2 p-0 h-100 relative shadow-sm overflow-hidden">
        {value ? (
          <div className=" w-full h-full border relative">
            <Image
              src={getUrl(value)}
              alt="Service image"
              fill
              className="object-cover h-full w-full"
            />

            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 bg-white/80 text-gray-500 p-1 rounded-full text-xs hover:bg-white backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              {isUploading ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-800 animate-spin" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload image
                  </p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        )}
      </FormItem>
    </FormItemsContainer>
  );
}
