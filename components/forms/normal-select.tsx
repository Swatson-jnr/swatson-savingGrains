import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  label?: string;
  name: string;
  placeholder?: string;
  className?: string;
  options: Option[];
  onChange?: (value: string) => void;
  value?: string;
  showBackground?: boolean;
}

const NormalInput = ({
  label,
  name,
  options,
  placeholder,
  className,
  onChange,
  value,
  showBackground = true,
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full z-99999" ref={ref}>
      {/* {label && <label htmlFor={name}>{label}</label>} */}
      <div className={`relative ${className || "max-w-[572px]"}`}>
        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full items-center justify-between rounded-lg border border-[#5D616B] bg-white px-3 text-left"
        >
          {selected ? (
            <div className="flex items-center gap-2">
              <span className="text-[#080808] font-normal text-sm">{selected.label}</span>
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          <ChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            color="#080808"
            size={18}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-10 mt-0.5 w-full rounded-md border border-[#D6D8DA] bg-white shadow-lg">
            {options.map((opt) => (
              <div
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100"
                onClick={() => {
                  onChange?.(opt.value);
                  setIsOpen(false);
                }}
              >
                <span className="text-[#343A46] text-sm font-normal">
                  {opt.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NormalInput;
