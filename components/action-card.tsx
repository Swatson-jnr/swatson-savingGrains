import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

type ActionCardProps = {
  icon: string; // URL of the image
  label: string;
  onClick?: () => void;
  bgColor?: string;
  containerbgColor?: string;
};

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  label,
  onClick,
  bgColor = "#D19FFF4D",
  containerbgColor,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex max-w-[235px] cursor-pointer items-center justify-between rounded-[8px] border border-[#D19FFF] p-2.5 transition-all hover:shadow-md"
      style={{ backgroundColor: containerbgColor }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center rounded-full p-2"
          style={{ backgroundColor: bgColor }}
        >
          <Image src={icon} alt={label} width={25} height={25} />
        </div>
        <h4 className="whitespace-nowrap font-medium text-[#080808]">
          {label}
        </h4>
      </div>

      <ChevronRight />
    </div>
  );
};

export default ActionCard;
