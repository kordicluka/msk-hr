"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
  description?: string;
}

const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(({ className, label, error, description, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(
    !!props.value || !!props.defaultValue
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Koristi se za početnu provjeru i ref spojanje
  React.useEffect(() => {
    if (inputRef.current) {
      setHasValue(!!inputRef.current.value);
    }
  }, []);

  // Dodati MutationObserver za detekciju promjena vrijednosti
  React.useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    // Provjeri autofill svake 200ms
    const interval = setInterval(() => {
      const currentValue = input.value;
      const shouldHaveValue = !!currentValue;
      if (hasValue !== shouldHaveValue) {
        setHasValue(shouldHaveValue);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [hasValue]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // Također provjeri vrijednost na focus
    setHasValue(!!e.target.value);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    // Provjeri ima li vrijednosti nakon gubitka fokusa
    setHasValue(!!e.target.value);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="relative w-full">
      <input
        ref={(node) => {
          // Spajanje oba refa
          inputRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          "text-lg pl-4 pt-4 rounded-md shadow-xs border-input border-1 file:text-foreground placeholder:text-transparent selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-17 w-full min-w-0 bg-transparent transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          isFocused ? "border-accent focus-visible:border-accent" : "",
          error
            ? "border-destructive ring-b-destructive/20 dark:ring-b-destructive/40"
            : "",
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
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
});

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
