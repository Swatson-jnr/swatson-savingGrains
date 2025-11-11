/**
 * Integration tests for PUT /api/wallet-topup-request/[id]/confirm-receipt
 * Task 0.7: Confirm receipt endpoint
 */

import { PUT as ConfirmReceipt } from "@/app/api/wallet-topup-request/[id]/confirm-receipt/route"
import { POST as CreateRequest } from "@/app/api/wallet-topup-request/route"
import { PUT as UpdateRequest } from "@/app/api/wallet-topup-request/[id]/route"
import { signToken } from "@/lib/auth"
import User from "@/lib/models/user"
import WalletRequest from "@/lib/models/walletRequest"
import {
  createAdminUser,
  createAppWallet,
  createFieldAgentUser,
} from "@/test/factories"
import { NextRequest } from "next/server"

describe("PUT /api/wallet-topup-request/[id]/confirm-receipt - Task 0.7 Confirm Receipt Tests", () => {
  describe("✅ TEST 1: User confirms approved request", () => {
    it("should update status from approved to successful", async () => {
      // Setup: Create user, admin, app wallet
      const regularUser = await createFieldAgentUser({ walletBalance: 0 })
      const adminUser = await createAdminUser()
      await createAppWallet(1000)

      // Step 1: Regular user creates request
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
            reason: "Test confirm receipt",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Verify wallet balance is still 0 before approval
      const userBeforeApproval = await User.findById(regularUser._id)
      expect(userBeforeApproval?.walletBalance).toBe(0)

      // Step 2: Admin approves the request
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
      await UpdateRequest(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Step 3: User confirms receipt
      const confirmToken = signToken({
        id: regularUser._id.toString(),
        phone_number: regularUser.phone_number,
      })
      const confirmReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}/confirm-receipt`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${confirmToken}`,
          },
        },
      )
      const confirmResponse = await ConfirmReceipt(confirmReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: 200 OK
      expect(confirmResponse.status).toBe(200)
      const confirmData = await confirmResponse.json()
      expect(confirmData.walletRequest.status).toBe("successful")
      expect(confirmData.walletRequest.confirmed_at).toBeDefined()

      // Verify in database
      const request = await WalletRequest.findById(requestId)
      expect(request?.status).toBe("successful")
      expect(request?.confirmed_at).toBeDefined()

      // Verify no wallet changes (already credited at approval)
      const user = await User.findById(regularUser._id)
      expect(user?.walletBalance).toBe(100) // Already credited
    })
  })

  describe("✅ TEST 2: Confirm receipt is idempotent", () => {
    it("should return 200 when confirming already-successful request", async () => {
      // Setup
      const regularUser = await createFieldAgentUser({ walletBalance: 0 })
      const adminUser = await createAdminUser()
      await createAppWallet(1000)

      // Create and approve request
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
          body: JSON.stringify({ amount: 100, reason: "Test idempotent" }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Admin approves
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
      await UpdateRequest(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // First confirmation
      const confirmToken = signToken({
        id: regularUser._id.toString(),
        phone_number: regularUser.phone_number,
      })
      const confirmReq1 = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}/confirm-receipt`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${confirmToken}`,
          },
        },
      )
      const confirmResponse1 = await ConfirmReceipt(confirmReq1, {
        params: Promise.resolve({ id: requestId }),
      })
      expect(confirmResponse1.status).toBe(200)
      const data1 = await confirmResponse1.json()
      const firstConfirmedAt = data1.walletRequest.confirmed_at

      // Second confirmation (should be idempotent)
      const confirmReq2 = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}/confirm-receipt`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${confirmToken}`,
          },
        },
      )
      const confirmResponse2 = await ConfirmReceipt(confirmReq2, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: Still 200, status still successful
      expect(confirmResponse2.status).toBe(200)
      const data2 = await confirmResponse2.json()
      expect(data2.walletRequest.status).toBe("successful")
      expect(data2.walletRequest.confirmed_at).toBe(firstConfirmedAt) // Unchanged
    })
  })

  describe("✅ TEST 3: Permission checks - only owner can confirm", () => {
    it("should return 403 when different user tries to confirm", async () => {
      // Setup: Two users
      const userA = await createFieldAgentUser({ walletBalance: 0 })
      const userB = await createFieldAgentUser({ walletBalance: 0 })
      const adminUser = await createAdminUser()
      await createAppWallet(1000)

      // User A creates and gets approved request
      const createToken = signToken({
        id: userA._id.toString(),
        phone_number: userA.phone_number,
      })
      const createReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${createToken}`,
          },
          body: JSON.stringify({ amount: 100, reason: "Test permission" }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Admin approves
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
      await UpdateRequest(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // User B tries to confirm User A's request
      const userBToken = signToken({
        id: userB._id.toString(),
        phone_number: userB.phone_number,
      })
      const confirmReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}/confirm-receipt`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userBToken}`,
          },
        },
      )
      const confirmResponse = await ConfirmReceipt(confirmReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: 403 Forbidden
      expect(confirmResponse.status).toBe(403)
      const errorData = await confirmResponse.json()
      expect(errorData.error).toContain("Unauthorized")

      // Verify status unchanged
      const request = await WalletRequest.findById(requestId)
      expect(request?.status).toBe("approved") // Not successful
    })
  })

  describe("✅ TEST 4: Status validation - must be approved", () => {
    it("should return 400 when confirming pending request", async () => {
      // Setup
      const regularUser = await createFieldAgentUser({ walletBalance: 0 })

      // Create pending request (not approved)
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
          body: JSON.stringify({ amount: 100, reason: "Test pending" }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Try to confirm without approval
      const confirmReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}/confirm-receipt`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${createToken}`,
          },
        },
      )
      const confirmResponse = await ConfirmReceipt(confirmReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: 400 error
      expect(confirmResponse.status).toBe(400)
      const errorData = await confirmResponse.json()
      expect(errorData.error).toContain("approved")

      // Verify status unchanged
      const request = await WalletRequest.findById(requestId)
      expect(request?.status).toBe("pending")
    })

    it("should return 400 when confirming declined request", async () => {
      // Setup
      const regularUser = await createFieldAgentUser({ walletBalance: 0 })
      const adminUser = await createAdminUser()

      // Create request
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
          body: JSON.stringify({ amount: 100, reason: "Test declined" }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Admin declines the request
      const adminToken = signToken({
        id: adminUser._id.toString(),
        phone_number: adminUser.phone_number,
      })
      const declineReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            status: "declined",
            rejectionReason: "Insufficient documentation",
          }),
        },
      )
      await UpdateRequest(declineReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Try to confirm declined request
      const confirmReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}/confirm-receipt`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${createToken}`,
          },
        },
      )
      const confirmResponse = await ConfirmReceipt(confirmReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: 400 error
      expect(confirmResponse.status).toBe(400)
      const errorData = await confirmResponse.json()
      expect(errorData.error).toContain("approved")

      // Verify status unchanged
      const request = await WalletRequest.findById(requestId)
      expect(request?.status).toBe("declined")
    })
  })
})

