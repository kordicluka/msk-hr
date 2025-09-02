import { cn } from "@/lib/utils";

interface GridColumnItemProps {
  content: React.ReactNode;
  span?: number; // Koliko kolumna zauzima (grid-column: span X)
  start?: number; // Na kojoj kolumni počinje (grid-column-start)
  end?: number; // Na kojoj kolumni završava (grid-column-end)
  rowSpan?: number; // Koliko redova zauzima (grid-row: span X)
  rowStart?: number; // Na kojem redu počinje (grid-row-start)
  rowEnd?: number; // Na kojem redu završava (grid-row-end)
  className?: string;
}

interface GridColumnProps {
  columns: GridColumnItemProps[];
  cols?: number | "auto" | "fit"; // Broj kolumna ili auto-fit/auto-fill
  gap?: "sm" | "md" | "lg" | "xl" | "2xl";
  gapX?: "sm" | "md" | "lg" | "xl" | "2xl"; // Horizontal gap
  gapY?: "sm" | "md" | "lg" | "xl" | "2xl"; // Vertical gap
  minColWidth?: string; // Minimalna širina kolumne (npr. "200px", "15rem")
  maxColWidth?: string; // Maksimalna širina kolumne
  rows?: number | "auto"; // Broj redova ili auto
  alignment?: "start" | "center" | "end" | "stretch";
  justifyItems?: "start" | "center" | "end" | "stretch";
  autoFlow?: "row" | "column" | "dense" | "row-dense" | "column-dense";
  // Responsive settings
  mobileCols?: number;
  tabletCols?: number;
  className?: string;
}

export const GridColumn: React.FC<GridColumnProps> = ({
  columns,
  cols = "auto",
  gap,
  gapX,
  gapY,
  minColWidth = "250px",
  maxColWidth = "1fr",
  rows = "auto",
  alignment = "stretch",
  justifyItems = "stretch",
  autoFlow = "row",
  mobileCols = 1,
  tabletCols = 2,
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

  const gapXClasses = {
    sm: "gap-x-2",
    md: "gap-x-4",
    lg: "gap-x-6",
    xl: "gap-x-8",
    "2xl": "gap-x-12",
  };

  const gapYClasses = {
    sm: "gap-y-2",
    md: "gap-y-4",
    lg: "gap-y-6",
    xl: "gap-y-8",
    "2xl": "gap-y-12",
  };

  // Alignment classes
  const alignmentClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyItemsClasses = {
    start: "justify-items-start",
    center: "justify-items-center",
    end: "justify-items-end",
    stretch: "justify-items-stretch",
  };

  // Auto flow classes
  const autoFlowClasses = {
    row: "grid-flow-row",
    column: "grid-flow-col",
    dense: "grid-flow-dense",
    "row-dense": "grid-flow-row-dense",
    "column-dense": "grid-flow-col-dense",
  };

  // Grid columns setup
  const getGridColumnsClass = () => {
    if (typeof cols === "number") {
      return `grid-cols-${mobileCols} md:grid-cols-${tabletCols} lg:grid-cols-${cols}`;
    }
    if (cols === "auto") {
      return `grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(${minColWidth},${maxColWidth}))]`;
    }
    if (cols === "fit") {
      return `grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(${minColWidth},${maxColWidth}))]`;
    }
    return "grid-cols-1";
  };

  // Grid rows setup
  const getGridRowsClass = () => {
    if (typeof rows === "number") {
      return `grid-rows-${rows}`;
    }
    return ""; // auto rows
  };

  // Determine gap classes
  const finalGapClass = gap
    ? gapClasses[gap]
    : [gapX && gapXClasses[gapX], gapY && gapYClasses[gapY]]
        .filter(Boolean)
        .join(" ");

  return (
    <div
      className={cn(
        "grid",
        getGridColumnsClass(),
        getGridRowsClass(),
        finalGapClass,
        alignmentClasses[alignment],
        justifyItemsClasses[justifyItems],
        autoFlowClasses[autoFlow],
        className
      )}
    >
      {columns.map((column, index) => (
        <div
          key={index}
          className={cn(
            // Column span
            column.span && `col-span-${column.span}`,
            // Column start/end
            column.start && `col-start-${column.start}`,
            column.end && `col-end-${column.end}`,
            // Row span
            column.rowSpan && `row-span-${column.rowSpan}`,
            // Row start/end
            column.rowStart && `row-start-${column.rowStart}`,
            column.rowEnd && `row-end-${column.rowEnd}`,
            column.className
          )}
        >
          {column.content}
        </div>
      ))}
    </div>
  );
};

// Export tipova
export type { GridColumnProps, GridColumnItemProps };
