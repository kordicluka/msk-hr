// components/ui/marquee.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/* -------------------------------------------------------------------------- */
/*                                 Marquee Root                               */
/* -------------------------------------------------------------------------- */

const marqueeVariants = cva("w-full overflow-hidden relative", {
  variants: {
    direction: {
      horizontal: "flex",
      vertical: "flex flex-col",
    },
    size: {
      default: "min-h-[100px]",
      sm: "min-h-[70px]",
      lg: "min-h-[150px]",
    },
    gap: {
      default: "gap-4",
      sm: "gap-2",
      lg: "gap-6",
      none: "gap-0",
    },
  },
  defaultVariants: {
    direction: "horizontal",
    size: "default",
    gap: "default",
  },
});

export interface MarqueeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof marqueeVariants> {
  speed?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
}

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      className,
      direction = "horizontal",
      size = "default",
      gap = "default",
      speed = 40,
      pauseOnHover = false,
      reverse = false,
      children,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const [contentWidth, setContentWidth] = React.useState(0);
    const [contentHeight, setContentHeight] = React.useState(0);
    const [isHovering, setIsHovering] = React.useState(false);

    // Function to clone child elements for continuous loop effect
    const cloneChildren = React.useCallback(() => {
      // Clone the children to create a loop
      const childrenArray = React.Children.toArray(children);
      return [...childrenArray, ...childrenArray];
    }, [children]);

    // Animation duration calculation
    const getDuration = React.useCallback(() => {
      if (direction === "horizontal") {
        return contentWidth / speed;
      }
      return contentHeight / speed;
    }, [direction, contentWidth, contentHeight, speed]);

    // Measure container and content dimensions on mount and resize
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const updateDimensions = () => {
        const firstChild = container.querySelector(".marquee-content");
        if (firstChild) {
          setContentWidth(firstChild.scrollWidth);
          setContentHeight(firstChild.scrollHeight);
        }
      };

      // Initial measurement
      updateDimensions();

      // Set up resize observer
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
      };
    }, [children]);

    // Animation styles
    const getAnimationStyle = () => {
      const duration = getDuration();

      if (isHovering && pauseOnHover) {
        return { animationPlayState: "paused" as const };
      }

      if (direction === "horizontal") {
        return {
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        };
      } else {
        return {
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        };
      }
    };

    // Marquee animation class based on direction
    const getAnimationClass = () => {
      if (direction === "horizontal") {
        return "animate-marquee-horizontal";
      }
      return "animate-marquee-vertical";
    };

    return (
      <div
        ref={ref}
        className={cn(marqueeVariants({ direction, size, gap }), className)}
        {...props}
      >
        <style jsx global>{`
          @keyframes marqueeHorizontal {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes marqueeVertical {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }

          .animate-marquee-horizontal {
            animation: marqueeHorizontal linear infinite;
          }

          .animate-marquee-vertical {
            animation: marqueeVertical linear infinite;
          }
        `}</style>

        <div
          ref={containerRef}
          className={cn("flex", direction === "vertical" && "flex-col", gap)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className={cn(
              "marquee-content flex",
              direction === "vertical" && "flex-col",
              gap,
              getAnimationClass()
            )}
            style={getAnimationStyle()}
          >
            {cloneChildren()}
          </div>
        </div>
      </div>
    );
  }
);

Marquee.displayName = "Marquee";

/* -------------------------------------------------------------------------- */
/*                              Marquee Item                                 */
/* -------------------------------------------------------------------------- */

const marqueeItemVariants = cva("flex items-center justify-center", {
  variants: {
    size: {
      default: "min-w-[200px]",
      sm: "min-w-[150px]",
      lg: "min-w-[300px]",
      auto: "min-w-auto",
    },
    variant: {
      default: "bg-transparent rounded-md shadow p-4",
      ghost: "bg-transparent p-4",
      outline: "bg-transparent border rounded-md p-4",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

export interface MarqueeItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof marqueeItemVariants> {}

const MarqueeItem = React.forwardRef<HTMLDivElement, MarqueeItemProps>(
  ({ className, size, variant, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(marqueeItemVariants({ size, variant }), className)}
      {...props}
      key={Math.random() + "marquee-item"}
    >
      {children}
    </div>
  )
);

MarqueeItem.displayName = "MarqueeItem";

export { Marquee, MarqueeItem };
