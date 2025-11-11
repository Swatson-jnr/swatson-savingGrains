/**
 * Integration tests for PUT /api/wallet-topup-request/[id]
 * Task 0.9: Decline permissions and status immutability checks
 */

import { PUT } from "@/app/api/wallet-topup-request/[id]/route"
import { POST as CreateRequest } from "@/app/api/wallet-topup-request/route"
import { signToken } from "@/lib/auth"
import User from "@/lib/models/user"
import WalletRequest, { WalletRequestStatus } from "@/lib/models/walletRequest"
import {
  createAdminUser,
  createAppWallet,
  createFieldAgentUser,
} from "@/test/factories"
import { NextRequest } from "next/server"

describe("PUT /api/wallet-topup-request/[id] - Task 0.9 Permissions & Immutability", () => {
  describe("TEST 1: Regular user cannot decline requests", () => {
    it("should return 403 when regular user tries to decline a request", async () => {
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
            reason: "Test decline permission",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      expect(createResponse.status).toBe(201)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Try to decline own request
      const declineReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "declined",
            rejectionReason: "Test decline",
          }),
        },
      )
      const declineResponse = await PUT(declineReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: 403 Forbidden
      expect(declineResponse.status).toBe(403)
      const errorData = await declineResponse.json()
      expect(errorData.error).toContain("Forbidden")

      // Assert: Status still pending
      const request = await WalletRequest.findById(requestId)
      expect(request?.status).toBe(WalletRequestStatus.PENDING)
    })
  })

  describe("TEST 2: Status immutability - Cannot change successful status", () => {
    it("should return 400 when trying to change a successful request", async () => {
      const regularUser = await createFieldAgentUser({
        walletBalance: 0,
      })
      const adminUser = await createAdminUser()
      await createAppWallet(1000)

      // Create and approve request (auto-approve as admin)
      const adminToken = signToken({
        id: adminUser._id.toString(),
        phone_number: adminUser.phone_number,
      })
      const createReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            amount: 100,
            reason: "Test successful immutability",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      expect(createResponse.status).toBe(201)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Manually set status to successful (simulating confirm receipt)
      await WalletRequest.findByIdAndUpdate(requestId, {
        status: WalletRequestStatus.SUCCESSFUL,
      })

      // Admin tries to change successful request to declined
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
            rejectionReason: "Changing mind",
          }),
        },
      )
      const declineResponse = await PUT(declineReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: 400 Bad Request
      expect(declineResponse.status).toBe(400)
      const errorData = await declineResponse.json()
      expect(errorData.error).toContain("successful")
      expect(errorData.error).toContain("immutable")

      // Assert: Status still successful
      const request = await WalletRequest.findById(requestId)
      expect(request?.status).toBe(WalletRequestStatus.SUCCESSFUL)
    })

    it("should return 400 when admin tries to re-approve a successful request", async () => {
      const regularUser = await createFieldAgentUser({
        walletBalance: 0,
      })
      const adminUser = await createAdminUser()
      await createAppWallet(1000)

      // Regular user creates request
      const userToken = signToken({
        id: regularUser._id.toString(),
        phone_number: regularUser.phone_number,
      })
      const createReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            amount: 50,
            reason: "Test successful immutability 2",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      expect(createResponse.status).toBe(201)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Admin approves
      const adminToken = signToken({
        id: adminUser._id.toString(),
        phone_number: adminUser.phone_number,
      })
      const approveReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
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
      expect(approveResponse.status).toBe(200)

      // User confirms receipt (set to successful)
      await WalletRequest.findByIdAndUpdate(requestId, {
        status: WalletRequestStatus.SUCCESSFUL,
      })

      // Admin tries to re-approve successful request
      const reApproveReq = new NextRequest(
        `http://localhost:3000/api/wallet-topup-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            status: "approved",
            payment_method: "mobile_money",
            provider: "MTN",
            phone_number: "+233501234567",
          }),
        },
      )
      const reApproveResponse = await PUT(reApproveReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: 400 Bad Request
      expect(reApproveResponse.status).toBe(400)
      const errorData = await reApproveResponse.json()
      expect(errorData.error).toContain("successful")
      expect(errorData.error).toContain("immutable")

      // Assert: Status still successful
      const request = await WalletRequest.findById(requestId)
      expect(request?.status).toBe(WalletRequestStatus.SUCCESSFUL)

      // Assert: Wallet balances not changed again
      const user = await User.findById(regularUser._id)
      expect(user?.walletBalance).toBe(50) // Only credited once
    })
  })

  describe("TEST 3: Admin and Paymaster can decline requests", () => {
    it("should allow admin to decline a pending request", async () => {
      const regularUser = await createFieldAgentUser()
      const adminUser = await createAdminUser()
      await createAppWallet(1000)

      // Regular user creates request
      const userToken = signToken({
        id: regularUser._id.toString(),
        phone_number: regularUser.phone_number,
      })
      const createReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            amount: 100,
            reason: "Test admin decline",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      expect(createResponse.status).toBe(201)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Admin declines
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
            rejectionReason: "Invalid request",
          }),
        },
      )
      const declineResponse = await PUT(declineReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: 200 OK
      expect(declineResponse.status).toBe(200)
      const responseData = await declineResponse.json()
      expect(responseData.status).toBe("declined")
      expect(responseData.rejectionReason).toBe("Invalid request")

      // Assert: Status updated in database
      const request = await WalletRequest.findById(requestId)
      expect(request?.status).toBe(WalletRequestStatus.DECLINED)
      expect(request?.rejectionReason).toBe("Invalid request")
    })
  })
})

