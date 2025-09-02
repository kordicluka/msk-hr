"use client";

import * as React from "react";
import { useFormField } from "./form";
import { FloatingLabelInput } from "./floating-label-input";

interface FormFloatingLabelInputProps
  extends React.ComponentPropsWithoutRef<typeof FloatingLabelInput> {
  description?: string;
}

const FormFloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  FormFloatingLabelInputProps
>(({ className, description, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <FloatingLabelInput
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

FormFloatingLabelInput.displayName = "FormFloatingLabelInput";

export { FormFloatingLabelInput };
