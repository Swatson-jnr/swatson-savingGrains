import { Dot } from "lucide-react";
import receipt from "@/public/img/receipt-item.svg";
import Image from "next/image";

interface TransactionCardProps {
  amount: string | number;
  date: string;
  person: string;
  success: boolean;
  paymentType?: string;
  icon?: string;
}

const RecentTransactionCard: React.FC<TransactionCardProps> = ({
  amount,
  date,
  person,
  success,
  paymentType,
  icon,
}) => {
  return (
    <div className="w-full px-2 py-3 sm:px-2.5 sm:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {/* .......Wallet / Icon....... */}
        <div className="shrink-0 rounded-full bg-[#F2F3F5] p-2 sm:p-2.5">
          {icon ? (
            <Image src={receipt} alt="Wallet" width={24} height={24} />
          ) : (
            <Image src={receipt} alt="Wallet" width={24} height={24} />
          )}
        </div>

        {/* ........ Details ........ */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <h4 className="truncate text-[15px] font-normal text-black sm:text-[16px] md:text-[18px]">
              Grains Purchased
            </h4>
          </div>

          <div className="mt-0.5 flex flex-wrap items-center text-xs font-normal text-[#8E8E93] sm:text-[13px] md:text-[14px]">
            <span className="truncate">{date}</span>
            <div className="flex items-center">
              <Dot className="text-black" size={16} />
              <span className="truncate">{person}</span>
            </div>
          </div>
        </div>

        {/*.........Amount........ */}
        <div className="shrink-0 text-right">
          <h1 className="text-sm font-bold text-[#080808] sm:text-[15px] md:text-[16px]">
            {amount}
          </h1>
          <h4 className="text-xs font-normal text-[#8E8E93] sm:text-[13px] md:text-[14px]">
            {paymentType}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactionCard;
