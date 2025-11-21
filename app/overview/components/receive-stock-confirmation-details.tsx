export interface RequestConfirmationDetailsProps {
  details: {
    grainType: string;
    quantity: string;
    price: string;
    charges: string;
    date: string;
  };
}

//   quantity, price, charges,date, total cost

const ReceiveStockConfirmationDetails = ({
  details,
}: RequestConfirmationDetailsProps) => {
  return (
    <>
      <div className="mb-8 flex flex-col border-b py-3">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Grain type</p>
          <span className="text-[16px] font-semibold text-black">
            {details.grainType}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Kilo</p>
          <span className="text-[16px] font-semibold text-black">
            {details.quantity}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">
            Price per Kilo
          </p>
          <span className="text-[16px] font-semibold text-black">
            {details.price}
          </span>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-semibold text-[#343A46]">Total cost</p>
          <span className="text-[16px] font-extrabold text-[#343A46]">
            GHs {Number(details.quantity) + Number(details.charges)}.00
          </span>
        </div>
      </div>
    </>
  );
};

export default ReceiveStockConfirmationDetails;
