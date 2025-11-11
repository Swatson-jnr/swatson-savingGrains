import { Badge } from "@/components/ui/badge";

interface RequestStatusProps {
  status: "approved" | "declined" | "pending" | "failed" | "successful";
}

export default function RequestStatus({ status }: RequestStatusProps) {
  const statusConfig = {
    approved: {
      textColor: "text-[#076826]",
      pillColor: "bg-[#098B33]",
      label: "Approved",
    },
    successful: {
      textColor: "text-[#0F265E]",
      pillColor: "bg-[#0F265E]",
      label: "Successful",
    },
    failed: {
      textColor: "text-[#D6D8DA]",
      pillColor: "bg-[#D6D8DA]",
      label: "Failed",
    },
    declined: {
      textColor: "text-[#E53F3F]",
      pillColor: "bg-[#E53F3F]",
      label: "Declined",
    },
    pending: {
      textColor: "text-[#977F28]",
      pillColor: "bg-[#977F28]",
      label: "Pending",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="mt-7 flex flex-col gap-2">
      <h1 className="text-[16px] font-normal text-[#8E8E93]">Request Status</h1>
      <Badge
        className={`flex max-h-[23px] max-w-[89px] items-center gap-1 px-2 py-1 text-[14px] font-normal ${config.textColor}`}
      >
        <span
          className={`block h-2 w-2 shrink-0 rounded-full ${config.pillColor}`}
        ></span>
        {config.label}
      </Badge>
    </div>
  );
}
