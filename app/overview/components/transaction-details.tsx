interface TransactionDetailsProps {
  expense: {
    dateRecorded: string;
    paymentMethod: string;
    businessLine: string;
    expenseCategory: string;
    productLine: string;
    amount: string;
    accountNumber: string | null;
    agentName: string;
    role: string;
    narration: string;
    weekOfTransaction: string;
    quantity: number;
    unitPrice: string;
  };
}

const TransactionDetails = ({ expense }: TransactionDetailsProps) => {
  return (
    <div className="mb-8 flex flex-col p-3">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Date Recorded </p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.dateRecorded}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Payment Method</p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.paymentMethod}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Business Line</p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.businessLine}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Business Line</p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.businessLine}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">
          Expense Category
        </p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.expenseCategory}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Product Line</p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.productLine}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Amount (GH₵)</p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.amount}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Amount</p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.amount}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Account Number</p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.accountNumber ?? "N/A"}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Agent Name</p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.agentName}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Role</p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.role}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Narration</p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.narration}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">
          Week of Transaction
        </p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.weekOfTransaction}
        </span>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Quantity</p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.quantity}
        </span>
      </div>
      <div className="mb-0 flex items-center justify-between">
        <p className="text-[16px] font-normal text-[#8E8E93]">Unit Price</p>
        <span className="text-[16px] font-semibold text-[#000]">
          {expense.unitPrice}
        </span>
      </div>
    </div>
  );
};

export default TransactionDetails;
