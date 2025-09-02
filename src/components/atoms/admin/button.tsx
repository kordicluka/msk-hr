import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex rounded-xs items-center justify-center gap-2 whitespace-nowrap cursor-pointer  transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-secondary border border-secondary shadow-sm text-white",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border text-gray-700 border-gray-200 text-primary  bg-gradient-to-b from-gray-50 to-gray-100 hover:bg-muted dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        accent:
          "bg-accent text-primary border border-accent shadow-xs hover:bg-accent/80",
        secondary:
          "bg-primary text-white border border-primary shadow-xs hover:bg-primary/90",
        ghost: "bg-transparent border-none",
        link: "text-primary underline-offset-4 hover:underline",
        outlinePrimary:
          "border border-background text-background  bg-transparent hover:bg-background/5 dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
      },
      size: {
        default: " px-5 text-sm py-2.5 has-[>svg]:px-3",
        sm: " px-2 text-xs  py-2 has-[>svg]:px-2",
        lg: "",
        icon: "size-10",
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


export { Button, buttonVariants };
