"use client";

import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";

interface PaymentCardProps {
  icon: string | StaticImageData | React.ComponentType<{ size?: number | string; className?: string }>;
  amount: number | string;
  type: string;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ icon, amount, type }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected((prev) => !prev);
  };

  // Detect if it's an imported image (object) or string URL
  const isImage = typeof icon === "string" || (icon as StaticImageData)?.src;
  const IconComp =
    !isImage && (icon as React.ComponentType<any>);

  return (
    <div className="py-5">
      <Card
        onClick={handleSelect}
        className={`max-h-[134px] max-w-[323px] cursor-pointer border p-4 px-3 py-2 shadow-none transition-all ${
          isSelected ? "border-yellow-500 bg-yellow-50" : "border-gray-200"
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          {isImage ? (
            <Image
              src={icon as string | StaticImageData}
              alt={type}
              width={22}
              height={22}
              className="mb-2 h-[22px] w-[22px] object-contain"
            />
          ) : (
            IconComp && <IconComp className="mb-2 text-[#858990]" size={22} />
          )}

          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
              isSelected
                ? "border-yellow-500 bg-white"
                : "border-gray-300 bg-white"
            }`}
          >
            {isSelected && <Check size={14} className="text-[#FFB733]" />}
          </div>
        </div>

        <div className="mb-2">
          <h1 className="text-[24px] font-bold text-[#080808]">₵{amount}</h1>
        </div>

        <div>
          <h4 className="text-[14px] font-medium text-[#858990]">{type}</h4>
        </div>
      </Card>
    </div>
  );
};

export default PaymentCard;
