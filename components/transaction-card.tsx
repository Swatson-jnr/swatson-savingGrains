import { Dot } from "lucide-react";
import React from "react";
import Status from "./status-card";

interface TransactionCardProps {
  amount?: string | number;
  date?: string;
  person?: string;
  success?: "approved" | "declined" | "pending" | "failed" | "successful";
  icon?: string;
  isEmpty?: boolean; // Add explicit empty state control
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  amount,
  date,
  person,
  success,
  icon,
  isEmpty = false,
}) => {
  // Show empty state if explicitly set or if all required fields are missing
  const showEmptyState = isEmpty || (!amount && !date && !person);

  if (showEmptyState) {
    return (
      <div className="w-full px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Icon */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            No Pending Request Available
          </h3>

          {/* Description */}
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            You don't have any request at the moment. New top-up request will
            appear here when they're available.
          </p>
        </div>
      </div>
    );
  }

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

            {success && <Status status={success} />}
          </div>

          <div className="mt-0.5 flex flex-wrap items-center text-xs font-normal text-[#8E8E93] sm:text-[13px] md:text-[14px]">
            {date && <span className="truncate">{date}</span>}
            {date && person && (
              <div className="flex items-center">
                <Dot className="text-black" size={16} />
                <span className="truncate sm:max-w-none">{person}</span>
              </div>
            )}
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
