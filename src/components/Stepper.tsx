import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  maxAccessibleStep: number;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  onSelectStep,
  maxAccessibleStep
}) => {
  const steps = [
    { num: 1, title: 'Plan Type & Days', sub: 'Custom or Chef Program' },
    { num: 2, title: 'Meal Quality Tier', sub: 'Basic / Standard / Premium' },
    { num: 3, title: 'Generate & Review', sub: 'Plan & Meal Schedule' }
  ];

  return (
    <div className="stepper-container">
      <div className="stepper-list">
        {steps.map((step) => {
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;
          const isClickable = step.num <= maxAccessibleStep;

          return (
            <div
              key={step.num}
              className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => isClickable && onSelectStep(step.num)}
              style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
            >
              <div className="step-circle">
                {isCompleted ? <Check size={16} strokeWidth={3} /> : step.num}
              </div>
              <div className="step-text">
                <span className="step-title">{step.title}</span>
                <span className="step-subtitle">{step.sub}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
