"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Step = {
  label: string;
  status: "complete" | "current" | "upcoming" | "error";
};

interface StepperProps {
  steps: Step[];
  onStepChange?: (index: number) => void;
  hasErrorsInStep?: (stepIndex: number) => boolean;
}

export const Stepper = ({
  steps,
  onStepChange,
  hasErrorsInStep,
}: StepperProps) => {
  const handleStepClick = (index: number) => {
    // Provjeri može li kliknuti na taj korak
    if (hasErrorsInStep) {
      // Provjeri ima li grešaka u prethodnim koracima
      for (let i = 0; i < index; i++) {
        if (hasErrorsInStep(i)) {
          // Ne dozvoli prelazak ako ima grešaka u prethodnim koracima
          return;
        }
      }
    }

    onStepChange?.(index);
  };

  return (
    <nav className="flex justify-between  h-full">
      {steps.map((step, index) => {
        const hasErrors = hasErrorsInStep ? hasErrorsInStep(index) : false;
        const canClick = onStepChange && (!hasErrorsInStep || !hasErrors);

        return (
          <div
            key={step.label}
            className={cn(
              "flex items-center group gap-2 px-8 h-full border-r border-gray-200",
              step.status === "current" && "bg-blue-500",
              step.status === "complete" && "bg-gray-100 opacity-50",
              step.status === "upcoming" && "bg-gray-100 opacity-50",
              step.status === "error" && "bg-red-50",
              canClick &&
                step.status !== "current" &&
                "cursor-pointer hover:bg-gray-50",
              hasErrors && "cursor-not-allowed"
            )}
            onClick={() => canClick && !hasErrors && handleStepClick(index)}
          >
            <div
              className={cn(
                "flex items-center justify-center h-5 w-5 rounded-full  text-xs font-medium transition-colors",
                step.status === "complete" &&
                  "bg-green-600 text-white border-green-600",
                step.status === "current" &&
                  "bg-white text-600 border-blue-500",
                step.status === "upcoming" &&
                  "bg-gray-300 text-white border-gray-300 group-hover:border-gray-400",
                step.status === "error" &&
                  "bg-red-600 text-white border-red-600"
              )}
            >
              {step.status === "complete" ? (
                <Check className="h-4 w-4" />
              ) : (
                <span
                  className={cn(
                    "text-white",
                    step.status === "current" && "text-blue-500"
                  )}
                >
                  {index + 1}
                </span>
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                step.status === "current"
                  ? "text-white"
                  : step.status === "complete"
                  ? "text-green-600"
                  : "text-gray-500 group-hover:text-gray-700",
                step.status === "error" && "text-red-600"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
};
