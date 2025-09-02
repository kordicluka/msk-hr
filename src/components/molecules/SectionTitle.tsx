// src/components/molecules/SectionTitle/SectionTitle.tsx
import { cn } from "@/lib/utils";

type TitleComponent = React.ReactElement;
type DescriptionComponent = React.ReactElement | string;
type ButtonComponent = React.ReactElement;

interface SectionTitleProps {
  title: TitleComponent;
  description?: DescriptionComponent;
  buttons?: ButtonComponent[];
  alignment?: "left" | "center" | "right";
  variant?: "light" | "dark";
  spacing?: "sm" | "md" | "lg" | "xl";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  description,
  buttons,
  alignment = "center",
  variant = "light",
  spacing = "md",
  maxWidth = "full",
}) => {
  // Alignment classes
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  // Theme variant classes
  const variantClasses = {
    light: "text-foreground",
    dark: "text-white",
  };

  // Spacing classes
  const spacingClasses = {
    sm: "lg:space-y-3 space-y-1",
    md: "lg:space-y-4 space-y-2",
    lg: "lg:space-y-6 space-y-3",
    xl: "lg:space-y-8 space-y-4",
  };

  // Auto margin for alignment when maxWidth is set
  const marginClasses = {
    left: maxWidth !== "full" ? "mr-auto" : "",
    center: maxWidth !== "full" ? "mx-auto" : "",
    right: maxWidth !== "full" ? "ml-auto" : "",
  };

  return (
    <div
      className={cn(
        "flex flex-col px-4 xl:px-0 container mx-auto",
        alignmentClasses[alignment],
        variantClasses[variant],
        spacingClasses[spacing],
        marginClasses[alignment]
      )}
    >
      {/* Title */}
      <div className="title-wrapper">{title}</div>

      {/* Description */}
      {description && (
        <div className="description-wrapper">
          {typeof description === "string" ? (
            <p
              className={cn(
                "text-xs lg:text-sm xl:text-base",
                variant === "dark" ? "text-gray-200" : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          ) : (
            description
          )}
        </div>
      )}
      {buttons && (
        <div className="flex space-x-4 pt-2">
          {buttons.map((button) => button)}
        </div>
      )}
    </div>
  );
};

// Export tipova za lakše korištenje
export type { SectionTitleProps };
