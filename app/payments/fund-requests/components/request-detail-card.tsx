interface FundRequestDetailsProps {
  dateRequested: string | Date;
  amountRequested: number;
  paymentMethod: string;
  status: "pending" | "approved" | "declined" | "successful";
  dateApproved?: string | Date | null;
  dateDeclined?: string | Date | null;
  dateSuccessful?: string | Date | null;
}

export default function FundRequestDetails({
  dateRequested,
  amountRequested,
  paymentMethod,
  status,
  dateApproved,
  dateDeclined,
  dateSuccessful,
}: FundRequestDetailsProps) {
  const formatDate = (date: string | Date) => {
    if (typeof date === "string") return date;
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[16px] font-normal text-[#8E8E93]">
          Date Requested
        </h1>
        <h2 className="text-[16px] text-black font-semibold">
          {formatDate(dateRequested)}
        </h2>
      </div>

      {status === "approved" && dateApproved && (
        <div className="flex items-center justify-between">
          <h1 className="text-[16px] font-normal text-[#8E8E93]">
            Date Approved
          </h1>
          <h2 className="text-[16px] text-black font-semibold">
            {formatDate(dateApproved)}
          </h2>
        </div>
      )}

      {status === "successful" && dateSuccessful && (
        <div className="flex items-center justify-between">
          <h1 className="text-[16px] font-normal text-[#8E8E93]">
            Date Approved
          </h1>
          <h2 className="text-[16px] text-black font-semibold">
            {formatDate(dateSuccessful)}
          </h2>
        </div>
      )}

      {status === "declined" && dateDeclined && (
        <div className="flex items-center justify-between">
          <h1 className="text-[16px] font-normal text-[#8E8E93]">
            Date {status.charAt(0).toUpperCase() + status.slice(1)}
          </h1>
          <h2 className="text-[16px] text-black font-semibold">
            {formatDate(dateDeclined || dateApproved!)}
          </h2>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-[16px] font-normal text-[#8E8E93]">
          Amount Requested (GH₵)
        </h1>
        <h2 className="text-[16px] text-black font-semibold">
          {amountRequested.toLocaleString()}
        </h2>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-[16px] font-normal text-[#8E8E93]">
          Payment Method
        </h1>
        <h2 className="text-[16px] text-black font-semibold">
          {paymentMethod}
        </h2>
      </div>
    </div>
  );
}
