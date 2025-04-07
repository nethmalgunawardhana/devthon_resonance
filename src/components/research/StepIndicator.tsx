"use client";
import React from 'react';

interface StepIndicatorProps {
  steps: {
    title: string;
    completed: boolean;
  }[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full border-2 text-sm font-medium ${
                  index + 1 === currentStep
                    ? 'border-red-800 text-red-800'
                    : step.completed
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 text-gray-300'
                }`}
              >
                {step.completed ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="text-sm mt-2 text-gray-700">{step.title}</div>
              {/* Removing the hardcoded "7/12" display */}
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-4 ${
                  index < currentStep - 1 ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;