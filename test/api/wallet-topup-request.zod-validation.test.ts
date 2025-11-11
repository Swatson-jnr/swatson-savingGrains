/// <reference types="jest" />
/**
 * Integration Tests for Phase 0a: Zod Request Body Validation
 *
 * Test Coverage:
 * 1. CreateWalletRequestSchema validation
 * 2. ApproveDeclineSchema validation
 * 3. ConfirmReceiptSchema validation
 * 4. Validation middleware integration with endpoints
 */

import { POST } from "@/app/api/wallet-topup-request/route"
import { PUT } from "@/app/api/wallet-topup-request/[id]/route"
import { PUT as ConfirmReceiptPUT } from "@/app/api/wallet-topup-request/[id]/confirm-receipt/route"
import { NextRequest } from "next/server"
import { signToken } from "@/lib/auth"
import { createTestUser, createAdminUser, createAppWallet } from "../factories"
import WalletRequest from "@/lib/models/walletRequest"
import { WalletRequestStatus } from "@/lib/models/walletRequest.enums"

describe("Phase 0a: Zod Request Body Validation", () => {
  /**
   * Helper to create authenticated request
   */
  const createAuthRequest = (
    userId: string,
    body: unknown,
    method: string = "POST",
    url: string = "http://localhost:3000/api/wallet-topup-request",
  ) => {
    const token = signToken({
      id: userId,
      phone_number: "+233501234567",
    })

    return new NextRequest(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
  }

  describe("CreateWalletRequestSchema - POST /api/wallet-topup-request", () => {
    it("should accept valid request with amount only", async () => {
      const user = await createTestUser({ roles: ["field-agent"] })
      const request = createAuthRequest(user._id.toString(), { amount: 100 })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.walletRequest).toBeDefined()
      expect(data.walletRequest.amount).toBe(100)
    })

    it("should accept valid request with amount and reason", async () => {
      const user = await createTestUser({ roles: ["field-agent"] })
      const request = createAuthRequest(user._id.toString(), {
        amount: 250.5,
        reason: "Need funds for operations",
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.walletRequest.amount).toBe(250.5)
      expect(data.walletRequest.reason).toBe("Need funds for operations")
    })

    it("should reject missing amount", async () => {
      const user = await createTestUser({ roles: ["field-agent"] })
      const request = createAuthRequest(user._id.toString(), {
        reason: "Test request",
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(
        /Amount must be a positive number|Amount is required/i,
      )
    })

    it("should reject negative amount", async () => {
      const user = await createTestUser({ roles: ["field-agent"] })
      const request = createAuthRequest(user._id.toString(), { amount: -50 })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Amount must be a positive number")
    })

    it("should reject zero amount", async () => {
      const user = await createTestUser({ roles: ["field-agent"] })
      const request = createAuthRequest(user._id.toString(), { amount: 0 })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Amount must be a positive number")
    })

    it("should reject amount exceeding maximum", async () => {
      const user = await createTestUser({ roles: ["field-agent"] })
      const request = createAuthRequest(user._id.toString(), {
        amount: 1000001,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(
        /Amount cannot exceed|Number must be less than or equal to/,
      )
    })

    it("should reject reason exceeding 500 characters", async () => {
      const user = await createTestUser({ roles: ["field-agent"] })
      const longReason = "x".repeat(501)
      const request = createAuthRequest(user._id.toString(), {
        amount: 100,
        reason: longReason,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      // Single error returns message directly
      expect(data.error).toMatch(
        /String must contain at most 500 character|Too|cannot exceed 500/,
      )
    })

    it("should reject invalid JSON", async () => {
      const user = await createTestUser({ roles: ["field-agent"] })
      const token = signToken({
        id: user._id.toString(),
        phone_number: "+233501234567",
      })

      const request = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: "{ invalid json",
        },
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid JSON in request body")
    })
  })

  describe("ApproveDeclineSchema - PUT /api/wallet-topup-request/[id]", () => {
    it("should accept valid approval with mobile_money details", async () => {
      const admin = await createAdminUser()
      const user = await createTestUser({ roles: ["field-agent"] })
      await createAppWallet(1000)

      const walletRequest = await WalletRequest.create({
        user: user._id,
        amount: 100,
        status: WalletRequestStatus.PENDING,
      })

      const request = createAuthRequest(
        admin._id.toString(),
        {
          status: "approved",
          payment_method: "mobile_money",
          provider: "MTN",
          phone_number: "0501234567",
        },
        "PUT",
        `http://localhost:3000/api/wallet-topup-request/${walletRequest._id}`,
      )

      const response = await PUT(request, {
        params: Promise.resolve({ id: walletRequest._id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe("approved")
    })

    it("should reject declined status without rejection reason", async () => {
      const admin = await createAdminUser()
      const user = await createTestUser({ roles: ["field-agent"] })

      const walletRequest = await WalletRequest.create({
        user: user._id,
        amount: 100,
        status: WalletRequestStatus.PENDING,
      })

      const request = createAuthRequest(
        admin._id.toString(),
        {
          status: "declined",
        },
        "PUT",
        `http://localhost:3000/api/wallet-topup-request/${walletRequest._id}`,
      )

      const response = await PUT(request, {
        params: Promise.resolve({ id: walletRequest._id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe(
        "rejectionReason is required when declining a request",
      )
    })

    it("should reject declined status with empty rejection reason", async () => {
      const admin = await createAdminUser()
      const user = await createTestUser({ roles: ["field-agent"] })

      const walletRequest = await WalletRequest.create({
        user: user._id,
        amount: 100,
        status: WalletRequestStatus.PENDING,
      })

      const request = createAuthRequest(
        admin._id.toString(),
        {
          status: "declined",
          rejectionReason: "",
        },
        "PUT",
        `http://localhost:3000/api/wallet-topup-request/${walletRequest._id}`,
      )

      const response = await PUT(request, {
        params: Promise.resolve({ id: walletRequest._id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      // Empty rejection reason triggers multiple validation errors
      expect(data.error).toBe("Validation failed")
      expect(data.details).toBeDefined()
    })

    it("should accept declined status with valid rejection reason", async () => {
      const admin = await createAdminUser()
      const user = await createTestUser({ roles: ["field-agent"] })

      const walletRequest = await WalletRequest.create({
        user: user._id,
        amount: 100,
        status: WalletRequestStatus.PENDING,
      })

      const request = createAuthRequest(
        admin._id.toString(),
        {
          status: "declined",
          rejectionReason: "Insufficient documentation",
        },
        "PUT",
        `http://localhost:3000/api/wallet-topup-request/${walletRequest._id}`,
      )

      const response = await PUT(request, {
        params: Promise.resolve({ id: walletRequest._id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe("declined")
      expect(data.rejectionReason).toBe("Insufficient documentation")
    })

    it("should reject mobile_money without provider", async () => {
      const admin = await createAdminUser()
      const user = await createTestUser({ roles: ["field-agent"] })

      const walletRequest = await WalletRequest.create({
        user: user._id,
        amount: 100,
        status: WalletRequestStatus.PENDING,
      })

      const request = createAuthRequest(
        admin._id.toString(),
        {
          status: "approved",
          payment_method: "mobile_money",
          phone_number: "0501234567",
        },
        "PUT",
        `http://localhost:3000/api/wallet-topup-request/${walletRequest._id}`,
      )

      const response = await PUT(request, {
        params: Promise.resolve({ id: walletRequest._id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe(
        "Provider is required for mobile_money payment method",
      )
    })

    it("should reject mobile_money without phone number", async () => {
      const admin = await createAdminUser()
      const user = await createTestUser({ roles: ["field-agent"] })

      const walletRequest = await WalletRequest.create({
        user: user._id,
        amount: 100,
        status: WalletRequestStatus.PENDING,
      })

      const request = createAuthRequest(
        admin._id.toString(),
        {
          status: "approved",
          payment_method: "mobile_money",
          provider: "MTN",
        },
        "PUT",
        `http://localhost:3000/api/wallet-topup-request/${walletRequest._id}`,
      )

      const response = await PUT(request, {
        params: Promise.resolve({ id: walletRequest._id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe(
        "Phone number is required for mobile_money payment method",
      )
    })

    it("should reject bank_transfer without bank name", async () => {
      const admin = await createAdminUser()
      const user = await createTestUser({ roles: ["field-agent"] })

      const walletRequest = await WalletRequest.create({
        user: user._id,
        amount: 100,
        status: WalletRequestStatus.PENDING,
      })

      const request = createAuthRequest(
        admin._id.toString(),
        {
          status: "approved",
          payment_method: "bank_transfer",
          branch_name: "Accra Branch",
        },
        "PUT",
        `http://localhost:3000/api/wallet-topup-request/${walletRequest._id}`,
      )

      const response = await PUT(request, {
        params: Promise.resolve({ id: walletRequest._id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe(
        "Bank name is required for bank_transfer payment method",
      )
    })

    it("should reject rejection reason exceeding 500 characters", async () => {
      const admin = await createAdminUser()
      const user = await createTestUser({ roles: ["field-agent"] })

      const walletRequest = await WalletRequest.create({
        user: user._id,
        amount: 100,
        status: WalletRequestStatus.PENDING,
      })

      const request = createAuthRequest(
        admin._id.toString(),
        {
          status: "declined",
          rejectionReason: "x".repeat(501),
        },
        "PUT",
        `http://localhost:3000/api/wallet-topup-request/${walletRequest._id}`,
      )

      const response = await PUT(request, {
        params: Promise.resolve({ id: walletRequest._id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(
        /rejectionReason|String must contain at most 500 character|Too/,
      )
    })

    it("should reject extra fields (strict mode)", async () => {
      const admin = await createAdminUser()
      const user = await createTestUser({ roles: ["field-agent"] })

      const walletRequest = await WalletRequest.create({
        user: user._id,
        amount: 100,
        status: WalletRequestStatus.PENDING,
      })

      const request = createAuthRequest(
        admin._id.toString(),
        {
          status: "approved",
          payment_method: "cash",
          extra_field: "should not be here",
        },
        "PUT",
        `http://localhost:3000/api/wallet-topup-request/${walletRequest._id}`,
      )

      const response = await PUT(request, {
        params: Promise.resolve({ id: walletRequest._id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/Unrecognized key|extra_field/)
    })
  })

  describe("ConfirmReceiptSchema - PUT /api/wallet-topup-request/[id]/confirm-receipt", () => {
    it("should accept empty body", async () => {
      const user = await createTestUser({ roles: ["field-agent"] })

      const walletRequest = await WalletRequest.create({
        user: user._id,
        amount: 100,
        status: WalletRequestStatus.APPROVED,
      })

      const request = createAuthRequest(
        user._id.toString(),
        {},
        "PUT",
        `http://localhost:3000/api/wallet-topup-request/${walletRequest._id}/confirm-receipt`,
      )

      const response = await ConfirmReceiptPUT(request, {
        params: Promise.resolve({ id: walletRequest._id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.walletRequest.status).toBe("successful")
    })

    it("should reject extra fields (strict mode)", async () => {
      const user = await createTestUser({ roles: ["field-agent"] })

      const walletRequest = await WalletRequest.create({
        user: user._id,
        amount: 100,
        status: WalletRequestStatus.APPROVED,
      })

      const request = createAuthRequest(
        user._id.toString(),
        {
          extra_field: "should not be here",
        },
        "PUT",
        `http://localhost:3000/api/wallet-topup-request/${walletRequest._id}/confirm-receipt`,
      )

      const response = await ConfirmReceiptPUT(request, {
        params: Promise.resolve({ id: walletRequest._id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/Unrecognized key|extra/)
    })
  })
})

