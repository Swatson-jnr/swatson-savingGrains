import { Types } from "mongoose"
import User from "@/lib/models/user"
import Wallet from "@/lib/models/wallet"
import WalletRequest from "@/lib/models/walletRequest"

interface UserOverrides {
  [key: string]: unknown
}

// Counter to ensure uniqueness even when Date.now() returns the same value
let userCounter = 0
let walletCounter = 0

/**
 * Create a test user
 */
export async function createTestUser(overrides: UserOverrides = {}) {
  userCounter++
  const uniqueId = `${Date.now()}-${userCounter}`

  const defaultData = {
    first_name: "Test",
    last_name: "User",
    email: `test-${uniqueId}@example.com`,
    phone_number: `+233501${String(userCounter).padStart(7, "0")}`,
    passcode: String(Math.floor(1000 + Math.random() * 9000)), // Random 4-digit passcode
    roles: ["field-agent"],
    system: false,
    walletBalance: 0,
    ...overrides,
  }

  const user = new User(defaultData)
  return await user.save()
}

interface WalletOverrides {
  [key: string]: unknown
}

/**
 * Create a test wallet (system or user)
 */
export async function createTestWallet(overrides: WalletOverrides = {}) {
  walletCounter++
  const uniqueId = `${Date.now()}-${walletCounter}`

  const defaultData = {
    name: `wallet-${uniqueId}`,
    type: "user",
    balance: 1000,
    currency: "GHS",
    system: false,
    ...overrides,
  }

  const wallet = new Wallet(defaultData)
  return await wallet.save()
}

/**
 * Create app wallet (system wallet)
 */
export async function createAppWallet(balance = 10000) {
  return await createTestWallet({
    name: "app",
    type: "app",
    system: true,
    balance,
  })
}

/**
 * Create cash wallet (system wallet)
 */
export async function createCashWallet(balance = 0) {
  return await createTestWallet({
    name: "cash",
    type: "cash",
    system: true,
    balance,
  })
}

interface WalletRequestOverrides {
  [key: string]: unknown
}

/**
 * Create a test wallet request
 */
export async function createTestWalletRequest(
  overrides: WalletRequestOverrides = {},
) {
  // Handle both user_id and user field names
  const normalizedOverrides = { ...overrides }
  if ("user_id" in normalizedOverrides && !("user" in normalizedOverrides)) {
    normalizedOverrides.user = normalizedOverrides.user_id
    delete normalizedOverrides.user_id
  }

  const defaultData = {
    user: new Types.ObjectId(),
    amount: 500,
    payment_method: "mobile_money" as const,
    reason: "Test wallet top-up request",
    status: "pending" as const,
    ...normalizedOverrides,
  }

  const request = new WalletRequest(defaultData)
  return await request.save()
}

/**
 * Create admin user
 */
export async function createAdminUser(overrides: UserOverrides = {}) {
  return await createTestUser({
    roles: ["super-admin"],
    ...overrides,
  })
}

/**
 * Create paymaster user
 */
export async function createPaymasterUser(overrides: UserOverrides = {}) {
  return await createTestUser({
    roles: ["paymaster"],
    ...overrides,
  })
}

/**
 * Create field agent user
 */
export async function createFieldAgentUser(overrides: UserOverrides = {}) {
  return await createTestUser({
    roles: ["field-agent"],
    ...overrides,
  })
}

