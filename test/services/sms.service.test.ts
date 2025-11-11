/// <reference types="jest" />
import {
  normalizeGhanaPhoneNumber,
  sendSMS,
  sendApprovalSMS,
  sendDeclineSMS,
  sendReceiptConfirmationSMS,
} from "@/lib/services/sms.service"

describe("SMS Service - Phone Normalization", () => {
  it("normalizeGhanaPhoneNumber: should normalize 0501234567 to 233501234567", () => {
    const result = normalizeGhanaPhoneNumber("0501234567")
    expect(result).toBe("233501234567")
  })

  it("normalizeGhanaPhoneNumber: should accept 233 prefix", () => {
    const result = normalizeGhanaPhoneNumber("233501234567")
    expect(result).toBe("233501234567")
  })

  it("normalizeGhanaPhoneNumber: should accept +233 prefix", () => {
    const result = normalizeGhanaPhoneNumber("+233501234567")
    expect(result).toBe("233501234567")
  })

  it("normalizeGhanaPhoneNumber: should remove spaces and hyphens", () => {
    const result = normalizeGhanaPhoneNumber("050-123-4567")
    expect(result).toBe("233501234567")
  })

  it("normalizeGhanaPhoneNumber: should remove parentheses", () => {
    const result = normalizeGhanaPhoneNumber("(050)1234567")
    expect(result).toMatch(/^233\d{9}$/)
  })

  it("normalizeGhanaPhoneNumber: should reject invalid format (too short)", () => {
    const result = normalizeGhanaPhoneNumber("050123")
    expect(result).toBeNull()
  })

  it("normalizeGhanaPhoneNumber: should reject invalid format (too long)", () => {
    const result = normalizeGhanaPhoneNumber("050123456789012345")
    expect(result).toBeNull()
  })

  it("normalizeGhanaPhoneNumber: should reject non-numeric input", () => {
    const result = normalizeGhanaPhoneNumber("abc-def-ghij")
    expect(result).toBeNull()
  })

  it("normalizeGhanaPhoneNumber: should reject empty string", () => {
    const result = normalizeGhanaPhoneNumber("")
    expect(result).toBeNull()
  })

  it("normalizeGhanaPhoneNumber: should handle various valid formats", () => {
    const validNumbers = [
      "0201234567", // 10 digits (Accra)
      "0261234567", // 10 digits (Kumasi)
      "0501234567", // 10 digits (Vodafone)
      "0551234567", // 10 digits (Airtel)
      "233201234567", // 233 + 9 digits
      "+233201234567", // +233 + 9 digits
    ]

    validNumbers.forEach((phone) => {
      const result = normalizeGhanaPhoneNumber(phone)
      expect(result).toBeTruthy()
      expect(result).toMatch(/^233\d{9}$/)
    })
  })
})

describe("SMS Service - Sending", () => {
  it("sendSMS: should return error for invalid phone", async () => {
    const result = await sendSMS({
      phoneNumber: "invalid",
      message: "Test",
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain("Invalid phone number format")
  })

  it("sendSMS: should accept valid phone number", async () => {
    const result = await sendSMS({
      phoneNumber: "233501234567",
      message: "Test message",
    })

    expect(result.success).toBe(true)
    expect(result.messageId).toBeDefined()
  })
})

describe("SMS Service - Templates", () => {
  it("sendApprovalSMS: should create approval SMS", async () => {
    const result = await sendApprovalSMS("233501234567", 500, "REF-12345", 1500)

    expect(result.success).toBe(true)
  })

  it("sendDeclineSMS: should create decline SMS", async () => {
    const result = await sendDeclineSMS(
      "233501234567",
      500,
      "Insufficient funds",
    )

    expect(result.success).toBe(true)
  })

  it("sendReceiptConfirmationSMS: should create receipt SMS", async () => {
    const result = await sendReceiptConfirmationSMS("233501234567", 500, 1500)

    expect(result.success).toBe(true)
  })

  it("sendApprovalSMS: should reject invalid phone", async () => {
    const result = await sendApprovalSMS("invalid", 500, "REF-12345", 1500)

    expect(result.success).toBe(false)
  })

  it("sendDeclineSMS: should reject invalid phone", async () => {
    const result = await sendDeclineSMS("invalid", 500, "Test reason")

    expect(result.success).toBe(false)
  })

  it("sendReceiptConfirmationSMS: should reject invalid phone", async () => {
    const result = await sendReceiptConfirmationSMS("invalid", 500, 1500)

    expect(result.success).toBe(false)
  })
})

