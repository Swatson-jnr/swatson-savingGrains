import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SelectProps } from "@radix-ui/react-select";
import { useState } from "react";
import { Label } from "./label";

type Props = Pick<
  SelectProps,
  "value" | "onValueChange" | "name" | "disabled" | "required"
> & {
  options: Array<{ value: string; label: string }>;
  label?: string;
  placeholder?: string;
  hasLabel?: boolean;
};

export function FloatingLabelSelect(props: Props) {
  const {
    hasLabel = true,
    value,
    options,
    label,
    placeholder,
    disabled,
    required,
    onValueChange,
  } = props;

  const [selected, setSelected] = useState(value);

  return (
    <div className="relative">
      <Select
        onValueChange={(v) => {
          setSelected(v);
          onValueChange && onValueChange(v);
        }}
        value={selected}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger
          className={cn(
            "flex h-10 w-full rounded-md border border-input",
            "px-3 py-2 text-left text-sm text-gray-700 ring-transparent",
            "placeholder:text-muted-foreground focus:!border-[#68798F] focus:ring-transparent focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((item, i) => (
            <SelectItem key={i} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasLabel && (
        <Label
          className={`pointer-events-none absolute left-1 z-[5] text-sm transition-all duration-200 ${
            value || (!value && placeholder)
              ? "-top-2 bg-transparent px-2 text-xs text-gray-500"
              : "top-2 px-2.5 text-muted-foreground"
          }`}
        >
          {label}
        </Label>
      )}
    </div>
  );
}
