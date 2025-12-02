import { Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import gh from "@/public/img/flag.svg";
import ksh from "@/public/img/kenya.png";

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface CountryDropdownProps {
  width?: string;
  height?: string;
}

const countries: Country[] = [
  { code: "GH", name: "Ghana", flag: gh.src },
  { code: "KE", name: "Kenya", flag: ksh.src },
];

export const CountryDropdown: React.FC<CountryDropdownProps> = ({
  width = "w-[150px]",
  height,
}) => {
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
    <div ref={dropdownRef} className={`relative ${width} ${height}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-gray-300 h-11 p-2.5 text-sm text-gray-700 hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <Image
            src={selected.flag}
            alt={selected.name}
            width={20}
            height={20}
          />
          <span>{selected.name}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[#68798F] transform transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border border-[#5D616B] bg-white text-black">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleSelect(country)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              <Image
                src={country.flag}
                alt={country.name}
                width={20}
                height={20}
              />
              <span>{country.name}</span>
              {selected.code === country.code && (
                <Check size={18} className="ml-auto text-black" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
