import React from "react";

interface Step {
  title: string;
  subtitle?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number; // 1-based index
  activeColor?: string;
  inactiveColor?: string;
  vertical?: boolean;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  activeColor = "#E7B00E",
  inactiveColor = "#EAECF0",
  vertical = true,
}) => {
  return (
    <div
      className={`flex ${
        vertical ? "flex-col gap-8" : "flex-row items-center gap-6"
      } relative`}
    >
      {steps.map((step, index) => {
        const isActive = index + 1 <= currentStep;
        const isCompleted = index + 1 < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="relative flex items-center">
            {/* Indicator Circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={`flex h-[32px] w-[32px] items-center justify-center rounded-full border-2`}
                style={{
                  borderColor: isActive ? activeColor : inactiveColor,
                }}
              >
                {isCompleted ? (
                  <span
                    className="text-[14px] font-bold"
                    style={{ color: activeColor }}
                  >
                    ✓
                  </span>
                ) : (
                  <span
                    className="h-[10px] w-[10px] rounded-full"
                    style={{
                      backgroundColor: isActive ? activeColor : inactiveColor,
                    }}
                  ></span>
                )}
              </div>

              {/* Line connector (only if not last step) */}
              {!isLast && vertical && (
                <div
                  className="absolute top-[32px] left-1/2 -translate-x-1/2 w-[2px]"
                  style={{
                    height: "40px",
                    backgroundColor: isActive ? activeColor : inactiveColor,
                  }}
                />
              )}
            </div>

            {/* Labels */}
            <div className="ml-3">
              <h3
                className="text-[16px] font-semibold"
                style={{ color: isActive ? activeColor : "#344054" }}
              >
                {step.title}
              </h3>
              {step.subtitle && (
                <h4
                  className="text-[14px] font-normal"
                  style={{
                    color: isActive ? activeColor : "#475467",
                  }}
                >
                  {step.subtitle}
                </h4>
              )}
            </div>

            {/* Horizontal line connector */}
            {!isLast && !vertical && (
              <div
                className="h-[2px] mx-3 flex-1"
                style={{
                  backgroundColor: isActive ? activeColor : inactiveColor,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSteps;
