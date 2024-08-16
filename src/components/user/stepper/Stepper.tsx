import React from "react";


interface StepperComponentProps {
  currentStep: number;
  stepTitles: { title: string }[];
}

const StepperComponent: React.FC<StepperComponentProps> = ({ currentStep, stepTitles }) => {
  const activeColor = (index: number) => currentStep >= index ? 'bg-blue-500' : 'bg-gray-300';

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="flex items-center">
        {stepTitles.map((_, index) => (
          <React.Fragment key={index}>
            <div className={`w-5 h-5 rounded-full ${activeColor(index)}`}></div>
            {index < stepTitles.length - 1 && <div className={`w-44 h-1 ${activeColor(index)}`}></div>}
          </React.Fragment>
        ))}
      </div>
      <div className="flex mt-4">
        {stepTitles.map((step, index) => (
          <div key={index} className="mx-14">
            {step.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepperComponent;
