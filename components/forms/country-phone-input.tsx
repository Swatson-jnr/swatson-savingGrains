import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const PhoneInput = ({
  value,
  onChange,
  countryCodes = [
    { code: "+233", country: "GH" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "IN" },
    { code: "+234", country: "NG" },
    { code: "+86", country: "CN" },
    { code: "+81", country: "JP" },
    { code: "+49", country: "DE" },
    { code: "+33", country: "FR" },
    { code: "+61", country: "AU" },
  ],
  placeholder = "247 089 000",
  label = "Phone Number",
  showSelected = true,
}: {
  value: string;
  onChange: (phoneNumber: string) => void;
  countryCodes?: Array<{ code: string; country: string }>;
  placeholder?: string;
  label?: string;
  showSelected?: boolean;
}) => {
  // Parse the phone number to extract country code and number
  const getCountryCodeAndNumber = (fullNumber: string) => {
    if (!fullNumber) return { countryCode: "+1", phoneNumber: "" };

    // Find matching country code
    const matchedCode = countryCodes.find((cc) =>
      fullNumber.startsWith(cc.code)
    );
    if (matchedCode) {
      return {
        countryCode: matchedCode.code,
        phoneNumber: fullNumber.slice(matchedCode.code.length),
      };
    }

    return { countryCode: "+1", phoneNumber: fullNumber };
  };

  const { countryCode, phoneNumber } = getCountryCodeAndNumber(value);

  const handleCountryCodeChange = (newCode: string) => {
    onChange(newCode + phoneNumber);
  };

  const handlePhoneNumberChange = (newNumber: string) => {
    onChange(newNumber);
  };

  return (
    <div className="w-full max-w-xl">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="flex border border-[#5D616B] rounded-lg overflow-hidden h-12">
        <div className="relative">
          <select
            value={countryCode}
            onChange={(e) => handleCountryCodeChange(e.target.value)}
            className="appearance-none bg-white px-3 py-2.5 pr-8 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer h-full"
          >
            {countryCodes.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code}
                {/* {item.country} */}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        <input
          type="tel"
          value={phoneNumber}
          // const value = e.target.value.replace(/\D/g, "");

          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            handlePhoneNumberChange(value);
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
        />
      </div>
    </div>
  );
};

export default PhoneInput;
