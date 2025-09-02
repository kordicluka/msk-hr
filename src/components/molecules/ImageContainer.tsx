import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const ImageContainerVariants = cva(
  "w-full container mx-auto rounded-2xl overflow-hidden relative",
  {
    variants: {
      size: {
        sm: "h-[40rem]",
        default: "h-[50rem]",
        lg: "h-[60rem]",
        xl: "h-[70rem]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

function ImageContainer({
  size = "default",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
  size?: "sm" | "default" | "lg" | "xl" | undefined;
}) {
  return (
    <div className={cn(ImageContainerVariants({ size }), className)} {...props}>
      {children}
    </div>
  );
}

export { ImageContainer, ImageContainerVariants };
