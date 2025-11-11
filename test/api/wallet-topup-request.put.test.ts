/**
 * Integration tests for PUT /api/wallet-topup-request/[id]
 * Task 0.5: Manual approval for regular user requests
 */

import { PUT } from "@/app/api/wallet-topup-request/[id]/route"
import { POST as CreateRequest } from "@/app/api/wallet-topup-request/route"
import { signToken } from "@/lib/auth"
import User from "@/lib/models/user"
import Wallet from "@/lib/models/wallet"
import WalletRequest from "@/lib/models/walletRequest"
import {
  createAdminUser,
  createAppWallet,
  createFieldAgentUser,
} from "@/test/factories"
import { NextRequest } from "next/server"

describe("PUT /api/wallet-topup-request/[id] - Task 0.5 Manual Approval Tests", () => {
  describe("✅ TEST 1: Admin approval of pending request", () => {
    it("should approve pending request and deduct wallet balances", async () => {
      // Setup: Create regular user, admin, and app wallet
      const regularUser = await createFieldAgentUser({
        walletBalance: 0,
      })
      const adminUser = await createAdminUser()
      const appWallet = await createAppWallet(1000)

      // Regular user creates request (will be pending)
      const createToken = signToken({
        id: regularUser._id.toString(),
        phone_number: regularUser.phone_number,
      })
      const createReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${createToken}`,
          },
          body: JSON.stringify({
            amount: 100,
            reason: "Test request",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      expect(createResponse.status).toBe(201)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Admin approves request
      const approveToken = signToken({
        id: adminUser._id.toString(),
        phone_number: adminUser.phone_number,
      })
      const approveReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${approveToken}`,
          },
          body: JSON.stringify({
            status: "approved",
            payment_method: "cash",
          }),
        },
      )
      const approveResponse = await PUT(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: Response is 200 with approved status
      expect(approveResponse.status).toBe(200)
      const approveData = await approveResponse.json()
      expect(approveData.status).toBe("approved")
      expect(approveData.payment_method).toBe("cash")

      // Assert: Wallet balances updated correctly
      const updatedAppWallet = await Wallet.findById(appWallet._id)
      expect(updatedAppWallet?.balance).toBe(900) // 1000 - 100

      const updatedUser = await User.findById(regularUser._id)
      expect(updatedUser?.walletBalance).toBe(100) // 0 + 100

      // Assert: reviewed_by and reviewed_at are set
      const updatedRequest = await WalletRequest.findById(requestId)
      expect(updatedRequest?.reviewed_by?.toString()).toBe(
        adminUser._id.toString(),
      )
      expect(updatedRequest?.reviewed_at).toBeDefined()
    })
  })

  describe("✅ TEST 2: Payment method details are stored", () => {
    it("should store mobile_money payment details", async () => {
      const regularUser = await createFieldAgentUser()
      const adminUser = await createAdminUser()
      await createAppWallet(1000)

      // Create pending request
      const createToken = signToken({
        id: regularUser._id.toString(),
        phone_number: regularUser.phone_number,
      })
      const createReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${createToken}`,
          },
          body: JSON.stringify({
            amount: 50,
            reason: "Mobile money test",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Approve with mobile_money details
      const approveToken = signToken({
        id: adminUser._id.toString(),
        phone_number: adminUser.phone_number,
      })
      const approveReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${approveToken}`,
          },
          body: JSON.stringify({
            status: "approved",
            payment_method: "mobile_money",
            provider: "MTN",
            phone_number: "+233501234567",
          }),
        },
      )
      const approveResponse = await PUT(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })

      expect(approveResponse.status).toBe(200)
      const approveData = await approveResponse.json()
      expect(approveData.payment_method).toBe("mobile_money")
      expect(approveData.provider).toBe("MTN")
      expect(approveData.phone_number).toBe("+233501234567")

      // Verify in database
      const updatedRequest = await WalletRequest.findById(requestId)
      expect(updatedRequest?.payment_method).toBe("mobile_money")
      expect(updatedRequest?.provider).toBe("MTN")
      expect(updatedRequest?.phone_number).toBe("+233501234567")
    })

    it("should store bank_transfer payment details", async () => {
      const regularUser = await createFieldAgentUser()
      const adminUser = await createAdminUser()
      await createAppWallet(1000)

      // Create pending request
      const createToken = signToken({
        id: regularUser._id.toString(),
        phone_number: regularUser.phone_number,
      })
      const createReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${createToken}`,
          },
          body: JSON.stringify({
            amount: 200,
            reason: "Bank transfer test",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Approve with bank_transfer details
      const approveToken = signToken({
        id: adminUser._id.toString(),
        phone_number: adminUser.phone_number,
      })
      const approveReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${approveToken}`,
          },
          body: JSON.stringify({
            status: "approved",
            payment_method: "bank_transfer",
            bank_name: "Ghana Commercial Bank",
            branch_name: "Accra Main Branch",
          }),
        },
      )
      const approveResponse = await PUT(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })

      expect(approveResponse.status).toBe(200)
      const approveData = await approveResponse.json()
      expect(approveData.payment_method).toBe("bank_transfer")
      expect(approveData.bank_name).toBe("Ghana Commercial Bank")
      expect(approveData.branch_name).toBe("Accra Main Branch")

      // Verify in database
      const updatedRequest = await WalletRequest.findById(requestId)
      expect(updatedRequest?.payment_method).toBe("bank_transfer")
      expect(updatedRequest?.bank_name).toBe("Ghana Commercial Bank")
      expect(updatedRequest?.branch_name).toBe("Accra Main Branch")
    })
  })

  describe("✅ TEST 3: Regular user permission denied", () => {
    it("should return 403 when regular user tries to approve own request", async () => {
      const regularUser = await createFieldAgentUser()
      await createAppWallet(1000)

      // Create pending request
      const token = signToken({
        id: regularUser._id.toString(),
        phone_number: regularUser.phone_number,
      })
      const createReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: 100,
            reason: "Test",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Try to approve own request
      const approveReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "approved",
            payment_method: "cash",
          }),
        },
      )
      const approveResponse = await PUT(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: 403 Forbidden
      expect(approveResponse.status).toBe(403)
      const errorData = await approveResponse.json()
      expect(errorData.error).toContain("Forbidden")

      // Assert: No wallet changes
      const user = await User.findById(regularUser._id)
      expect(user?.walletBalance).toBe(0)

      // Assert: Status still pending
      const request = await WalletRequest.findById(requestId)
      expect(request?.status).toBe("pending")
    })
  })

  describe("✅ TEST 4: Insufficient funds handling", () => {
    it("should return 400 when app wallet has insufficient funds", async () => {
      const regularUser = await createFieldAgentUser()
      const adminUser = await createAdminUser()
      await createAppWallet(50) // Only 50 GHS available

      // Create pending request for 100 GHS
      const createToken = signToken({
        id: regularUser._id.toString(),
        phone_number: regularUser.phone_number,
      })
      const createReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${createToken}`,
          },
          body: JSON.stringify({
            amount: 100,
            reason: "Test insufficient funds",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Admin tries to approve
      const approveToken = signToken({
        id: adminUser._id.toString(),
        phone_number: adminUser.phone_number,
      })
      const approveReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${approveToken}`,
          },
          body: JSON.stringify({
            status: "approved",
            payment_method: "cash",
          }),
        },
      )
      const approveResponse = await PUT(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: 400 error with insufficient funds message
      expect(approveResponse.status).toBe(400)
      const errorData = await approveResponse.json()
      expect(errorData.error).toContain("Insufficient funds")

      // Assert: No wallet changes
      const appWallet = await Wallet.findOne({ type: "app" })
      expect(appWallet?.balance).toBe(50) // Still 50

      const user = await User.findById(regularUser._id)
      expect(user?.walletBalance).toBe(0) // Still 0

      // Assert: Status still pending
      const request = await WalletRequest.findById(requestId)
      expect(request?.status).toBe("pending")
    })

    it("should return 400 when declining without rejectionReason", async () => {
      // Setup
      const adminUser = await createAdminUser()
      const regularUser = await createFieldAgentUser({
        walletBalance: 0,
      })

      // Create pending request
      const createToken = signToken({
        id: regularUser._id.toString(),
        phone_number: regularUser.phone_number,
      })
      const createReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${createToken}`,
          },
          body: JSON.stringify({
            amount: 100,
            reason: "Test decline",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Attempt to decline without rejectionReason
      const declineToken = signToken({
        id: adminUser._id.toString(),
        phone_number: adminUser.phone_number,
      })
      const declineReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${declineToken}`,
          },
          body: JSON.stringify({
            status: "declined",
            // rejectionReason is missing
          }),
        },
      )
      const declineResponse = await PUT(declineReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: 400 error
      expect(declineResponse.status).toBe(400)
      const errorData = await declineResponse.json()
      expect(errorData.error).toBe(
        "rejectionReason is required when declining a request",
      )

      // Assert: Status still pending
      const request = await WalletRequest.findById(requestId)
      expect(request?.status).toBe("pending")
    })
  })
})

