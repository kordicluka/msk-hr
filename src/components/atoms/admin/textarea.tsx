import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-b border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:border-b-ring focus-visible:ring-b-ring/50 aria-invalid:border-b-destructive aria-invalid:ring-b-destructive/20 dark:aria-invalid:ring-b-destructive/40 dark:bg-input/30 flex field-sizing-content min-h-16 w-full bg-transparent px-3 py-2 text-xl transition-all outline-none focus-visible:ring-b-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
