import React, { useState } from "react";

interface RadioOption {
  id: string;
  label: string;
  value: string;
}

interface RadioInputProps {
  options?: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
}

export default function RadioInput({
  options = [],
  value,
  onChange,
  name = "radio-group",
  className = "",
}: RadioInputProps) {
  const [selectedValue, setSelectedValue] = useState<string>(value || "");

  // Default options if none provided
  const defaultOptions: RadioOption[] = [
    { id: "1", label: "Mobile Money", value: "mobile_money" },
    { id: "2", label: "Bank Transfer", value: "bank_transfer" },
    { id: "3", label: "Cash Payment", value: "cash" },
  ];

  const displayOptions = options.length > 0 ? options : defaultOptions;

  const handleChange = (optionValue: string) => {
    setSelectedValue(optionValue);
    if (onChange) {
      onChange(optionValue);
    }
  };

  return (
    <div className="w-full max-w-xl space-y-4 flex justify-between gap-4">
    

      {displayOptions.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <label
            key={option.id}
            htmlFor={option.id}
            className={`flex items-center justify-between w-[282px] h-12 gap-4 p-4 rounded-[10px] border border-[#8796A9] cursor-pointer transition-all duration-200 ${
              isSelected
                ? "border-[#343A46] bg-white"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          >
            {/* Label Text */}
            <span
              className={`text-base font-medium transition-colors duration-200 ${
                isSelected ? "text-[#343A46] font-bold text-[14px]" : "text-gray-400"
              }`}
            >
              {option.label}
            </span>
            {/* Custom Radio Button */}
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                id={option.id}
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => handleChange(option.value)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? "border-black bg-white"
                    : "border-gray-400 bg-white"
                }`}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                )}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
