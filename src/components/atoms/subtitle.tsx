import type React from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

const subtitleVariants = cva(
  "relative flex items-center font-bold uppercase bg-black text-white px-6 py-2 pl-3 border-l-3 border-accent",
  {
    variants: {
      variant: {
        default: "",
        foreground: "bg-primary-foreground text-accent",
        transparent: "bg-transparent text-primary",
      },
      size: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Subtitle({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof subtitleVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="subtitle"
      className={cn(subtitleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Subtitle };
