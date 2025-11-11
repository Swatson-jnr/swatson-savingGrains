/// <reference types="jest" />
import { POST } from "@/app/api/wallet-topup-request/route"
import { NextRequest } from "next/server"
import User from "@/lib/models/user"
import Wallet from "@/lib/models/wallet"
import WalletRequest from "@/lib/models/walletRequest"
import { signToken } from "@/lib/auth"
import {
  createTestUser,
  createAdminUser,
  createPaymasterUser,
  createAppWallet,
} from "../factories"

/**
 * Integration Tests for Task 0.4: POST /api/wallet-topup-request - Auto-approve for admin/paymaster
 *
 * Test Coverage:
 * 1. Regular user creates pending request (no wallet deduction)
 * 2. Admin creates approved request (auto-approval with wallet deduction)
 * 3. Paymaster creates approved request (auto-approval with wallet deduction)
 * 4. Insufficient funds error handling
 * 5. Validation errors (missing amount, negative amount, etc.)
 */
describe("POST /api/wallet-topup-request - Task 0.4 Integration Tests", () => {
  /**
   * Helper function to create authenticated request
   */
  const createAuthRequest = (userId: string, body: unknown) => {
    const token = signToken({
      id: userId,
      phone_number: "+233501234567",
    })

    return new NextRequest("http://localhost:3000/api/wallet-topup-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
  }

  describe("✅ TEST 1: Regular user creates pending request", () => {
    it("should create request with status 'pending' for regular user", async () => {
      // Arrange: Create regular user (field-agent role)
      const regularUser = await createTestUser({
        roles: ["field-agent"],
        walletBalance: 0,
      })

      // Act: POST request as regular user
      const request = createAuthRequest(regularUser._id.toString(), {
        amount: 100,
        reason: "Test top-up request",
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(201)
      expect(data.walletRequest).toBeDefined()
      expect(data.walletRequest.status).toBe("pending")
      expect(data.walletRequest.amount).toBe(100)
      expect(data.walletRequest.payment_method).toBeNull()
      expect(data.walletRequest.reason).toBe("Test top-up request")
      expect(data.walletRequest.user.toString()).toBe(
        regularUser._id.toString(),
      )
    })

    it("should NOT deduct from wallet for regular user", async () => {
      // Arrange
      const regularUser = await createTestUser({
        roles: ["field-agent"],
        walletBalance: 0,
      })
      await createAppWallet(1000) // System wallet with 1000 GHS

      // Act
      const request = createAuthRequest(regularUser._id.toString(), {
        amount: 100,
        reason: "Test",
      })

      await POST(request)

      // Assert: User balance should remain 0 (no wallet deduction)
      const updatedUser = await User.findById(regularUser._id)
      expect(updatedUser?.walletBalance).toBe(0)

      // Assert: App wallet should remain 1000 (no deduction yet)
      const appWallet = await Wallet.findOne({ type: "app" })
      expect(appWallet?.balance).toBe(1000)
    })

    it("should NOT set reviewed_by or reviewed_at for regular user", async () => {
      // Arrange
      const regularUser = await createTestUser({ roles: ["field-agent"] })

      // Act
      const request = createAuthRequest(regularUser._id.toString(), {
        amount: 100,
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(data.walletRequest.reviewed_by).toBeUndefined()
      expect(data.walletRequest.reviewed_at).toBeUndefined()
    })

    it("should create request without reason (optional field)", async () => {
      // Arrange
      const regularUser = await createTestUser({ roles: ["field-agent"] })

      // Act: No reason provided
      const request = createAuthRequest(regularUser._id.toString(), {
        amount: 100,
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(201)
      expect(data.walletRequest.status).toBe("pending")
      expect(data.walletRequest.reason).toBeUndefined()
    })
  })

  describe("✅ TEST 2: Admin creates approved request with wallet deduction", () => {
    it("should create request with status 'approved' for admin", async () => {
      // Arrange: Create admin user and app wallet
      const adminUser = await createAdminUser({ walletBalance: 0 })
      await createAppWallet(1000)

      // Act: POST request as admin
      const request = createAuthRequest(adminUser._id.toString(), {
        amount: 100,
        reason: "Admin top-up",
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(201)
      expect(data.walletRequest).toBeDefined()
      expect(data.walletRequest.status).toBe("approved")
      expect(data.walletRequest.amount).toBe(100)
    })

    it("should deduct from app wallet and credit admin's wallet balance", async () => {
      // Arrange
      const adminUser = await createAdminUser({ walletBalance: 0 })
      await createAppWallet(1000)

      // Act
      const request = createAuthRequest(adminUser._id.toString(), {
        amount: 100,
      })

      await POST(request)

      // Assert: App wallet should be debited
      const appWallet = await Wallet.findOne({ type: "app" })
      expect(appWallet?.balance).toBe(900) // 1000 - 100

      // Assert: Admin's wallet balance should be credited
      const updatedAdmin = await User.findById(adminUser._id)
      expect(updatedAdmin?.walletBalance).toBe(100)
    })

    it("should set reviewed_by and reviewed_at for admin auto-approval", async () => {
      // Arrange
      const adminUser = await createAdminUser({ walletBalance: 0 })
      await createAppWallet(1000)

      // Act
      const request = createAuthRequest(adminUser._id.toString(), {
        amount: 100,
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(data.walletRequest.reviewed_by.toString()).toBe(
        adminUser._id.toString(),
      )
      expect(data.walletRequest.reviewed_at).toBeDefined()
      expect(new Date(data.walletRequest.reviewed_at)).toBeInstanceOf(Date)
    })

    it("should handle multiple admin approvals correctly", async () => {
      // Arrange
      const admin1 = await createAdminUser({ walletBalance: 0 })
      const admin2 = await createAdminUser({ walletBalance: 0 })
      await createAppWallet(1000)

      // Act: Two admins create requests
      const request1 = createAuthRequest(admin1._id.toString(), { amount: 100 })
      const request2 = createAuthRequest(admin2._id.toString(), { amount: 200 })

      await POST(request1)
      await POST(request2)

      // Assert: App wallet should reflect both deductions
      const appWallet = await Wallet.findOne({ type: "app" })
      expect(appWallet?.balance).toBe(700) // 1000 - 100 - 200

      // Assert: Both admins should have credited balances
      const updatedAdmin1 = await User.findById(admin1._id)
      const updatedAdmin2 = await User.findById(admin2._id)
      expect(updatedAdmin1?.walletBalance).toBe(100)
      expect(updatedAdmin2?.walletBalance).toBe(200)
    })
  })

  describe("✅ TEST 3: Paymaster creates approved request with wallet deduction", () => {
    it("should create request with status 'approved' for paymaster", async () => {
      // Arrange
      const paymasterUser = await createPaymasterUser({ walletBalance: 0 })
      await createAppWallet(1000)

      // Act
      const request = createAuthRequest(paymasterUser._id.toString(), {
        amount: 150,
        reason: "Paymaster top-up",
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(201)
      expect(data.walletRequest.status).toBe("approved")
      expect(data.walletRequest.amount).toBe(150)
    })

    it("should deduct from app wallet and credit paymaster's wallet balance", async () => {
      // Arrange
      const paymasterUser = await createPaymasterUser({ walletBalance: 50 })
      await createAppWallet(1000)

      // Act
      const request = createAuthRequest(paymasterUser._id.toString(), {
        amount: 150,
      })

      await POST(request)

      // Assert
      const appWallet = await Wallet.findOne({ type: "app" })
      expect(appWallet?.balance).toBe(850) // 1000 - 150

      const updatedPaymaster = await User.findById(paymasterUser._id)
      expect(updatedPaymaster?.walletBalance).toBe(200) // 50 + 150
    })

    it("should set reviewed_by and reviewed_at for paymaster auto-approval", async () => {
      // Arrange
      const paymasterUser = await createPaymasterUser({ walletBalance: 0 })
      await createAppWallet(1000)

      // Act
      const request = createAuthRequest(paymasterUser._id.toString(), {
        amount: 100,
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(data.walletRequest.reviewed_by.toString()).toBe(
        paymasterUser._id.toString(),
      )
      expect(data.walletRequest.reviewed_at).toBeDefined()
    })
  })

  describe("✅ TEST 4: Insufficient funds error handling", () => {
    it("should return 201 with pending status when app wallet has insufficient funds (admin)", async () => {
      // Arrange: App wallet only has 50 GHS
      const adminUser = await createAdminUser({ walletBalance: 0 })
      await createAppWallet(50)

      // Act: Admin requests 100 GHS (more than available)
      const request = createAuthRequest(adminUser._id.toString(), {
        amount: 100,
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert: Returns 201 (success) but request is pending
      expect(response.status).toBe(201)
      expect(data.walletRequest).toBeDefined()
      expect(data.walletRequest.status).toBe("pending")
      expect(data.note).toBeDefined()
      expect(data.note).toContain("Auto-approval failed")
    })

    it("should create wallet request in pending state on insufficient funds", async () => {
      // Arrange
      const adminUser = await createAdminUser({ walletBalance: 0 })
      await createAppWallet(50)

      // Act
      const request = createAuthRequest(adminUser._id.toString(), {
        amount: 100,
      })

      await POST(request)

      // Assert: Wallet request should exist in pending state
      const requests = await WalletRequest.find({ user: adminUser._id })
      expect(requests).toHaveLength(1)
      expect(requests[0].status).toBe("pending")
    })

    it("should NOT modify wallet balances on insufficient funds", async () => {
      // Arrange
      const adminUser = await createAdminUser({ walletBalance: 0 })
      await createAppWallet(50)

      // Act
      const request = createAuthRequest(adminUser._id.toString(), {
        amount: 100,
      })

      await POST(request)

      // Assert: App wallet should remain 50
      const appWallet = await Wallet.findOne({ type: "app" })
      expect(appWallet?.balance).toBe(50)

      // Assert: Admin balance should remain 0
      const updatedAdmin = await User.findById(adminUser._id)
      expect(updatedAdmin?.walletBalance).toBe(0)
    })

    it("should return 201 with pending status when app wallet has insufficient funds (paymaster)", async () => {
      // Arrange
      const paymasterUser = await createPaymasterUser({ walletBalance: 0 })
      await createAppWallet(80)

      // Act: Paymaster requests 100 GHS
      const request = createAuthRequest(paymasterUser._id.toString(), {
        amount: 100,
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert: Returns 201 with pending request
      expect(response.status).toBe(201)
      expect(data.walletRequest.status).toBe("pending")
    })
  })

  describe("✅ TEST 5: Validation errors", () => {
    it("should return 400 if amount is missing", async () => {
      // Arrange
      const regularUser = await createTestUser({ roles: ["field-agent"] })

      // Act: No amount provided
      const request = createAuthRequest(regularUser._id.toString(), {
        reason: "Test",
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Amount must be a positive number")
    })

    it("should return 400 if amount is zero", async () => {
      // Arrange
      const regularUser = await createTestUser({ roles: ["field-agent"] })

      // Act
      const request = createAuthRequest(regularUser._id.toString(), {
        amount: 0,
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Amount must be a positive number")
    })

    it("should return 400 if amount is negative", async () => {
      // Arrange
      const regularUser = await createTestUser({ roles: ["field-agent"] })

      // Act
      const request = createAuthRequest(regularUser._id.toString(), {
        amount: -100,
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Amount must be a positive number")
    })

    it("should return 400 if amount is not a number", async () => {
      // Arrange
      const regularUser = await createTestUser({ roles: ["field-agent"] })

      // Act
      const request = createAuthRequest(regularUser._id.toString(), {
        amount: "100", // String instead of number
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Amount must be a positive number")
    })

    it("should return 401 if no auth token provided", async () => {
      // Act: Request without Authorization header
      const request = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: 100 }),
        },
      )

      const response = await POST(request)

      // Assert
      expect(response.status).toBe(401)
    })

    it("should return 404 if user not found", async () => {
      // Arrange: Create token for non-existent user
      const fakeUserId = "507f1f77bcf86cd799439011"
      const request = createAuthRequest(fakeUserId, { amount: 100 })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(data.error).toBe("User not found")
    })
  })

  describe("✅ TEST 6: Payment method field behavior", () => {
    it("should set payment_method to null at creation (regular user)", async () => {
      // Arrange
      const regularUser = await createTestUser({ roles: ["field-agent"] })

      // Act
      const request = createAuthRequest(regularUser._id.toString(), {
        amount: 100,
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(data.walletRequest.payment_method).toBeNull()
    })

    it("should set payment_method to null at creation (admin auto-approval)", async () => {
      // Arrange
      const adminUser = await createAdminUser({ walletBalance: 0 })
      await createAppWallet(1000)

      // Act
      const request = createAuthRequest(adminUser._id.toString(), {
        amount: 100,
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert: payment_method should be null even for auto-approved requests
      expect(data.walletRequest.payment_method).toBeNull()
    })

    it("should ignore payment_method if provided in request body", async () => {
      // Arrange
      const regularUser = await createTestUser({ roles: ["field-agent"] })

      // Act: Try to send payment_method (should be ignored)
      const request = createAuthRequest(regularUser._id.toString(), {
        amount: 100,
        payment_method: "mobile_money", // Should be ignored
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert: payment_method should still be null
      expect(response.status).toBe(201)
      expect(data.walletRequest.payment_method).toBeNull()
    })
  })

  describe("✅ TEST 7: End-to-end flow scenarios", () => {
    it("E2E: Regular user creates pending request, then admin creates auto-approved request", async () => {
      // Arrange
      const regularUser = await createTestUser({ roles: ["field-agent"] })
      const adminUser = await createAdminUser({ walletBalance: 0 })
      await createAppWallet(1000)

      // Act 1: Regular user creates request
      const userRequest = createAuthRequest(regularUser._id.toString(), {
        amount: 50,
      })
      const userResponse = await POST(userRequest)
      const userData = await userResponse.json()

      // Act 2: Admin creates request
      const adminRequest = createAuthRequest(adminUser._id.toString(), {
        amount: 100,
      })
      const adminResponse = await POST(adminRequest)
      const adminData = await adminResponse.json()

      // Assert: User request is pending
      expect(userData.walletRequest.status).toBe("pending")
      expect(userResponse.status).toBe(201)

      // Assert: Admin request is approved
      expect(adminData.walletRequest.status).toBe("approved")
      expect(adminResponse.status).toBe(201)

      // Assert: Only admin got wallet credit
      const updatedUser = await User.findById(regularUser._id)
      const updatedAdmin = await User.findById(adminUser._id)
      expect(updatedUser?.walletBalance).toBe(0) // Regular user: no credit yet
      expect(updatedAdmin?.walletBalance).toBe(100) // Admin: credited

      // Assert: App wallet only debited for admin
      const appWallet = await Wallet.findOne({ type: "app" })
      expect(appWallet?.balance).toBe(900) // 1000 - 100 (admin only)
    })

    it("E2E: Multiple admins and paymasters create requests", async () => {
      // Arrange
      const admin1 = await createAdminUser({ walletBalance: 0 })
      const admin2 = await createAdminUser({ walletBalance: 0 })
      const paymaster = await createPaymasterUser({ walletBalance: 0 })
      await createAppWallet(1000)

      // Act
      await POST(createAuthRequest(admin1._id.toString(), { amount: 100 }))
      await POST(createAuthRequest(admin2._id.toString(), { amount: 200 }))
      await POST(createAuthRequest(paymaster._id.toString(), { amount: 150 }))

      // Assert: All requests auto-approved
      const requests = await WalletRequest.find({ status: "approved" })
      expect(requests).toHaveLength(3)

      // Assert: App wallet debited correctly
      const appWallet = await Wallet.findOne({ type: "app" })
      expect(appWallet?.balance).toBe(550) // 1000 - 100 - 200 - 150

      // Assert: All users credited correctly
      const updatedAdmin1 = await User.findById(admin1._id)
      const updatedAdmin2 = await User.findById(admin2._id)
      const updatedPaymaster = await User.findById(paymaster._id)
      expect(updatedAdmin1?.walletBalance).toBe(100)
      expect(updatedAdmin2?.walletBalance).toBe(200)
      expect(updatedPaymaster?.walletBalance).toBe(150)
    })

    it("E2E: Admin request fails due to insufficient funds, then succeeds after funding", async () => {
      // Arrange
      const adminUser = await createAdminUser({ walletBalance: 0 })
      await createAppWallet(50) // Only 50 GHS

      // Act 1: Admin tries to request 100 GHS (should create pending request)
      const failRequest = createAuthRequest(adminUser._id.toString(), {
        amount: 100,
      })
      const failResponse = await POST(failRequest)
      const failData = await failResponse.json()

      // Assert: Request created in pending state
      expect(failResponse.status).toBe(201)
      expect(failData.walletRequest.status).toBe("pending")
      expect(failData.note).toContain("Auto-approval failed")

      // Act 2: Add more funds to app wallet
      await Wallet.findOneAndUpdate({ type: "app" }, { balance: 500 })

      // Act 3: Admin creates a new request (should succeed with auto-approval)
      const successRequest = createAuthRequest(adminUser._id.toString(), {
        amount: 100,
      })
      const successResponse = await POST(successRequest)
      const successData = await successResponse.json()

      // Assert: New request succeeded with auto-approval
      expect(successResponse.status).toBe(201)
      expect(successData.walletRequest.status).toBe("approved")

      const appWallet = await Wallet.findOne({ type: "app" })
      expect(appWallet?.balance).toBe(400) // 500 - 100

      const updatedAdmin = await User.findById(adminUser._id)
      expect(updatedAdmin?.walletBalance).toBe(100)
    })
  })

  describe("✅ TEST 8: Atomicity and transaction integrity", () => {
    it("should ensure atomic wallet changes when approval succeeds", async () => {
      // This test verifies that processWalletApproval handles success atomically
      const adminUser = await createAdminUser({ walletBalance: 0 })
      await createAppWallet(1000)

      // Act
      const request = createAuthRequest(adminUser._id.toString(), {
        amount: 100,
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert: Transaction was atomic and successful
      expect(response.status).toBe(201)
      expect(data.walletRequest.status).toBe("approved")

      const appWallet = await Wallet.findOne({ type: "app" })
      const updatedAdmin = await User.findById(adminUser._id)

      // Both should be updated together
      expect(appWallet?.balance).toBe(900)
      expect(updatedAdmin?.walletBalance).toBe(100)
    })

    it("should leave request in pending state on transaction failure", async () => {
      // Arrange
      const adminUser = await createAdminUser({ walletBalance: 0 })
      await createAppWallet(50) // Insufficient funds

      // Act
      const request = createAuthRequest(adminUser._id.toString(), {
        amount: 100,
      })

      const response = await POST(request)
      const data = await response.json()

      // Assert: Request exists in pending state (not deleted)
      expect(response.status).toBe(201)
      expect(data.walletRequest.status).toBe("pending")

      const requests = await WalletRequest.find({ user: adminUser._id })
      expect(requests).toHaveLength(1)
      expect(requests[0].status).toBe("pending")
    })
  })
})

