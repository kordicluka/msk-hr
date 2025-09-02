"use client";
import type React from "react";
import { Stepper } from "@/components/atoms/admin/stepper";
import { Button } from "@/components/atoms/admin/button";

export interface FormStep {
  label: string;
  status: "complete" | "current" | "upcoming" | "error";
  children: React.ReactNode;
}

interface MultiStepFormProps {
  title: string;
  steps: FormStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  isSubmitting: boolean;
  hasErrorsInStep?: (stepIndex: number) => boolean;
  onSubmit?: () => void;
}

export function MultiStepForm({
  title,
  steps,
  currentStep,
  onStepChange,
  isSubmitting,
  hasErrorsInStep,
  onSubmit,
}: MultiStepFormProps) {
  const handleStepChange = (newStep: number) => {
    // Provjeri može li ići na taj korak
    if (newStep > currentStep) {
      // Provjeri sve korake do novog koraka
      for (let i = 0; i <= newStep - 1; i++) {
        if (hasErrorsInStep && hasErrorsInStep(i)) {
          // Ne dozvoli prelazak ako ima grešaka u prethodnim koracima
          return;
        }
      }
    }

    onStepChange(newStep);
  };

  return (
    <div className="bg-white">
      <div className="left-0 pl-[26.75rem] w-full bg-white fixed z-2 top-14 ">
        <div className=" flex justify-between w-full h-12 items-center">
          <h6 className="text-base font-semibold tracking-tight pl-4">
            {title}
          </h6>{" "}
          <div className="flex">
            <Button
              type="button"
              disabled={isSubmitting}
              className="  min-w-28 mr-4"
              onClick={onSubmit}
            >
              {isSubmitting ? "Spremanje..." : "Spremi"}
            </Button>
          </div>
        </div>{" "}
        <div className="border-t border-gray-200 border-b flex justify-between w-full h-11 items-center">
          <Stepper
            steps={steps}
            onStepChange={handleStepChange}
            hasErrorsInStep={hasErrorsInStep}
          />
        </div>
      </div>{" "}
      <div className=" mx-auto  overflow-y-auto pt-23 bg-gray-100">
        <div className="flex flex-col">{steps[currentStep].children}</div>
      </div>
    </div>
  );
}
