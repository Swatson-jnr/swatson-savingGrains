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

export const MobileMoneyInput: React.FC<MobileMoneyInputProps> = ({
  label = "Mobile Money Number",
  value,
  onChange,
  provider,
  onProviderChange,
  providers,
}) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); // ✅ use container ref only

  const selectedProvider = providers.find((p) => p.value === provider);

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
    <div className="relative w-full max-w-[572px]" ref={containerRef}>
      {/* Floating label */}
      <label
        className="text-[#343A46] absolute -top-2 left-3 z-10 bg-white px-1 text-xs font-normal transition-all duration-200"
      >
        {label}
      </label>

      {/* Input container */}
      <div className="relative flex h-[56px] items-center overflow-visible rounded-[8px] border border-[#E7B00E] bg-white px-2">
        {/* Provider select */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-full w-[120px] items-center justify-center gap-2 border-none bg-transparent text-sm text-gray-700 focus:outline-none"
        >
          {selectedProvider ? (
            <>
              {selectedProvider.image && (
                <img
                  src={selectedProvider.image}
                  alt={selectedProvider.label}
                  className="h-5 w-5 rounded-full object-contain"
                />
              )}
              <span>{selectedProvider.label}</span>
            </>
          ) : (
            <span className="text-gray-500">Select</span>
          )}
        </button>

        {/* Divider */}
        <div className="h-[70%] w-px bg-gray-300" />

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

        {/* ✅ Dropdown menu */}
        {open && (
          <div className="absolute left-2 top-[110%] z-[9999] w-[575px] rounded-md border border-gray-200 bg-white shadow-md">
            {providers.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onProviderChange(opt.value);
                  setOpen(false);
                }}
                className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 ${
                  provider === opt.value ? "bg-gray-50" : ""
                }`}
              >
                {opt.image && (
                  <img
                    src={opt.image}
                    alt={opt.label}
                    className="h-9 w-9 rounded-full object-contain"
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
