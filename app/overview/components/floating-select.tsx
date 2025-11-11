import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
  image?: string;
}

interface FloatingLabelSelectProps {
  label: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
}

export const FloatingSelect: React.FC<FloatingLabelSelectProps> = ({
  label,
  placeholder,
  value,
  onValueChange,
  options,
  disabled,
  required,
}) => {
  const [selected, setSelected] = React.useState(value || "");

  const handleChange = (val: string) => {
    setSelected(val);
    onValueChange?.(val);
  };

  const isActive = selected || placeholder;

  return (
    <div className="relative w-full max-w-[572px]">
      {/* Floating label */}
      <Label
        htmlFor={label}
        className={cn(
          "absolute left-3 top-3 text-gray-500 text-sm transition-all duration-200 pointer-events-none",
          isActive
            ? "-translate-y-4 scale-90 bg-white px-1 text-gray-700"
            : "translate-y-0 scale-100"
        )}
      >
        {label}
      </Label>

      <Select
        value={selected}
        onValueChange={handleChange}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger
          className={cn(
            "h-[48px] w-full rounded-[8px] border border-[#5D616B] px-3 text-sm text-gray-800",
            "focus:border-[#68798F] focus:ring-0 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <SelectValue placeholder={placeholder || `Select ${label}`} />
        </SelectTrigger>

        {/* ✅ No portal prop, safe for modal usage */}
        <SelectContent
          position="popper"
          side="bottom"
          sideOffset={6}
          className="z-[9999] bg-white"
        >
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              {opt.image ? (
                <img
                  src={opt.image}
                  alt={opt.label}
                  className="h-4 w-4 object-contain"
                />
              ) : (
                opt.icon && <span className="text-gray-600">{opt.icon}</span>
              )}
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
