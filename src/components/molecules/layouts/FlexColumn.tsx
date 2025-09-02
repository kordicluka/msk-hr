import { cn } from "@/lib/utils";

interface ColumnProps {
  content: React.ReactNode;
  flex?: number | string; // Za custom flex basis (npr. 1, 2, "2fr", "200px")
  className?: string;
}

interface FlexColumnProps {
  columns: ColumnProps[];
  gap?: "sm" | "md" | "lg" | "xl" | "2xl";
  alignment?: "start" | "center" | "end" | "stretch";
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  wrap?: boolean;
  mobileDirection?: "row" | "column" | "stack"; // stack = column na mobilnom, row na desktop
  mobileWrap?: boolean;
  className?: string;
}

export const FlexColumn: React.FC<FlexColumnProps> = ({
  columns,
  gap = "md",
  alignment = "start",
  direction = "row",
  wrap = false,
  mobileDirection = "stack",
  mobileWrap = true,
  className,
}) => {
  // Gap classes
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
    "2xl": "gap-12",
  };

  // Alignment classes
  const alignmentClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  // Direction classes
  const directionClasses = {
    row: "flex-row",
    "row-reverse": "flex-row-reverse",
    column: "flex-col",
    "column-reverse": "flex-col-reverse",
  };

  // Mobile direction classes
  const mobileDirectionClasses = {
    row: "flex-row",
    column: "flex-col",
    stack: "flex-col md:flex-row", // Stack na mobilnom, row na desktop
  };

  // Wrap classes
  const wrapClass = wrap ? "flex-wrap" : "flex-nowrap";
  const mobileWrapClass = mobileWrap ? "flex-wrap" : "flex-nowrap";

  // Dinamički određujemo da li koristimo mobile direction ili standardnu
  const finalDirectionClass =
    mobileDirection === "stack"
      ? mobileDirectionClasses[mobileDirection]
      : `${mobileDirectionClasses[mobileDirection]} md:${directionClasses[direction]}`;

  return (
    <div
      className={cn(
        "flex",
        finalDirectionClass,
        gapClasses[gap],
        alignmentClasses[alignment],
        wrapClass,
        `md:${mobileWrapClass}`,
        className
      )}
    >
      {columns.map((column, index) => (
        <div
          key={index}
          className={cn(
            // Default flex behavior
            typeof column.flex === "number"
              ? `flex-[${column.flex}]`
              : column.flex
              ? `flex-[${column.flex}]`
              : "flex-1",
            column.className
          )}
          style={
            typeof column.flex === "string" && !column.flex.match(/^\d+$/)
              ? { flex: column.flex }
              : undefined
          }
        >
          {column.content}
        </div>
      ))}
    </div>
  );
};

// Export tipova
export type { FlexColumnProps, ColumnProps };
