"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Title from "./title";

interface Props {
  setCurrentStep(step: number): void;
  processing: boolean;
  buttonText: string;
  onClose: () => void;
  onSubmit: () => void;
  reset: () => void;
}

export const Success: React.FC<Props> = ({
  onClose,
  setCurrentStep,
  buttonText,
  processing,
  reset,

}) => {
  const sellAgainHandler = () => {
    reset();
    setCurrentStep(1);
  };
  const handleDone = () => {
    onClose();
    reset();
    setCurrentStep(1);
  };
  return (
    <>
      <div className="relative">
        <div className="flex flex-col items-center justify-center text-center">
          {/* image */}
          <img src={"../img/success.png"} alt="" className="w-[248px]" />
          {/* Header */}
          <div className="text-center mb-2">
            <Title
              text="Transfer successfully initiated"
              weight="semibold"
              level={5}
            />
          </div>

          <p className="text-[#858990] font-medium text-[14px]">
            Your grain transfer is in motion, ensuring a seamless move to
            warehouse with precision{" "}
          </p>
        </div>

        {/* Continue Button */}
        <div className="flex w-[350px] mx-auto justify-between gap-3 pt-10 mt-10">
          <Button
            type="submit"
            onClick={sellAgainHandler}
            block
            className="w-[162px] h-12 text-center bg-white text-[#E7B00E] hover:bg-white cursor-pointer"
          >
            {processing ? "Verifying..." : buttonText}
          </Button>
          <Button
            type="submit"
            onClick={handleDone}
            block
            className="w-[162px] h-12 text-center bg-[#E7B00E] text-white cursor-pointer"
          >
            {processing ? "Verifying..." : "Done"}
          </Button>
        </div>
      </div>
    </>
  );
};
