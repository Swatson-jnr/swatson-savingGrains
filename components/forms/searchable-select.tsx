import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";

interface Option {
  id: number | string;
  label: string;
  value: string;
  category?: string;
}

interface SearchableSelectProps {
  options?: Option[];
  placeholder?: string;
  label?: string;
  value?: Option | null;
  onChange?: (option: Option | null) => void;
  className?: string;
}

export default function SearchableSelect({
  options = [],
  placeholder = "Select an option...",
  label = "Select Product",
  value,
  onChange,
  className = "",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    value || null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Default options if none provided
  const defaultOptions: Option[] = [
    { id: 1, label: "Maize", value: "maize", category: "Grains" },
    { id: 2, label: "Cashew", value: "cashew", category: "Nuts" },
    { id: 3, label: "Rice", value: "rice", category: "Grains" },
    { id: 4, label: "Wheat", value: "wheat", category: "Grains" },
    { id: 5, label: "Sorghum", value: "sorghum", category: "Grains" },
    { id: 6, label: "Millet", value: "millet", category: "Grains" },
    { id: 7, label: "Groundnut", value: "groundnut", category: "Nuts" },
    { id: 8, label: "Soybean", value: "soybean", category: "Legumes" },
    { id: 9, label: "Cowpea", value: "cowpea", category: "Legumes" },
    { id: 10, label: "Bambara Beans", value: "bambara", category: "Legumes" },
  ];

  const displayOptions = options.length > 0 ? options : defaultOptions;

  // Filter options based on search term
  const filteredOptions = displayOptions.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.category &&
        option.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Sync with external value prop
  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value);
    }
  }, [value]);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm("");
    if (onChange) {
      onChange(option);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOption(null);
    setSearchTerm("");
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className="w-full max-w-xl">
      {/* <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label> */}

      <div className="relative" ref={dropdownRef}>
        {/* Select Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left bg-white border border-[#5D616B] rounded-lg  transition-all duration-200 flex items-center justify-between"
        >
          {/* focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-500 focus:outline-none */}
          <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-2">
            {/* {selectedOption && (
                <X
                  size={16}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={handleClear}
                />
              )} */}
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-[51px] pl-10 pr-4 py-2 border border-[#D6D8DA] rounded-md focus:outline-none focus:ring-1 focus:ring-[#E7B00E] focus:border-transparent"
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors duration-150 flex items-center justify-between ${
                      selectedOption?.id === option.id
                        ? "text-indigo-900"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 rounded-full bg-[#F2F3F5] p-2 sm:p-2.5">
                        <img
                          src="../img/building.svg"
                          alt="wallet"
                          className="h-4 w-4 object-contain sm:h-5 sm:w-5"
                        />
                        {/* <div className="text-xs text-gray-500">
                            {option.category}
                          </div> */}
                      </div>

                      <div className="font-normal text-[#080808] text-sm">
                        {option.label}
                      </div>
                    </div>
                    {/* {selectedOption?.id === option.id && (
                      <svg
                        className="w-5 h-5 text-indigo-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )} */}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>No options found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
