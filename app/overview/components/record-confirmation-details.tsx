interface RecordConfirmationDetailsProps {
  expense: {
    service: string;
    description: string;
    paymentDate: Date | undefined;
    amountPaid: string;
    paymentMethod: string;
    accountNumber: string;
  };
}

const RecordConfirmationDetails = ({
  expense,
}: RecordConfirmationDetailsProps) => {
  return (
    <>
      <div className="mb-8 flex flex-col border-b py-3">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">
            Service paying for
          </p>
          <span className="text-[16px] font-semibold text-[#000]">
            {expense.service}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">
            Amount paid
          </p>
          <span className="text-[16px] font-semibold text-[#000]">
            {expense.amountPaid}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">
            Description
          </p>
          <span className="text-[16px] font-semibold text-[#000]">
            {expense.description}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">
            Payment date
          </p>
          <span className="text-[16px] font-semibold text-[#000]">
            {expense.paymentDate
              ? expense.paymentDate.toLocaleDateString()
              : "—"}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">
            Payment Method
          </p>
          <span className="text-[16px] font-semibold text-[#000]">
            {expense.paymentMethod}
          </span>
        </div>
      </div>

      {/* reason */}
      {/* <div className="mt-4">
        <h1 className="text-[16px] font-normal text-[#8E8E93]">Reason</h1>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.des}
        </span>
      </div> */}
    </>
  );
};

export default RecordConfirmationDetails;
