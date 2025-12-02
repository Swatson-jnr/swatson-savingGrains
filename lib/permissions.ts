export const ROLE_PERMISSIONS: Record<string, string[]> = {
  "super-admin": [
    "Inventory",
    "Wallet",
    "WalletTopup",
    "Transactions",
    "Users",
    "Settings",
  ],
  admin: ["Inventory", "Wallet", "WalletTopup", "Transactions", "Users"],
  "backoffice-admin": ["Transactions", "WalletTopup", "Reports"],
  "account-manager": ["Wallet", "Transactions"],
  paymaster: ["Wallet", "WalletTopup"],
  "stock-manager": ["Inventory"],
  "field-agent": ["Inventory", "Wallet", "WalletTopup", "Transactions"],
};
