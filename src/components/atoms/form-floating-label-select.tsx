"use client";

import * as React from "react";
import { useFormField } from "./form";
import { FloatingLabelSelect } from "./floating-label-select";

interface FormFloatingLabelSelectProps
  extends React.ComponentPropsWithoutRef<typeof FloatingLabelSelect> {
  description?: string;
}

const FormFloatingLabelSelect = React.forwardRef<
  React.ElementRef<typeof FloatingLabelSelect>,
  FormFloatingLabelSelectProps
>(({ className, description, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <FloatingLabelSelect
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

FormFloatingLabelSelect.displayName = "FormFloatingLabelSelect";

export { FormFloatingLabelSelect };
