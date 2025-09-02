import React, { useState } from "react";
import { Input } from "@/components/atoms/input";
import { Loader2 } from "lucide-react";
import {
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/atoms/admin/form";

interface InputTypeNumberCardProps {
  value: number;
  setValue: (value: number) => void;
  title: string;
  description: string;
  placeholder: string;
  validate: (value: number) => {
    message: string;
    success: boolean;
  };
  save: (newValue: number) => Promise<void>;
  active: boolean;
  setActive: (value: boolean) => void;
}

export default function InputTypeNumberCard({
  value,
  setValue,
  title,
  description,
  placeholder,
  validate,
  save,
  active,
  setActive,
}: InputTypeNumberCardProps) {
  const [newValue, setNewValue] = useState<number>(value);
  const [error, setError] = useState({ message: "", success: true });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const { message, success } = validate(newValue);
    setError({ message, success });
    if (success) {
      setIsSaving(true);
      try {
        await save(newValue);
        setValue(newValue);
        setActive(false);
      } catch (error) {
        console.error("Error saving:", error);
        setError({
          message: "Failed to save. Please try again.",
          success: false,
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    const { message, success } = validate(value);
    setError({ message, success });
    if (success) {
      setNewValue(value);
      setActive(false);
    }
  };

  const handleChange = (inputValue: string) => {
    const numberValue = parseFloat(inputValue);
    setNewValue(isNaN(numberValue) ? 0 : numberValue);
  };

  return (
    <div className="z-20 flex flex-col w-full space-y-3 border-b border-gray-200 py-4">
      <FormItem>
        <FormLabel>{title}</FormLabel>
        <p className="text-xs text-gray-700">{description}</p>

        {active ? (
          <>
            <div className="space-y-2">
              <FormControl>
                <Input
                  type="number"
                  className="rounded border border-gray-300"
                  placeholder={placeholder}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </FormControl>
            </div>
            {!error.success && (
              <p className="text-xs text-red-500">{error.message}</p>
            )}
            <div className="flex justify-between w-full pb-2 items-center">
              <button
                className="underline text-xs"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-800 text-white rounded-sm font-medium text-xs flex items-center"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-between w-full items-center">
            <div className="max-w-[90%]">
              <p className="text-sm font-light text-gray-700">{value}</p>
            </div>
            <button
              className="underline text-xs"
              onClick={() => setActive(true)}
            >
              Edit
            </button>
          </div>
        )}
      </FormItem>
    </div>
  );
}
