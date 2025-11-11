interface TransactionCardProps {
  amount: string | number;
  from: string;
  date: string;
  person: string;
  success: string;
  grainType: string;
  icon?: string;
}

const PendingPickupCard: React.FC<TransactionCardProps> = ({
  amount,
  from,
  date,
  person,
  success,
  grainType,
  icon,
}) => {
  return (
    <div className="w-full px-2 py-3 sm:px-2.5 sm:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {/* .......Wallet / Icon....... */}
        <div className="flex-shrink-0 rounded-full bg-[#F2F3F5] p-2 sm:p-2.5">
          {from === "Field Agent" ? (
            <img
              src="/img/user_inv.svg"
              alt="transaction icon"
              className="h-4 w-4 object-contain sm:h-5 sm:w-5"
            />
          ) : (
            <img
              src="../img/building.svg"
              alt="wallet"
              className="h-4 w-4 object-contain sm:h-5 sm:w-5"
            />
          )}
        </div>

        {/* ........ Details ........ */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <h4 className="truncate text-[15px] font-normal text-[#000] sm:text-[16px] md:text-[16px]">
              {person}
            </h4>
          </div>

          <div className="mt-0.5 flex flex-wrap items-center text-xs font-normal text-[#8E8E93] sm:text-[13px] md:text-[14px]">
            <div className="flex items-center">
              <span className="truncate">{from}</span>
            </div>
          </div>
        </div>

        {/*.........Amount........ */}
        <div className="flex-shrink-0 text-right">
          <h1 className="text-sm font-bold text-[#080808] sm:text-[15px] md:text-[16px]">
            {amount}
          </h1>
          <h4 className="text-xs font-normal text-[#8E8E93] sm:text-[13px] md:text-[14px]">
            {grainType}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default PendingPickupCard;
