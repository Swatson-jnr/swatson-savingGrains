"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Title from "./title";

interface Props {
  phone?: string;
  passcode: string;
  setCurrentStep(step: number): void;
  processing: boolean;
  onClose: () => void;
  errors: Record<string, string>;
  onPasscodeChange: (val: string) => void;
  onSubmit: () => void;
  reset: () => void;
}

export const Success: React.FC<Props> = ({
  phone,
  onClose,
  passcode,
  setCurrentStep,
  processing,
  reset,
  errors,
  onPasscodeChange,
  onSubmit,
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

        {/* Error Message */}
        {/* {errors.reason && (
          <span className="text-sm text-red-500 text-center">
            {errors.reason}
          </span>
        )} */}

        {/* Forgot PIN */}
        {/* <div className="text-center">
        <p className="text-[#343A46] text-[16px] font-semibold underline pb-1 mt-1">
          Forgot your PIN?
        </p>
      </div> */}

        {/* Continue Button */}
        <div className="flex w-[350px] mx-auto justify-between gap-3 pt-10 mt-10">
          <Button
            type="submit"
            onClick={sellAgainHandler}
            block
            // disabled={processing || passcode.length > 5}
            className="w-[162px] h-12 text-center bg-white text-[#E7B00E] hover:bg-white cursor-pointer"
          >
            {processing ? "Verifying..." : "Sell Again"}
          </Button>
          <Button
            type="submit"
            onClick={handleDone}
            block
            disabled={processing || passcode.length > 5}
            className="w-[162px] h-12 text-center bg-[#E7B00E] text-white cursor-pointer"
          >
            {processing ? "Verifying..." : "Done"}
          </Button>
        </div>
      </div>
    </>
  );
};
