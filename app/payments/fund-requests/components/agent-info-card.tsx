interface AgentInfoCardProps {
  requestedBy: string;
  agentId: string;
  agentName: string;
  amount?: number;
}

export default function AgentInfoCard({
  requestedBy,
  agentId,
  agentName,
  amount,
}: AgentInfoCardProps) {
  return (
    <div className="max-h-[156px] max-w-[640px] rounded-[6px] bg-[#D6D6D633] px-5 py-5">
      <div className="mb-8 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[16px] font-normal text-[#080808]">
            Requested By
          </h1>
          <h2 className="text-[16px] font-semibold text-[#000]">
            {requestedBy}
          </h2>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-[16px] font-normal text-[#080808]">
            Agent ID
          </h1>
          <h2 className="text-[16px] font-semibold text-[#000]">
            {agentId}
          </h2>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[16px] font-normal text-[#080808]">
            Agent Name
          </h1>
          <h2 className="text-[16px] font-semibold text-[#000]">
            {agentName}
          </h2>
        </div>

        {amount && (
          <div className="flex items-center justify-between">
            <h1 className="text-[16px] font-normal text-[#080808]">
              Amount
            </h1>
            <h2 className="text-[16px] font-semibold text-[#000]">
              GH₵ {amount.toLocaleString()}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}