import React from "react";
import { cn } from "@/lib/utils";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import DatePicker, { DateTimePickerProps } from "react-flatpickr";
import { Label } from "./label";

type Props = Omit<DateTimePickerProps, "onChange"> & {
  label: string;
  options?: flatpickr.Options.Options;
  onChange?: (e: Date[]) => void;
  hasLabel?: boolean;
  className?: string;
};

export function FloatingLabelDateInput(props: Props) {
  const {
    className,
    value,
    label,
    placeholder,
    options,
    hasLabel = true,
    onChange,
    ...rest
  } = props;

  return (
    <div className="relative">
      {hasLabel && (
        <Label
          className={`pointer-events-none absolute -top-2 left-1 z-1 bg-background px-2 text-xs text-gray-500 transition-all duration-200`}
        >
          {label}
        </Label>
      )}
      <DatePicker
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={onChange}
        className={cn("date-input", className)}
        {...rest}
      />
    </div>
  );
}
