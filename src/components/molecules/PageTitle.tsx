import { ArrowButton } from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const pageTitleVariants = cva("w-full pt-16", {
  variants: {
    theme: {
      default: "bg-muted text-gray-900",
      primary: "bg-primary text-white",
      transparent: "bg-transparent text-gray-900",
    },
    size: {
      sm: "h-[24rem]",
      default: "h-[32rem]",
      lg: "h-[40rem]",
      xl: "h-[48rem]",
    },
    align: {
      left: "",
      center: "",
      right: "",
    },
  },
  defaultVariants: {
    theme: "default",
    size: "default",
    align: "left",
  },
});

const pageTitleContainerVariants = cva(
  "container mx-auto px-4 lg:px-0 flex flex-col justify-center h-full gap-6",
  {
    variants: {
      align: {
        left: "items-start text-left",
        center: "items-center text-center",
        right: "items-end text-right",
      },
    },
    defaultVariants: {
      align: "left",
    },
  }
);

const pageTitleTextVariants = cva(
  "text-6xl font-medium tracking-tighter max-w-5xl leading-[1.1] text-gray-900",
  {
    variants: {
      theme: {
        default: "",
        primary: "text-white",
        transparent: "",
      },
      size: {
        sm: "text-4xl max-w-3xl",
        default: "text-6xl max-w-5xl",
        lg: "text-7xl max-w-6xl font-semibold",
        xl: "text-8xl max-w-7xl font-semibold",
      },
    },
    defaultVariants: {
      theme: "default",
      size: "default",
    },
  }
);

const pageTitleDescriptionVariants = cva("font-light leading-10 max-w-2xl", {
  variants: {
    theme: {
      default: "text-gray-600",
      primary: "text-white/95",
      transparent: "text-gray-600",
    },
    size: {
      sm: "text-lg max-w-xl",
      default: "text-xl max-w-2xl",
      lg: "text-2xl max-w-3xl",
      xl: "text-3xl max-w-4xl",
    },
  },
  defaultVariants: {
    theme: "default",
    size: "default",
  },
});

interface PageTitleProps
  extends React.ComponentProps<"section">,
    VariantProps<typeof pageTitleVariants> {}

function PageTitle({
  className,
  theme,
  size,
  align,
  children,
  ...props
}: PageTitleProps) {
  return (
    <section
      className={cn(pageTitleVariants({ theme, size, align }), className)}
      {...props}
    >
      <div className={cn(pageTitleContainerVariants({ align }))}>
        {children}
      </div>
    </section>
  );
}

interface PageTitleTextProps
  extends React.ComponentProps<"h1">,
    Pick<VariantProps<typeof pageTitleTextVariants>, "theme" | "size"> {
  children: React.ReactNode;
}

function PageTitleText({
  className,
  children,
  theme,
  size,
  ...props
}: PageTitleTextProps) {
  return (
    <h1
      className={cn(pageTitleTextVariants({ theme, size, className }))}
      {...props}
    >
      {children}
    </h1>
  );
}

interface PageTitleDescriptionProps
  extends React.ComponentProps<"p">,
    Pick<VariantProps<typeof pageTitleDescriptionVariants>, "theme" | "size"> {
  children: React.ReactNode;
}

function PageTitleDescription({
  className,
  children,
  theme,
  size,
  ...props
}: PageTitleDescriptionProps) {
  return (
    <p
      className={cn(pageTitleDescriptionVariants({ theme, size }), className)}
      {...props}
    >
      {children}
    </p>
  );
}

function PageTitleButton({
  className,
  children,
  variant = "default",
  ...props
}: React.ComponentProps<"button"> & {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | undefined;
}) {
  return (
    <ArrowButton variant={variant} className={cn("", className)} {...props}>
      {children}
    </ArrowButton>
  );
}

export {
  PageTitle,
  PageTitleText,
  PageTitleDescription,
  PageTitleButton,
  type PageTitleProps,
};
