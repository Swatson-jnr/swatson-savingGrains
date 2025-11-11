import { Badge } from "@/components/ui/badge";

interface RequestStatusProps {
  status: "approved" | "declined" | "pending" | "failed" | "successful";
}

export default function InventoryStatusBadge({ status }: RequestStatusProps) {
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
      backGroundColor: "bg-[#080808]",
      label: "Failed",
    },
    declined: {
      backGroundColor: "bg-[#FECCCC]",
      label: "Declined",
    },
    pending: {
      backGroundColor: "bg-[#fef6d9]",
      label: "Pending",
    },
  };

  const config = statusConfig[status];

  return (
      <div className="flex items-center justify-center">
        <Badge className="flex gap-1 max-h-[18px] max-w-[88px] bg-[#FECCCC] px-2 py-1 text-[12px] font-normal text-[#E53F3F]">
          <span className="block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E53F3F]"></span>
          {config.label}
        </Badge>
    </div>
  );
}
