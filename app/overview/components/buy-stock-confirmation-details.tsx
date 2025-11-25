

export interface BuyStockConfirmationDetailsProps {
  details: {
    grainType: string;
    quantity: string;
    charges: string
    price: string;
    date: string;
  };
}


const BuyStockConfirmationDetails = ({
  details,
}: BuyStockConfirmationDetailsProps) => {
  const currency = "GHS ";
  return (
    <>
      <div className="mb-8 flex flex-col border-b">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Grain</p>
          <span className="text-[16px] font-semibold text-black">
            {details.grainType}
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Kilos</p>
          <span className="text-[16px] font-semibold text-black">
            {details.quantity}
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Price</p>
          <span className="text-[16px] font-semibold text-black">
            {details.price}
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Charges</p>
          <span className="text-[16px] font-semibold text-black">
            {details.price}
          </span>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Date</p>
          <span className="text-[16px] font-semibold text-black">
            {details.date}
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Total Cost</p>
          <span className="text-[16px] font-semibold text-black">
            { `${currency} ${" "}${details.price + Number(details.charges)}.00` }
          </span>
        </div>
      </div>
    </>
  );
};

export default BuyStockConfirmationDetails;
