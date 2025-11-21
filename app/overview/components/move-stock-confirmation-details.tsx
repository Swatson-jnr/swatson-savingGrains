

export interface MoveStockConfirmationDetailsProps {
  details: {
    from: string;
    grainType: string;
    destination: string;
    quantity: string;
    price: string;
    date: string;
  };
}

//   quantity, price, charges,date, total cost

const MoveStockConfirmationDetails = ({
  details,
}: MoveStockConfirmationDetailsProps) => {
  return (
    <>
      <div className="mb-8 flex flex-col border-b py-3">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Grain</p>
          <span className="text-[16px] font-semibold text-black">
            {details.grainType}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Quantity</p>
          <span className="text-[16px] font-semibold text-black">
            {details.quantity}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Price</p>
          <span className="text-[16px] font-semibold text-black">
            {details.price}
          </span>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Date</p>
          <span className="text-[16px] font-semibold text-black">
            {details.date}
          </span>
        </div>
      </div>
    </>
  );
};

export default MoveStockConfirmationDetails;
