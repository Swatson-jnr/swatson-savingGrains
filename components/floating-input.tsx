import { cn } from "@/lib/utils";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import * as React from "react";

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, id, type = "text", ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const inputId = id || `input-${label?.replace(/\s+/g, "-").toLowerCase()}`;

    const checkValue = (value: any) => {
      setHasValue(value !== undefined && value !== null && value !== "");
    };

    React.useEffect(() => {
      checkValue(props.value);
    }, [props.value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      checkValue(e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      checkValue(e.target.value);
      props.onChange?.(e);
    };

    const isFloating = isFocused || hasValue;

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            "peer w-full rounded-lg border bg-white px-4 py-3 text-sm font-medium transition-all duration-200",
            "placeholder:transparent",
            "focus:outline-none",
            // Border colors
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-[#E7B00E]",
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none",
              isFloating
                ? "-top-2.5 text-xs font-semibold bg-white px-1.5"
                : "top-1/2 -translate-y-1/2 text-sm bg-transparent px-0",
              // Label colors
              isFloating && isFocused && !error && "text-[#E7B00E]",
              isFloating && !isFocused && !error && "text-gray-600",
              !isFloating && "text-gray-500",
              error && "text-red-500"
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

const FloatingLabelPasswordInput = React.forwardRef<
  HTMLInputElement,
  FloatingInputProps
>(({ className, label, error, id, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  const inputId = id || `input-${label?.replace(/\s+/g, "-").toLowerCase()}`;

  const checkValue = (value: any) => {
    setHasValue(value !== undefined && value !== null && value !== "");
  };

  React.useEffect(() => {
    checkValue(props.value);
  }, [props.value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    checkValue(e.target.value);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkValue(e.target.value);
    props.onChange?.(e);
  };

  const isFloating = isFocused || hasValue;

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        id={inputId}
        type={showPassword ? "text" : "password"}
        className={cn(
          "peer w-full rounded-lg border bg-white px-4 py-3 pr-12 text-sm font-medium transition-all duration-200",
          "placeholder:transparent",
          "focus:outline-none",
          // Border colors
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-[#E7B00E]",
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none",
            isFloating
              ? "-top-2.5 text-xs font-semibold bg-white px-1.5"
              : "top-1/2 -translate-y-1/2 text-sm bg-transparent px-0",
            // Label colors
            isFloating && isFocused && !error && "text-[#E7B00E]",
            isFloating && !isFocused && !error && "text-[#858990]",
            !isFloating && "text-[#858990]",
            error && "text-red-500"
          )}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#858990] hover:text-gray-600 transition-colors"
        tabIndex={-1}
      >
        {showPassword ? <IconEye size={20} /> : <IconEyeOff size={20} />}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});
FloatingLabelPasswordInput.displayName = "FloatingLabelPasswordInput";

export { FloatingLabelInput, FloatingLabelPasswordInput };