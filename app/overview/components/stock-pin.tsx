"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OTPInput from "@/types/otp-input";
import { X } from "lucide-react";
// import OTPInput from "./otp-input";
import React from "react";

interface Props {
  phone?: string;
  passcode: string;
  setCurrentStep(step: number): void;

  processing: boolean;
  onClose: () => void;
  errors: Record<string, string>;
  onPasscodeChange: (val: string) => void;
  onSubmit: () => void;
}

export const StockPinStep: React.FC<Props> = ({
  phone,
  onClose,
  passcode,
  setCurrentStep,
  processing,
  errors,
  onPasscodeChange,
  onSubmit,
}) => {
  const handleContinue = () => {
    setCurrentStep(4);
  };
  return (
    <>
      <div className="relative">
        <div className="flex flex-col items-center justify-center">
          {/* Header */}
          <div className="text-center mb-7.5">
            <h4 className="text-3xl font-semibold text-black mb-1.5">
              Security PIN code
            </h4>
            <h4 className="text-[16px] font-normal text-[#5D616B] ml-1">
              Enter your PIN number to complete
            </h4>
          </div>

          {/* OTP Input */}
          <div className="flex items-center justify-center mb-[30px]">
            <OTPInput
              value={passcode}
              onChange={onPasscodeChange}
              numInputs={4}
              shouldAutoFocus
              renderInput={(props) => (
                <Input
                  {...props}
                  className="h-[46px] w-[46px] text-2xl text-center focus:border-[#E7B00E]"
                />
              )}
              containerStyle="grid grid-cols-4 gap-2 justify-center place-items-center"
            />
          </div>
        </div>

        {/* Error Message */}
        {errors.reason && (
          <span className="text-sm text-red-500 text-center">
            {errors.reason}
          </span>
        )}

        {/* Forgot PIN */}
        {/* <div className="text-center">
        <p className="text-[#343A46] text-[16px] font-semibold underline pb-1 mt-1">
          Forgot your PIN?
        </p>
      </div> */}

        {/* Continue Button */}
        <div className="flex justify-end gap-3 pt-10 mt-15">
          <Button
            type="submit"
            onClick={onSubmit}
            block
            disabled={processing || passcode.length > 5}
            className="w-[360px] h-[50px] text-center"
          >
            {processing ? "Verifying..." : "Continue"}
          </Button>
        </div>
      </div>
    </>
  );
};
