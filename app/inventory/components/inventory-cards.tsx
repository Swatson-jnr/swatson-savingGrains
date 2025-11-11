"use client";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";

interface PaymentCardProps {
  icon:
    | string
    | React.ComponentType<{ size?: number | string; className?: string }>;
  amount: number | string;
  type: string;
}

const InventoryCard: React.FC<PaymentCardProps> = ({ icon, amount, type }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected((prev) => !prev);
  };

  const isImage = typeof icon === "string";
  const IconComp =
    typeof icon !== "string" ? (icon as React.ComponentType<any>) : null;

  return (
    <div className="">
      <Card
        onClick={handleSelect}
        className={`flex max-h-[134px] max-w-[208px]  cursor-pointer flex-col items-start justify-center border px-3 py-2 shadow-none transition-all ${
          isSelected ? "border-yellow-500 bg-yellow-50" : "border-[#D6D8DA]"
        }`}
      >
        <div className="mb-3 mt-3 inline-block">
          {isImage ? (
            <img
              src={icon}
              alt={type}
              className="mb-2 h-[30px] w-[30px] object-contain"
            />
          ) : (
            IconComp && <IconComp className="mb-2 text-[#858990]" size={22} />
          )}
        </div>

        <div className="mb-2">
          <h1 className="text-[24px] font-bold text-[#080808]">{amount}</h1>
        </div>

        <div className="pb-3">
          <h4 className="text-[12px] font-[500] text-[#858990]">{type}</h4>
        </div>
      </Card>
    </div>
  );
};

export default InventoryCard;
