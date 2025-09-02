import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex rounded-full items-center justify-center gap-2 whitespace-nowrap cursor-pointer  transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-secondary shadow-lg border border-secondary text-white hover:rounded-none",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-primary text-primary  bg-background hover:bg-muted hover:rounded-none dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        accent:
          "bg-accent text-primary border border-accent shadow-xs hover:bg-accent/80",
        secondary:
          "bg-primary text-white border border-primary shadow-xs hover:bg-primary/90",
        ghost: "bg-transparent border-none",
        link: "text-primary underline-offset-4 hover:underline",
        outlinePrimary:
          "border border-background text-background  bg-transparent hover:bg-background/5 hover:rounded-none dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
      },
      size: {
        default:
          "px-4 py-2.5 text-sm md:text-base md:px-5 md:py-3 has-[>svg]:px-3",
        sm: "h-10   gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "px-5 py-3 text-sm md:text-base md:px-6  md:py-3.5 has-[>svg]:px-5",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Postojeći Button
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// Novi ArrowButton s varijantama
function ArrowButton({
  className,
  arrowColor,
  variant,
  size,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    arrowColor?: string;
    asChild?: boolean;
  }) {
  if (asChild) {
    // When asChild is true, clone the child and add arrow to it
    const child = React.Children.only(children);
    const childElement = child as React.ReactElement<{
      className?: string;
      children?: React.ReactNode;
    }>;

    return React.cloneElement(
      childElement,
      {
        className: cn(
          buttonVariants({ variant, size }),
          "group relative",
          className,
          childElement.props?.className
        ),
        ...props,
      },
      <>
        {childElement.props.children}
        {/* Omot za liniju i vrh strelice */}
        <span className="ml-3 flex items-center">
          {/* Vodoravna linija koja se širi na hover */}
          <span
            className={cn(
              "relative block h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-8",
              arrowColor ? `bg-${arrowColor}` : "bg-current"
            )}
          >
            {/* Vrh strelice (neispunjeni trokut) */}
            <span
              className={cn(
                "absolute top-1/2 right-0 h-2.5 w-2.5 -translate-y-1/2 -rotate-45 border-r-2 border-b-2 border-current",
                arrowColor ? `border-${arrowColor}` : "border-current"
              )}
            />
          </span>
        </span>
      </>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("group relative", className)}
      {...props}
    >
      {children}

      {/* Omot za liniju i vrh strelice */}
      <span className="ml-3 flex items-center">
        {/* Vodoravna linija koja se širi na hover */}
        <span
          className={cn(
            "relative block h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-8",
            arrowColor ? `bg-${arrowColor}` : "bg-current"
          )}
        >
          {/* Vrh strelice (neispunjeni trokut) */}
          <span
            className={cn(
              "absolute top-1/2 right-0 h-2.5 w-2.5 -translate-y-1/2 -rotate-45 border-r-2 border-b-2 border-current",
              arrowColor ? `border-${arrowColor}` : "border-current"
            )}
          />
        </span>
      </span>
    </Button>
  );
}

export { Button, ArrowButton, buttonVariants };
