"use client";

import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export function Stepper({ currentStep, totalSteps, stepTitles }: StepperProps) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
        <span>
          Step {currentStep} of {totalSteps}: <strong className="text-sky-400">{stepTitles[currentStep - 1]}</strong>
        </span>
        <span>{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={idx} className="flex-1 flex items-center gap-1.5">
              <div
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? "bg-sky-500"
                    : isCurrent
                    ? "bg-gradient-to-r from-sky-500 to-indigo-600 shadow-md shadow-sky-500/30"
                    : "bg-slate-800"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
