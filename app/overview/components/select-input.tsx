import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
  image?: string; // URL for image
}

interface SelectInputProps {
  label?: string;
  name: string;
  placeholder?: string;
  icon?: string;
  options: Option[];
  onChange?: (value: string) => void;
  value?: string;
}

const SelectInput = ({
  label,
  name,
  options,
  icon,
  placeholder,
  onChange,
  value,
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
    <div className="flex flex-col gap-3" ref={ref}>
      <label htmlFor={name}>{label}</label>
      <div className="relative max-w-[572px]">
        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full items-center justify-between rounded-lg border border-[#5D616B] bg-white px-3 text-left"
        >
          {selected ? (
            <div className="flex items-center gap-2">
              {/* Render icon OR image */}
              {/* {selected.icon ? (
                selected.icon
              ) : selected.image ? (
                <img
                  src={selected.image}
                  alt={selected.label}
                  className="h-5 w-5 object-contain"
                />
              ) : null} */}
              <span>{selected.label}</span>
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          <ChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            size={18}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            {options.map((opt) => (
              <div
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100"
                onClick={() => {
                  onChange?.(opt.value);
                  setIsOpen(false);
                }}
              >
                {/* Rendering icon OR image */}
                <div
                  className={`flex justify-center ${
                    opt.icon || opt.image ? "bg-[#D6D8DA]" : null
                  } h-[30px] w-[30px] items-center rounded-full p-1`}
                >
                  {" "}
                  {opt.icon ? (
                    opt.icon
                  ) : opt.image ? (
                    <img
                      src={opt.image}
                      alt={opt.label}
                      className="h-7 w-7 object-contain"
                    />
                  ) : null}{" "}
                </div>
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInput;
