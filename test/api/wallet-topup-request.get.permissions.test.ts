/**
 * Integration tests for wallet-topup-request GET endpoint - Role-based permissions (Task 0.9)
 */

import { NextRequest } from "next/server"
import { GET as GetRequests } from "@/app/api/wallet-topup-request/route"
import { POST as CreateRequest } from "@/app/api/wallet-topup-request/route"
import { signToken } from "@/lib/auth"
import {
  createFieldAgentUser,
  createAdminUser,
  createPaymasterUser,
  createAppWallet,
} from "../factories"
import User from "@/lib/models/user"
import WalletRequest from "@/lib/models/walletRequest"
import AppWallet from "@/lib/models/wallet"

describe("GET /api/wallet-topup-request - Task 0.9 Role-based Permissions", () => {
  beforeEach(async () => {
    // Clean up
    await User.deleteMany({})
    await WalletRequest.deleteMany({})
    await AppWallet.deleteMany({})
  })

  describe("✅ TEST 1: Admin sees ALL requests", () => {
    it("should return all wallet requests when called by admin", async () => {
      // Arrange: Create users
      const admin = await createAdminUser()
      const user1 = await createFieldAgentUser()
      const user2 = await createFieldAgentUser()

      // Create requests from different users
      const adminToken = signToken({
        id: admin._id.toString(),
        phone_number: admin.phone_number,
      })
      const user1Token = signToken({
        id: user1._id.toString(),
        phone_number: user1.phone_number,
      })
      const user2Token = signToken({
        id: user2._id.toString(),
        phone_number: user2.phone_number,
      })

      // User 1 creates a request
      const createReq1 = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user1Token}`,
          },
          body: JSON.stringify({
            amount: 100,
            reason: "User 1 request",
          }),
        },
      )
      await CreateRequest(createReq1)

      // User 2 creates a request
      const createReq2 = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user2Token}`,
          },
          body: JSON.stringify({
            amount: 200,
            reason: "User 2 request",
          }),
        },
      )
      await CreateRequest(createReq2)

      // Admin creates a request
      const createReq3 = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            amount: 300,
            reason: "Admin request",
          }),
        },
      )
      await CreateRequest(createReq3)

      // Act: Admin calls GET endpoint
      const getReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      )
      const response = await GetRequests(getReq)

      // Assert: Admin should see all 3 requests
      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData.data).toBeDefined()
      expect(responseData.pagination).toBeDefined()
      expect(Array.isArray(responseData.data)).toBe(true)
      expect(responseData.data.length).toBe(3)
      expect(responseData.pagination.totalCount).toBe(3)

      // Verify requests from all users are included
      const amounts = responseData.data
        .map((req: any) => req.amount)
        .sort((a: number, b: number) => a - b)
      expect(amounts).toEqual([100, 200, 300])
    })
  })

  describe("✅ TEST 2: Paymaster sees ALL requests", () => {
    it("should return all wallet requests when called by paymaster", async () => {
      // Arrange: Create users
      const paymaster = await createPaymasterUser()
      const user1 = await createFieldAgentUser()
      const user2 = await createFieldAgentUser()

      // Create wallet for paymaster auto-approval
      await createAppWallet(1000)

      // Create requests from different users
      const paymasterToken = signToken({
        id: paymaster._id.toString(),
        phone_number: paymaster.phone_number,
      })
      const user1Token = signToken({
        id: user1._id.toString(),
        phone_number: user1.phone_number,
      })
      const user2Token = signToken({
        id: user2._id.toString(),
        phone_number: user2.phone_number,
      })

      // User 1 creates a request
      const createReq1 = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user1Token}`,
          },
          body: JSON.stringify({
            amount: 50,
            reason: "User 1 request",
          }),
        },
      )
      await CreateRequest(createReq1)

      // User 2 creates a request
      const createReq2 = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user2Token}`,
          },
          body: JSON.stringify({
            amount: 75,
            reason: "User 2 request",
          }),
        },
      )
      await CreateRequest(createReq2)

      // Act: Paymaster calls GET endpoint
      const getReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paymasterToken}`,
          },
        },
      )
      const response = await GetRequests(getReq)

      // Assert: Paymaster should see all requests
      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData.data).toBeDefined()
      expect(responseData.pagination).toBeDefined()
      expect(Array.isArray(responseData.data)).toBe(true)
      expect(responseData.data.length).toBeGreaterThanOrEqual(2) // At least user1 and user2 requests
      expect(responseData.pagination.totalCount).toBeGreaterThanOrEqual(2)
    })
  })

  describe("✅ TEST 3: Regular user sees ONLY their own requests", () => {
    it("should return only the authenticated user's requests for regular users", async () => {
      // Arrange: Create users
      const user1 = await createFieldAgentUser()
      const user2 = await createFieldAgentUser()

      const user1Token = signToken({
        id: user1._id.toString(),
        phone_number: user1.phone_number,
      })
      const user2Token = signToken({
        id: user2._id.toString(),
        phone_number: user2.phone_number,
      })

      // User 1 creates 2 requests
      for (let requestCount = 0; requestCount < 2; requestCount++) {
        const createReq = new NextRequest(
          "http://localhost:3000/api/wallet-topup-request",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user1Token}`,
            },
            body: JSON.stringify({
              amount: 100 + requestCount * 10,
              reason: `User 1 request ${requestCount + 1}`,
            }),
          },
        )
        await CreateRequest(createReq)
      }

      // User 2 creates 1 request
      const createReq2 = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user2Token}`,
          },
          body: JSON.stringify({
            amount: 200,
            reason: "User 2 request",
          }),
        },
      )
      await CreateRequest(createReq2)

      // Act: User 1 calls GET endpoint
      const getReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user1Token}`,
          },
        },
      )
      const response = await GetRequests(getReq)

      // Assert: User 1 should only see their own 2 requests
      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData.data).toBeDefined()
      expect(responseData.pagination).toBeDefined()
      expect(Array.isArray(responseData.data)).toBe(true)
      expect(responseData.data.length).toBe(2)
      expect(responseData.pagination.totalCount).toBe(2)

      // All requests should belong to user1
      responseData.data.forEach((req: { user: string }) => {
        expect(req.user).toBe(user1._id.toString())
      })

      // Amounts should be user1's requests only
      const amounts = responseData.data
        .map((req: { amount: number }) => req.amount)
        .sort((a: number, b: number) => a - b)
      expect(amounts).toEqual([100, 110])
    })
  })

  describe("✅ TEST 4: Regular user cannot see other user's requests", () => {
    it("should not return other users' requests to regular users", async () => {
      // Arrange: Create users
      const user1 = await createFieldAgentUser()
      const user2 = await createFieldAgentUser()

      const user1Token = signToken({
        id: user1._id.toString(),
        phone_number: user1.phone_number,
      })
      const user2Token = signToken({
        id: user2._id.toString(),
        phone_number: user2.phone_number,
      })

      // User 2 creates a request
      const createReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user2Token}`,
          },
          body: JSON.stringify({
            amount: 500,
            reason: "User 2 secret request",
          }),
        },
      )
      await CreateRequest(createReq)

      // Act: User 1 calls GET endpoint
      const getReq = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user1Token}`,
          },
        },
      )
      const response = await GetRequests(getReq)

      // Assert: User 1 should see empty list (no requests)
      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData.data).toBeDefined()
      expect(responseData.pagination).toBeDefined()
      expect(Array.isArray(responseData.data)).toBe(true)
      expect(responseData.data.length).toBe(0)
      expect(responseData.pagination.totalCount).toBe(0)

      // Verify user2's request is not in the response
      const hasUser2Request = responseData.data.some(
        (req: { user: string }) => req.user === user2._id.toString(),
      )
      expect(hasUser2Request).toBe(false)
    })
  })
})

