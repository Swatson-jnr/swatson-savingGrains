// import { Badge } from "@base/resources/js/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { Dot } from "lucide-react";
// import receipt from "../../../../public/img/receipt-item.svg";

interface TransactionCardProps {
  amount: string | number;
  date: string;
  person: string;
  activity: string;
  success: string;
  paymentType?: string;
  icon?: string;
}

const RecentActivityCard: React.FC<TransactionCardProps> = ({
  amount,
  date,
  activity,
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
          {activity === "Transfer" ? (
            <img
              src="/img/arrow-up-left.svg"
              alt="transaction icon"
              className="h-4 w-4 object-contain sm:h-5 sm:w-5"
            />
          ) : (
            <img
              src="/img/arrow-down-right.svg"
              alt="wallet"
              className="h-4 w-4 object-contain sm:h-5 sm:w-5"
            />
          )}
        </div>

        {/* ........ Details ........ */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <h4 className="truncate text-[15px] font-normal text-black sm:text-[16px] md:text-[14px]">
              {activity}
            </h4>
          </div>

          <div className="mt-0.5 flex flex-wrap items-center text-xs font-normal text-[#8E8E93] sm:text-[13px] md:text-[12px]">
            <span className="truncate">{date}</span>
            <div className="flex items-center">
              <Dot className="text-black" size={16} />
              <span className="truncate">{person}</span>
            </div>
          </div>
        </div>

        {/*.........Amount........ */}
        <div className="flex items-center justify-center">
          <Badge className="flex max-h-[18px] max-w-[88px] bg-[#FECCCC] px-2 py-1 text-[12px] font-normal text-[#E53F3F]">
            {success}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityCard;
