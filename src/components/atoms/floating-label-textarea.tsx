"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: boolean;
  description?: string;
}

const FloatingLabelTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FloatingLabelTextareaProps
>(({ className, label, error, description, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(
    !!props.value || !!props.defaultValue
  );
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Inicijalna provjera i ref spojanje
  React.useEffect(() => {
    if (textareaRef.current) {
      setHasValue(!!textareaRef.current.value);
      adjustTextareaHeight();
    }
  }, []);

  // Funkcija za automatsku prilagodbu visine
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "56px"; // h-14 (ista visina kao input)
      textareaRef.current.style.height = `${Math.max(
        56,
        textareaRef.current.scrollHeight
      )}px`;
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    // Provjeri ima li vrijednosti nakon gubitka fokusa
    setHasValue(!!e.target.value);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(!!e.target.value);
    adjustTextareaHeight();
    props.onChange?.(e);
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={(node) => {
          // Spajanje oba refa
          textareaRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          "border rounded-md shadow-xs border-input placeholder:text-transparent selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex w-full bg-transparent px-3 py-1 text-2xl transition-all outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 pt-10 overflow-hidden resize-none",
          isFocused ? "border-accent focus-visible:border-accent" : "",
          error
            ? "border-destructive ring-destructive/20 dark:ring-destructive/40"
            : "",
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        style={{ minHeight: "56px" }} // h-14 (ista visina kao input)
        rows={1}
        {...props}
      />
      <label
        className={cn(
          "absolute left-3 pointer-events-none transition-all",
          isFocused || hasValue
            ? "text-base text-muted-foreground top-1"
            : "text-muted-foreground text-2xl top-[calc(50%-0.5em)]"
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

FloatingLabelTextarea.displayName = "FloatingLabelTextarea";

export { FloatingLabelTextarea };
