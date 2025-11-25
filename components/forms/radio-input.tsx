import React from "react";

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
  const defaultOptions: RadioOption[] = [
    { id: "1", label: "Mobile Money", value: "mobile_money" },
    { id: "2", label: "Bank Transfer", value: "bank_transfer" },
    { id: "3", label: "Cash Payment", value: "cash" },
  ];

  const displayOptions = options.length > 0 ? options : defaultOptions;
  const selectedValue = value ?? "";

  const handleChange = (optionValue: string) => {
    onChange?.(optionValue);
  };

  return (
    <div className="w-full max-w-xl space-y-4 flex justify-between gap-4">
      {displayOptions.map((option) => {
        const isSelected = selectedValue === option.value;
        // ✅ Create unique ID using name and option.id
        const uniqueId = `${name}-${option.id}`;

        return (
          <label
            key={option.id}
            htmlFor={uniqueId} // ✅ Use unique ID
            className={`flex items-center justify-between w-[282px] h-12 gap-4 p-4 rounded-[10px] border cursor-pointer transition-all duration-200 ${
              isSelected
                ? "border-[#343A46] bg-white"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          >
            <span
              className={`text-base font-medium ${
                isSelected ? "text-[#343A46] font-bold" : "text-gray-400"
              }`}
            >
              {option.label}
            </span>

            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                id={uniqueId} // ✅ Use unique ID
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => handleChange(option.value)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "border-black" : "border-gray-400"
                }`}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 bg-black rounded-full" />
                )}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
