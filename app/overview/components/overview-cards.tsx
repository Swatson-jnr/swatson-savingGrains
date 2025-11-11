import { Card } from "@/components/ui/card";
import Image from "next/image";
import React, { useState } from "react";

interface PaymentCardProps {
  icon: string; // URL of the image
  amount: number | string;
  type: string;
}

const OverviewCard: React.FC<PaymentCardProps> = ({ icon, amount, type }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected((prev) => !prev);
  };

  return (
    <div className="py-5">
      <Card
        onClick={handleSelect}
        className={`flex max-h-[134px] max-w-[208px] cursor-pointer flex-col items-start justify-center border px-3 py-2 shadow-none transition-all ${
          isSelected ? "border-yellow-500 bg-yellow-50" : "border-gray-200"
        }`}
      >
        <div className="mb-3 mt-3 inline-block">
          <Image
            src={icon}
            alt={type}
            width={30}
            height={30}
            className="mb-2 object-contain"
          />
        </div>

        <div className="mb-2">
          <h1 className="text-[24px] font-bold text-[#080808]">{amount}</h1>
        </div>

        <div className="pb-3">
          <h4 className="text-[14px] font-[500] text-[#858990]">{type}</h4>
        </div>
      </Card>
    </div>
  );
};

export default OverviewCard;
