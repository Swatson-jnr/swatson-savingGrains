import { Dot } from "lucide-react";
import React from "react";
import Status from "./status-card";
// import Status from "../pages/fund-requests/components/status-card";

interface TransactionCardProps {
  amount: string | number;
  date: string;
  person: string;
  success: "approved" | "declined" | "pending" | "failed" | "successful";
  icon?: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  amount,
  date,
  person,
  success,
  icon,
}) => {
  return (
    <div className="w-full px-2 py-3 sm:px-2.5 sm:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {/* ........Wallet / Icon........ */}
        <div className="shrink-0 rounded-full bg-[#F2F3F5] p-2 sm:p-2.5">
          {icon ? (
            <img
              src={icon}
              alt="transaction icon"
              className="h-4 w-4 object-contain sm:h-5 sm:w-5"
            />
          ) : (
            <img
              src="/icons/wallet.svg"
              alt="wallet"
              className="h-4 w-4 object-contain sm:h-5 sm:w-5"
            />
          )}
        </div>

        {/* .....Details......... */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3">
            <h4 className="text-sm font-normal text-[#080808] sm:text-[15px] md:text-[16px]">
              Top Up
            </h4>
           
            <Status status={success} />
          </div>

          <div className="mt-0.5 flex flex-wrap items-center text-xs font-normal text-[#8E8E93] sm:text-[13px] md:text-[14px]">
            <span className="truncate">{date}</span>
            <div className="flex items-center">
              <Dot className="text-black" size={16} />
              <span className="truncate sm:max-w-none">{person}</span>
            </div>
          </div>
        </div>

        <h1 className="shrink-0 text-sm font-bold text-[#080808] sm:text-[15px] md:text-[16px]">
          {amount}
        </h1>
      </div>
    </div>
  );
};

export default TransactionCard;
