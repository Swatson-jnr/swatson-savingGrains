// Allowed wallet types used across the API and models
export const ALLOWED_WALLET_TYPES = ["cash", "app", "user"] as const

export type WalletType = (typeof ALLOWED_WALLET_TYPES)[number]

export default ALLOWED_WALLET_TYPES

