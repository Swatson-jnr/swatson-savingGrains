import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Provider {
  value: string;
  label: string;
  image?: string;
  icon?: React.ReactNode;
}

interface MobileMoneyInputProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  provider: string;
  onProviderChange: (val: string) => void;
  providers: Provider[];
}

export const CountryPhoneInput: React.FC<MobileMoneyInputProps> = ({
  label = "Mobile Money Number",
  value,
  onChange,
  provider,
  onProviderChange,
  providers,
}) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); //

  const selectedProvider =
    providers.find((p) => p.value === provider) || providers[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = focused || value || provider;

  return (
    <div
      className="relative w-full max-w-[460px] text-black"
      ref={containerRef}
    >
      {/* Input container */}
      <div className="relative flex h-14 items-center overflow-visible text-[#343A46] text-[10px] rounded-lg border border-[#5D616B]  bg-white">
        {/* Provider select */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-full w-[104px] items-center justify-center gap-2 font-semibold border-none bg-[#F2F2F2] rounded-bl-lg rounded-tl-lg text-[#343A46] text-[10px] focus:outline-none"
        >
          {selectedProvider && (
            <>
              {selectedProvider.image && (
                <div className="bg-[#D6D8DA] rounded-full p-1">
                  <img
                    src={selectedProvider.image}
                    alt={selectedProvider.label}
                    className="h-5 w-5 rounded-full object-contain"
                  />
                </div>
              )}
              <span>{selectedProvider.label}</span>
              <ChevronDown />
            </>
          )}
        </button>

        {/* Divider */}
        {/* <div className="h-[70%] w-px bg-gray-300" /> */}

        {/* Phone number input */}
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=""
          className="peer flex-1 bg-transparent px-3 text-sm text-gray-800 focus:outline-none"
        />

        {/* Dropdown menu */}
        {open && (
          <div className="absolute left-0 top-[110%] z-9999 w-[105px] rounded-md border border-gray-200 bg-white shadow-md">
            {providers.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onProviderChange(opt.value);
                  setOpen(false);
                }}
                className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-[#343A46] text-[10px] hover:bg-gray-100 ${
                  provider === opt.value ? "bg-gray-50" : ""
                }`}
              >
                {opt.image && (
                  <img
                    src={opt.image}
                    alt={opt.label}
                    className="h-9 w-5 rounded-full object-contain"
                  />
                )}
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
