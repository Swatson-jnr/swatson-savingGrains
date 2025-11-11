import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        placeholder=" "
        className={cn("peer", className)}
        ref={ref}
        {...props}
      />
    );
  },
);
FloatingInput.displayName = "FloatingInput";

const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      className={cn(
        "peer-focus:secondary pointer-events-none",
        "absolute start-2 top-2 z-[1] origin-[0]",
        "-translate-y-4 scale-75 transform bg-background px-2",
        "text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2",
        "peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
        "peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = "FloatingLabel";

type FloatingLabelInputProps = InputProps & { label?: string };

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingInput ref={ref} id={id} {...props} />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
    </div>
  );
});
FloatingLabelInput.displayName = "FloatingLabelInput";

const FloatingLabelPasswordInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, className, ...props }, ref) => {
  const [toggled, setToggled] = React.useState(false);

  return (
    <div className="relative">
      <FloatingInput
        ref={ref}
        id={id}
        type={toggled ? "text" : "password"}
        className={cn("pr-12", className)}
        {...props}
      />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>

      <button
        type="button"
        className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-gray-400"
        onClick={() => setToggled(!toggled)}
      >
        {toggled ? <IconEye size={20} /> : <IconEyeOff size={20} />}
      </button>
    </div>
  );
});
FloatingLabelPasswordInput.displayName = "FloatingLabelPasswordInput";

export {
  FloatingInput,
  FloatingLabel,
  FloatingLabelInput,
  FloatingLabelPasswordInput,
};
