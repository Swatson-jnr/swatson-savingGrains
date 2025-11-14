import { X } from "lucide-react";
import React from "react";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  iconSize?: number;
  iconColor?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  className = "absolute right-9 top-5",
  iconSize = 11,
  iconColor = "#343A46",
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border border-[#D6D8DA] p-1.5 transition hover:bg-gray-100 ${className}`}
    >
      <X size={iconSize} color={iconColor} />
    </button>
  );
};

export default CloseButton;
