// components/otp-input.tsx
import React from "react";

export type AllowedInputTypes = "password" | "text" | "number" | "tel";

export type InputProps = Required<
  Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "value"
    | "onChange"
    | "onFocus"
    | "onBlur"
    | "onKeyDown"
    | "onPaste"
    | "aria-label"
    | "autoComplete"
    | "style"
    | "inputMode"
    | "onInput"
  > & {
    ref: React.RefCallback<HTMLInputElement>;
    placeholder: string | undefined;
    className: string | undefined;
    type: AllowedInputTypes;
  }
>;

export interface OTPInputProps {
  value?: string;
  numInputs?: number;
  onChange: (otp: string) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
  renderInput: (inputProps: InputProps, index: number) => React.ReactNode;
  shouldAutoFocus?: boolean;
  placeholder?: string;
  renderSeparator?: ((index: number) => React.ReactNode) | React.ReactNode;
  containerStyle?: React.CSSProperties | string;
  inputStyle?: React.CSSProperties | string;
  inputType?: AllowedInputTypes;
  skipDefaultStyles?: boolean;
}

export default function OTPInput({
  value = "",
  numInputs = 4,
  onChange,
  renderInput,
  shouldAutoFocus = false,
  renderSeparator,
  containerStyle,
}: OTPInputProps) {
  const handleChange = (val: string, idx: number) => {
    const otpArr = value.split("");
    otpArr[idx] = val;
    onChange(otpArr.join(""));
  };

  return (
    <div
      style={typeof containerStyle === "object" ? containerStyle : undefined}
      className={
        typeof containerStyle === "string" ? containerStyle : undefined
      }
    >
      {Array.from({ length: numInputs }, (_, i) => {
        const inputValue = value[i] || "";

        const inputElement = renderInput(
          {
            value: inputValue,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value, i),
            onFocus: () => {},
            onBlur: () => {},
            onKeyDown: () => {},
            onPaste: () => {},
            "aria-label": `otp-${i}`,
            autoComplete: "off",
            style: {},
            inputMode: "numeric",
            onInput: () => {},
            ref: () => {},
            placeholder: "",
            className: "",
            type: "text",
          },
          i
        );

        const separatorElement =
          renderSeparator && i < numInputs - 1
            ? typeof renderSeparator === "function"
              ? renderSeparator(i)
              : renderSeparator
            : null;

        return (
          <React.Fragment key={i}>
            {inputElement}
            {separatorElement}
          </React.Fragment>
        );
      })}
    </div>
  );
}
