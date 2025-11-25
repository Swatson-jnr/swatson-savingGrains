import { ChevronDown } from "lucide-react";
import { useState } from "react";

const SmartSelectInput = ({
  initialOptions = ["Apple", "Banana", "Orange", "Mango", "Grape"],
  value = "",
  onChange,
  placeholder = "Select or type to add...",
  label = "Select or Type to Add",
}: {
  initialOptions?: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [selectedValue, setSelectedValue] = useState(value);
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setIsDropdownOpen(true);
  };

  const handleSelectOption = (option: string) => {
    setSelectedValue(option);
    setInputValue(option);
    setIsDropdownOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!options.includes(inputValue.trim())) {
        setOptions([...options, inputValue.trim()]);
      }
      setSelectedValue(inputValue.trim());
      setIsDropdownOpen(false);
      if (onChange) {
        onChange(inputValue.trim());
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (inputValue.trim() && !options.includes(inputValue.trim())) {
        setOptions([...options, inputValue.trim()]);
        setSelectedValue(inputValue.trim());
        if (onChange) {
          onChange(inputValue.trim());
        }
      } else if (inputValue.trim() && options.includes(inputValue.trim())) {
        setSelectedValue(inputValue.trim());
        if (onChange) {
          onChange(inputValue.trim());
        }
      }
      setIsDropdownOpen(false);
    }, 200);
  };

  const filteredOptions = options.filter((option: string) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="w-full max-w-xl z-909">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="
    w-full px-3 h-12 py-2.5 pr-10 
    text-sm border border-[#5D616B] rounded-lg 
    outline-none focus:outline-none focus:ring-0 
    focus:border-[#343A46]
  "
          />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-[#5D616B]rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option: string, index: number) => (
                <div
                  key={index}
                  onMouseDown={() => handleSelectOption(option)}
                  className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No matches. Press Enter to add "{inputValue}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSelectInput;
