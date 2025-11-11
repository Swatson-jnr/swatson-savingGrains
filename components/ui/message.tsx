import { cn } from "@/lib/utils";
import { useMemo, type ComponentProps } from "react";

interface Props extends ComponentProps<"span"> {
  message?: string;
  variant?: "danger" | "success" | "label" | "warning" | "info";
}

export function Message(props: Props) {
  const { message, children, className, variant = "danger", ...rest } = props;

  const variantClassName = useMemo(() => {
    switch (variant) {
      case "danger":
        return "text-red-500";

      default:
        return "";
    }
  }, [variant]);

  return (
    <span {...rest} className={cn("flex text-sm", variantClassName, className)}>
      {message || children}
    </span>
  );
}
