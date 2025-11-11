import { ReactNode } from "react";
import { cn } from "../lib/utils";

type Props = {
  className?: string;
  children?: ReactNode;
};

export function SummaryCard({ children, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[10px] border border-[#D6D8DA] px-3 py-10",
        className,
      )}
    >
      <div>{children}</div>
    </div>
  );
}
