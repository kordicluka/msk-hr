"use client";

import * as React from "react";
import { useFormField } from "./form";
import { FloatingLabelTextarea } from "./floating-label-textarea";

interface FormFloatingLabelTextareaProps
  extends React.ComponentPropsWithoutRef<typeof FloatingLabelTextarea> {
  description?: string;
}

const FormFloatingLabelTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormFloatingLabelTextareaProps
>(({ className, description, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <FloatingLabelTextarea
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      error={!!error}
      description={description}
      className={className}
      {...props}
    />
  );
});

FormFloatingLabelTextarea.displayName = "FormFloatingLabelTextarea";

export { FormFloatingLabelTextarea };
