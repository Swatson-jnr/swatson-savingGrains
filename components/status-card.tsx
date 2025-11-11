import { Badge } from "@/components/ui/badge";

interface RequestStatusProps {
  status: "approved" | "declined" | "pending" | "failed" | "successful";
}

export default function Status({ status }: RequestStatusProps) {
  const statusConfig = {
    approved: {
      textColor: "text-[#076826]",
      pillColor: "bg-[#098B33]",
      backGroundColor: "bg-[#CEEFD9]",
      label: "Approved",
    },
    successful: {
      textColor: "text-[#0F265E]",
      pillColor: "bg-[#0F265E]",
      backGroundColor: "bg-[#D3DFFB]",
      label: "Successful",
    },
    failed: {
      textColor: "text-[#D6D8DA]",
      pillColor: "bg-[#D6D8DA]",
      backGroundColor: "bg-[#080808]",
      label: "Failed",
    },
    declined: {
      textColor: "text-[#E53F3F]",
      pillColor: "bg-[#E53F3F]",
      backGroundColor: "bg-[#FECCCC]",
      label: "Declined",
    },
    pending: {
      textColor: "text-[#977F28]",
      pillColor: "bg-[#977F28]",
      backGroundColor: "bg-[#fef6d9]",
      label: "Pending",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex flex-col gap-2 border-none">
      <Badge
        className={`flex max-h-[23px] max-w-[89px] items-center gap-1 px-2 py-1 text-[12px] font-normal ${config.textColor} ${config.backGroundColor}`}
      >
        <span
          className={`block h-1.5 w-1.5 shrink-0 rounded-full ${config.pillColor}`}
        ></span>
        {config.label}
      </Badge>
    </div>
  );
}
