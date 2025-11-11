/**
 * Validation utilities for wallet requests
 *
 * Provides validation functions for:
 * - Ghana phone number formats
 * - Payment methods
 * - Bank names
 */

/**
 * Valid payment methods for wallet requests
 */
export const VALID_PAYMENT_METHODS = [
  "mobile_money",
  "bank_transfer",
  "cash",
] as const

export type PaymentMethod = (typeof VALID_PAYMENT_METHODS)[number]

/**
 * Valid Mobile Money providers in Ghana
 */
export const VALID_MOBILE_MONEY_PROVIDERS = [
  "MTN",
  "Vodafone",
  "AirtelTigo",
] as const

/**
 * Valid banks in Ghana
 */
export const VALID_GHANA_BANKS = [
  "Access Bank Ghana",
  "Agricultural Development Bank",
  "Bank of Africa Ghana",
  "Barclays Bank Ghana", // Now Absa Bank
  "Absa Bank Ghana",
  "Cal Bank",
  "Consolidated Bank Ghana",
  "Ecobank Ghana",
  "Fidelity Bank Ghana",
  "First Atlantic Bank",
  "First National Bank Ghana",
  "GCB Bank", // Ghana Commercial Bank
  "Ghana Commercial Bank",
  "Guaranty Trust Bank Ghana",
  "National Investment Bank",
  "OmniBank Ghana",
  "Prudential Bank",
  "Republic Bank Ghana",
  "Societe Generale Ghana",
  "Stanbic Bank Ghana",
  "Standard Chartered Bank Ghana",
  "United Bank for Africa Ghana",
  "Universal Merchant Bank",
  "Zenith Bank Ghana",
] as const

/**
 * Validate Ghana phone number format
 *
 * Accepts:
 * - 233XXXXXXXXX (12 digits starting with 233)
 * - +233XXXXXXXXX (13 characters with + prefix)
 * - 0XXXXXXXXX (10 digits starting with 0)
 *
 * @param phoneNumber - Phone number to validate
 * @returns true if valid Ghana phone number format
 */
export function isValidGhanaPhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return false
  }

  const cleaned = phoneNumber.trim()

  // Format: 233XXXXXXXXX (12 digits)
  if (/^233\d{9}$/.test(cleaned)) {
    return true
  }

  // Format: +233XXXXXXXXX (13 characters)
  if (/^\+233\d{9}$/.test(cleaned)) {
    return true
  }

  // Format: 0XXXXXXXXX (10 digits)
  if (/^0\d{9}$/.test(cleaned)) {
    return true
  }

  return false
}

/**
 * Validate payment method
 *
 * @param paymentMethod - Payment method to validate
 * @returns true if valid payment method
 */
export function isValidPaymentMethod(paymentMethod: string): boolean {
  if (!paymentMethod || typeof paymentMethod !== "string") {
    return false
  }

  return VALID_PAYMENT_METHODS.includes(paymentMethod as PaymentMethod)
}

/**
 * Validate bank name (case-insensitive)
 *
 * @param bankName - Bank name to validate
 * @returns true if valid Ghana bank name
 */
export function isValidGhanaBank(bankName: string): boolean {
  if (!bankName || typeof bankName !== "string") {
    return false
  }

  const normalized = bankName.trim().toLowerCase()

  return VALID_GHANA_BANKS.some(
    (validBank) => validBank.toLowerCase() === normalized,
  )
}

/**
 * Validate Mobile Money provider
 *
 * @param provider - Provider name to validate
 * @returns true if valid Mobile Money provider
 */
export function isValidMobileMoneyProvider(provider: string): boolean {
  if (!provider || typeof provider !== "string") {
    return false
  }

  return VALID_MOBILE_MONEY_PROVIDERS.includes(
    provider as (typeof VALID_MOBILE_MONEY_PROVIDERS)[number],
  )
}

/**
 * Get descriptive error message for invalid phone number
 */
export function getPhoneNumberErrorMessage(): string {
  return "Invalid phone number format. Accepted formats: 233XXXXXXXXX, +233XXXXXXXXX, or 0XXXXXXXXX"
}

/**
 * Get descriptive error message for invalid payment method
 */
export function getPaymentMethodErrorMessage(): string {
  return `Invalid payment method. Accepted values: ${VALID_PAYMENT_METHODS.join(
    ", ",
  )}`
}

/**
 * Get descriptive error message for invalid bank name
 */
export function getBankNameErrorMessage(): string {
  return "Invalid bank name. Please provide a valid Ghana bank name."
}

/**
 * Get descriptive error message for invalid Mobile Money provider
 */
export function getMobileMoneyProviderErrorMessage(): string {
  return `Invalid Mobile Money provider. Accepted values: ${VALID_MOBILE_MONEY_PROVIDERS.join(
    ", ",
  )}`
}

