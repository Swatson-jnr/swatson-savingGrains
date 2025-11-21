export interface RequestConfirmationDetailsProps {
  details: {
    service: string;
    amount: string;
    description: string;
    paymentMethod: string;
    paymentDate: string;
  };
}

//   quantity, price, charges,date, total cost

const RecordConfirmationDetails = ({
  details,
}: RequestConfirmationDetailsProps) => {
  return (
    <>
      <div className="mb-8 flex flex-col border-b py-3">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">
            Service paying for
          </p>
          <span className="text-[16px] font-semibold text-black">
            {details.service}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Amount paid</p>
          <span className="text-[16px] font-semibold text-black">
            {details.amount}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Description</p>
          <span className="text-[16px] font-semibold text-black">
            {details.description}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">Payment date</p>
          <span className="text-[16px] font-semibold text-black">
            {details.paymentDate}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">
            Payment method
          </p>
          <span className="text-[16px] font-semibold text-black">
            {details.paymentMethod}
          </span>
        </div>
      </div>
    </>
  );
};

export default RecordConfirmationDetails;
