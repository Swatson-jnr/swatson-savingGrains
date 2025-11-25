import { Check, ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
///import gh from "../../../public/img/flag.svg";
import ksh from "../public/img/kenya.png";
import gh from "../public/img/flag.svg"
interface Country {
  code: string;
  name: string;
  flag: string;
}

const countries: Country[] = [
  { code: "GH", name: "+233", flag: "../img/flag.svg" },
  { code: "KE", name: "Kenya", flag: "..img/kenya.png" },
];

export const PhoneNumberDrown: React.FC = () => {
  const [selected, setSelected] = useState<Country>(countries[0]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (country: Country) => {
    setSelected(country);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-[130px]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-md  px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <img src={selected.flag} alt={selected.name} className="w-[20px]" />
          <span>{selected.name}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transform text-[#68798F] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-[6px]  bg-[#F2F2F2]">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleSelect(country)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
            >
              <img src={country.flag} alt={country.name} className="w-[20px]" />
              <span>{country.name}</span>
            {selected.code === country.code && (
                <Check size={18} className="text-[#000]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
