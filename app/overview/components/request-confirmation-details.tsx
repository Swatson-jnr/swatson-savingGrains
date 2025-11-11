interface RequestConfirmationDetailsProps {
  expense: {
    amountRequesting: string;
    paymentMethod: string;
    reason: string;
    bankName?: string;
    branch?: string;
    accountNumber?: string | null;
  };
}

const RequestConfirmationDetails = ({
  expense,
}: RequestConfirmationDetailsProps) => {
  return (
    <>
      <div className="mb-8 flex flex-col border-b py-3">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">
            Amount Requesting{" "}
          </p>
          <span className="text-[16px] font-semibold text-black">
            ₵{expense.amountRequesting}
          </span>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[16px] font-normal text-[#8E8E93]">
            Payment Method
          </p>
          <span className="text-[16px] font-semibold text-black">
            {expense.paymentMethod}
          </span>
        </div>

        {expense.bankName && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-[16px] font-normal text-[#8E8E93]">Bank Name</p>
            <span className="text-[16px] font-semibold text-black">
              {expense.bankName}
            </span>
          </div>
        )}
        {expense.branch && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-[16px] font-normal text-[#8E8E93]">Branch</p>
            <span className="text-[16px] font-semibold text-black">
              {expense.branch}
            </span>
          </div>
        )}
        {expense.accountNumber && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-[16px] font-normal text-[#8E8E93]">
              Account Number
            </p>
            <span className="text-[16px] font-semibold text-black">
              {expense.accountNumber}
            </span>
          </div>
        )}
      </div>
      {/* reason */}
      <div className="mt-4">
        <h1 className="text-[16px] font-normal text-[#8E8E93]">Reason</h1>
        <span className="text-[16px] font-semibold text-black">
          {expense.reason}
        </span>
      </div>
    </>
  );
};

export default RequestConfirmationDetails;
