import { Card, CardTitle } from "@/components/ui/card";

interface WalletBalanceCardProps {
  availableBalance: number | string;
  walletType: string;
  currency?: string;
}

export default function WalletBalanceCard({
  availableBalance,
  walletType,
  currency = "₵",
}: WalletBalanceCardProps) {
  return (
    <Card className="mb-8 h-[125px] max-w-[640px] bg-[#E6AE0B33] px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 py-2">
          <CardTitle className="text-[14px] font-normal text-[#080808]">
            Available Balance
          </CardTitle>
          <h1 className="text-[24px] font-bold text-[#080808]">
            {currency}
            {availableBalance.toLocaleString()}
          </h1>
          <h2 className="text-[16px] font-medium text-[#080808]">
            {walletType}
          </h2>
        </div>
        
        <div className="relative rounded-full bg-white p-2">
          <img src="../img/cWallet.png" alt="Wallet" className="z-10" />
          <img
            src="../img/leaf.svg"
            alt=""
            className="absolute -left-3 -top-6 max-h-[84px] max-w-16"
          />
        </div>
      </div>
    </Card>
  );
}