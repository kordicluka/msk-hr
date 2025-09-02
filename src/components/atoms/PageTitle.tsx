import { ArrowButton } from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";

const pageTitleVariants = cva("w-full h-auto pb-16 md:pb-auto  pt-30", {
  variants: {
    theme: {
      default: "bg-muted text-gray-900",
      primary: "bg-primary text-white",
      transparent: "bg-transparent text-gray-900",
    },
    size: {
      sm: "lg:h-[25rem] ",
      default: "lg:h-[27rem]",
      lg: "lg:h-[29rem]",
      xl: "lg:h-[31rem]",
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
  "text-6xl font-medium tracking-tighter max-w-5xl leading-normal text-gray-900",
  {
    variants: {
      theme: {
        default: "",
        primary: "text-white",
        transparent: "",
      },
      size: {
        sm: "text-3xl md:text-4xl lg:text-5xl max-w-3xl",
        default: "text-4xl md:text-5xl lg:text-6xl max-w-5xl md:leading-17 ",
        lg: " text-5xl md:text-6xl lg:text-7xl font-semibold",
        xl: " text-5xl  md:text-7xl lg:text-8xl max-w-7xl font-semibold",
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
      sm: "text-sm lg:text-base xl:text-lg max-w-xl",
      default: "text-base lg:text-lg xl:text-xl max-w-2xl",
      lg: "text-lg lg:text-xl xl:text-2xl max-w-3xl",
      xl: "text-lg lg:text-xl xl:text-3xl max-w-4xl",
    },
  },
  defaultVariants: {
    theme: "default",
    size: "default",
  },
});

interface PageTitleProps
  extends React.ComponentProps<"section">,
    VariantProps<typeof pageTitleVariants> {
  title: string;
  description?: string;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost";
  href?: string;
}

function PageTitle({
  className,
  theme,
  size,
  align,
  title,
  description,
  buttonText,
  buttonVariant = "default",
  href,
  ...props
}: PageTitleProps) {
  return (
    <section
      className={cn(pageTitleVariants({ theme, size, align }), className)}
      {...props}
    >
      <div className={cn(pageTitleContainerVariants({ align }))}>
        <h1 className={cn(pageTitleTextVariants({ theme, size }))}>{title}</h1>

        {description && (
          <p className={cn(pageTitleDescriptionVariants({ theme, size }))}>
            {description}
          </p>
        )}

        {buttonText && href && (
          <Link href={href}>
            <ArrowButton variant={buttonVariant} className="mt-2">
              {buttonText}
            </ArrowButton>
          </Link>
        )}

        {buttonText && !href && (
          <ArrowButton variant={buttonVariant} className="mt-2">
            {buttonText}
          </ArrowButton>
        )}
      </div>
    </section>
  );
}

export { PageTitle, type PageTitleProps };
