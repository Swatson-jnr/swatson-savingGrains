"use client";

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
    placeholder: string;
    className: string;
    type: AllowedInputTypes;
  }
>;

export interface OTPInputProps {
  value?: string;
  numInputs?: number;
  onChange: (otp: string) => void;
  renderInput: (props: InputProps, index: number) => React.ReactNode;
  shouldAutoFocus?: boolean;
  renderSeparator?: React.ReactNode | ((index: number) => React.ReactNode);
  containerStyle?: React.CSSProperties | string;
}

const OTPInput = ({
  value = "",
  numInputs = 6,
  onChange,
  renderInput,
  containerStyle,
}: OTPInputProps) => {
  const inputs = Array.from({ length: numInputs }, (_, i) => i);
  const handleChange = (index: number, val: string) => {
    const otpArr = value.split("");
    otpArr[index] = val;
    onChange(otpArr.join(""));
  };

  return (
    <div
      style={typeof containerStyle === "object" ? containerStyle : undefined}
      className={
        typeof containerStyle === "string" ? containerStyle : undefined
      }
    >
      {inputs.map((i) => (
        <React.Fragment key={i}>
          {renderInput(
            {
              value: value[i] || "",
              onChange: (e) => handleChange(i, e.target.value),
              onFocus: () => {},
              onBlur: () => {},
              onKeyDown: () => {},
              onPaste: () => {},
              "aria-label": `OTP input ${i + 1}`,
              autoComplete: "one-time-code",
              style: {},
              inputMode: "numeric",
              onInput: () => {},
              ref: () => {},
              placeholder: "",
              className: "",
              type: "text",
            },
            i
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default OTPInput;
