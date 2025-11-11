/**
 * Tests for push notification service
 */

import {
  sendPushNotification,
  sendApprovalPush,
  sendDeclinePush,
  sendReceiptConfirmationPush,
} from "@/lib/services/push-notification.service"

describe("Push Notification Service", () => {
  // Spy on console methods
  let consoleLogSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance
  let consoleWarnSpy: jest.SpyInstance

  beforeEach(() => {
    // Spy on console methods
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation()
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation()
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation()
  })

  afterEach(() => {
    // Restore console methods
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })

  describe("sendPushNotification", () => {
    it("should return error for invalid token (empty string)", async () => {
      const result = await sendPushNotification({
        token: "",
        title: "Test",
        body: "Test body",
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain("Invalid FCM token")
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("[PUSH] Invalid FCM token"),
      )
    })

    it("should return error for invalid token (whitespace only)", async () => {
      const result = await sendPushNotification({
        token: "   ",
        title: "Test",
        body: "Test body",
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain("Invalid FCM token")
    })

    it("should mock notification in development/test mode", async () => {
      const result = await sendPushNotification({
        token: "test-fcm-token-123456789",
        title: "Test Notification",
        body: "This is a test",
      })

      expect(result.success).toBe(true)
      expect(result.messageId).toContain("mock-")
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("[PUSH MOCK]"),
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Test Notification"),
      )
    })

    it("should log data payload in mock mode", async () => {
      const result = await sendPushNotification({
        token: "test-token",
        title: "Test",
        body: "Test body",
        data: { key1: "value1", key2: "value2" },
      })

      expect(result.success).toBe(true)
      expect(consoleLogSpy).toHaveBeenCalledWith("[PUSH MOCK] Data:", {
        key1: "value1",
        key2: "value2",
      })
    })
  })

  describe("sendApprovalPush", () => {
    it("should send approval push with correct data", async () => {
      const result = await sendApprovalPush(
        "user-token-123",
        500,
        "REQ-12345",
        1500,
      )

      expect(result.success).toBe(true)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Wallet Top-up Approved"),
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("500 GHS"),
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("1500 GHS"),
      )
    })

    it("should return error for invalid token", async () => {
      const result = await sendApprovalPush("", 500, "REQ-12345", 1500)

      expect(result.success).toBe(false)
      expect(result.error).toContain("Invalid FCM token")
    })
  })

  describe("sendDeclinePush", () => {
    it("should send decline push with correct data", async () => {
      const result = await sendDeclinePush(
        "user-token-456",
        500,
        "Insufficient funds",
      )

      expect(result.success).toBe(true)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Wallet Top-up Declined"),
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("500 GHS"),
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Insufficient funds"),
      )
    })

    it("should return error for invalid token", async () => {
      const result = await sendDeclinePush("", 500, "Insufficient funds")

      expect(result.success).toBe(false)
      expect(result.error).toContain("Invalid FCM token")
    })
  })

  describe("sendReceiptConfirmationPush", () => {
    it("should send receipt confirmation push with correct data", async () => {
      const result = await sendReceiptConfirmationPush(
        "user-token-789",
        500,
        1500,
      )

      expect(result.success).toBe(true)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Receipt Confirmed"),
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("500 GHS"),
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("1500 GHS"),
      )
    })

    it("should return error for invalid token", async () => {
      const result = await sendReceiptConfirmationPush("", 500, 1500)

      expect(result.success).toBe(false)
      expect(result.error).toContain("Invalid FCM token")
    })
  })
})

