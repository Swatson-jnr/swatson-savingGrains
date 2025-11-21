export interface RequestConfirmationDetailsProps {
  details: {
    grainType: string;
    reference: string;
    bags: string;
    weight: string;
    quantity: string;
    price: string;
    date: string;
  };
}

const PayServiceConfirmationDetails = ({
  details,
}: RequestConfirmationDetailsProps) => {
  return (
    <>
      <div className="mb-8 flex flex-col border-b py-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">No. of bags</p>
          <span className="text-[16px] font-semibold text-black">
            {details.grainType}
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">
            Weight of bags
          </p>
          <span className="text-[16px] font-semibold text-black">
            {details.weight}
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Price</p>
          <span className="text-[16px] font-semibold text-black">
            {details.price}
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Reference</p>
          <span className="text-[16px] font-semibold text-black">
            {details.reference}
          </span>
        </div>
        {/*         
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Charges</p>
          <span className="text-[16px] font-semibold text-black">
            {details.charges}
          </span>
        </div> */}
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Date</p>
          <span className="text-[16px] font-semibold text-black">
            {details.date}
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-semibold text-[#343A46]">Total cost</p>
          <span className="text-[16px] font-extrabold text-[#343A46]">
            KES {details.price}
          </span>
        </div>
      </div>
    </>
  );
};

export default PayServiceConfirmationDetails;
