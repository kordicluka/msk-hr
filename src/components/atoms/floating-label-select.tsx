"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./select";

interface FloatingLabelSelectProps {
  label: string;
  error?: boolean;
  description?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

const FloatingLabelSelect = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  FloatingLabelSelectProps
>(
  (
    {
      className,
      label,
      error,
      description,
      value,
      onValueChange,
      children,
      id,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!value);

    React.useEffect(() => {
      setHasValue(!!value);
    }, [value]);

    const handleOpenChange = (open: boolean) => {
      setIsFocused(open);
    };

    return (
      <div className="relative w-full">
        <Select
          value={value}
          onValueChange={onValueChange}
          onOpenChange={handleOpenChange}
          {...props}
        >
          <SelectTrigger
            ref={ref}
            id={id}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            className={cn(
              "p4-3 pt-6 data-[size=default]:h-18 border rounded-md shadow-xs border-input bg-transparent h-18 w-full  text-2xl transition-all outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              isFocused ? "border-accent focus-visible:border-accent" : "",
              error
                ? "border-destructive ring-destructive/20 dark:ring-destructive/40"
                : "",
              className
            )}
          >
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
        <label
          className={cn(
            "absolute left-4 pointer-events-none transition-all",
            isFocused || hasValue
              ? "text-sm font-medium text-gray-700 top-2"
              : "text-muted-foreground text-lg top-[calc(50%-0.65em)]"
          )}
        >
          {label}
        </label>
        {description && (
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        )}
      </div>
    );
  }
);

FloatingLabelSelect.displayName = "FloatingLabelSelect";

export { FloatingLabelSelect };
