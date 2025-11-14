"use client";

import { Button } from "@/components/ui/button";
import { CountryPhoneInput } from "../country-phone-number";
import logo from "@/public/img/saving_grains_logo_dark.png";
import React from "react";

interface Props {
  phone: string;
  provider: string;
  processing: boolean;
  errors: Record<string, string>;
  providers: { value: string; label: string; image: string }[];
  onPhoneChange: (val: string) => void;
  onProviderChange: (val: string) => void;
  onContinue: () => void;
}

export const PhoneStep: React.FC<Props> = ({
  phone,
  provider,
  processing,
  errors,
  providers,
  onPhoneChange,
  onProviderChange,
  onContinue,
}) => {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-center mb-[30px]">
        <img src={logo.src} alt="Logo" width={120} />
      </div>

      {/* Title */}
      <div className="flex items-center justify-center mb-10 flex-col">
        <h1 className="text-black font-semibold text-[24px]">Welcome Back</h1>
        <p className="text-[14px] font-normal text-[#858990]">
          Kindly enter your phone number to continue
        </p>
      </div>

      {/* Phone Input */}
      <div className="flex flex-col space-y-3">
        <label
          htmlFor="Phone Number"
          className="text-sm font-normal text-[#384048] mb-[9px]"
        >
          Phone Number
        </label>

        <CountryPhoneInput
          value={phone}
          onChange={(val) => onPhoneChange(val)}
          provider={provider}
          onProviderChange={(val) => onProviderChange(val)}
          providers={providers}
        />
      </div>

      {/* Error Message */}
      {errors.phone && (
        <span className="text-sm text-red-500">{errors.phone}</span>
      )}

      {/* Continue Button */}
      <Button
        type="button"
        onClick={onContinue}
        block
        disabled={processing}
        className="h-[50px] font-semibold text-white text-[14px]"
      >
        {processing ? "Processing..." : "Continue"}
      </Button>
    </>
  );
};
