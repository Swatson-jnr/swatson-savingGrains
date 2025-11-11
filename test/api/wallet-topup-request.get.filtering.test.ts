/**
 * Test suite for wallet-topup-request GET endpoint filtering capabilities (Task 0.14)
 */

import { NextRequest } from "next/server"
import { GET } from "@/app/api/wallet-topup-request/route"
import { signToken } from "@/lib/auth"
import {
  createAdminUser,
  createTestUser,
  createFieldAgentUser,
} from "../factories"
import User from "@/lib/models/user"
import WalletRequest from "@/lib/models/walletRequest"
import { WalletRequestStatus } from "@/lib/models/walletRequest"

describe("GET /api/wallet-topup-request - Filtering (Task 0.14)", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await WalletRequest.deleteMany({})
  })

  it("should return paginated results (page 1, limit 10)", async () => {
    const admin = await createAdminUser()
    const requests = []
    for (let i = 0; i < 15; i++) {
      requests.push({
        user: admin._id,
        amount: 100 + i,
        payment_method: "cash",
        status: WalletRequestStatus.PENDING,
      })
    }
    await WalletRequest.insertMany(requests)
    const token = signToken({
      id: admin._id.toString(),
      phone_number: admin.phone_number,
    })
    const request = new NextRequest(
      "http://localhost/api/wallet-topup-request",
      { headers: { authorization: `Bearer ${token}` } },
    )
    const response = await GET(request)
    expect(response.status).toBe(200)
    const responseData = await response.json()
    expect(responseData.data).toHaveLength(10)
    expect(responseData.pagination.totalCount).toBe(15)
    expect(responseData.pagination.totalPages).toBe(2)
  })

  it("should filter by pending status", async () => {
    const admin = await createAdminUser()
    await WalletRequest.insertMany([
      {
        user: admin._id,
        amount: 100,
        payment_method: "cash",
        status: WalletRequestStatus.PENDING,
      },
      {
        user: admin._id,
        amount: 200,
        payment_method: "cash",
        status: WalletRequestStatus.APPROVED,
      },
      {
        user: admin._id,
        amount: 300,
        payment_method: "cash",
        status: WalletRequestStatus.PENDING,
      },
    ])
    const token = signToken({
      id: admin._id.toString(),
      phone_number: admin.phone_number,
    })
    const request = new NextRequest(
      "http://localhost/api/wallet-topup-request?status=pending",
      { headers: { authorization: `Bearer ${token}` } },
    )
    const response = await GET(request)
    expect(response.status).toBe(200)
    const responseData = await response.json()
    expect(responseData.data).toHaveLength(2)
    expect(responseData.pagination.totalCount).toBe(2)
  })

  it("should return 400 for invalid status", async () => {
    const admin = await createAdminUser()
    const token = signToken({
      id: admin._id.toString(),
      phone_number: admin.phone_number,
    })
    const request = new NextRequest(
      "http://localhost/api/wallet-topup-request?status=invalid",
      { headers: { authorization: `Bearer ${token}` } },
    )
    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it("should filter by date range", async () => {
    const admin = await createAdminUser()
    await WalletRequest.insertMany([
      {
        user: admin._id,
        amount: 100,
        payment_method: "cash",
        status: WalletRequestStatus.PENDING,
        createdAt: new Date("2025-01-05"),
      },
      {
        user: admin._id,
        amount: 200,
        payment_method: "cash",
        status: WalletRequestStatus.PENDING,
        createdAt: new Date("2025-01-15"),
      },
      {
        user: admin._id,
        amount: 300,
        payment_method: "cash",
        status: WalletRequestStatus.PENDING,
        createdAt: new Date("2025-01-25"),
      },
    ])
    const token = signToken({
      id: admin._id.toString(),
      phone_number: admin.phone_number,
    })
    const request = new NextRequest(
      "http://localhost/api/wallet-topup-request?fromDate=2025-01-10&toDate=2025-01-20",
      { headers: { authorization: `Bearer ${token}` } },
    )
    const response = await GET(request)
    expect(response.status).toBe(200)
    const responseData = await response.json()
    expect(responseData.data).toHaveLength(1)
    expect(responseData.data[0].amount).toBe(200)
  })

  it("should filter field-agent requests", async () => {
    const admin = await createAdminUser()
    const agent1 = await createFieldAgentUser()
    const agent2 = await createFieldAgentUser()
    const stockManager = await createTestUser({ roles: ["stock-manager"] })
    const accountManager = await createTestUser({ roles: ["account-manager"] })

    await WalletRequest.insertMany([
      {
        user: admin._id,
        amount: 100,
        payment_method: "cash",
        status: WalletRequestStatus.PENDING,
      },
      {
        user: agent1._id,
        amount: 200,
        payment_method: "cash",
        status: WalletRequestStatus.PENDING,
      },
      {
        user: agent2._id,
        amount: 300,
        payment_method: "cash",
        status: WalletRequestStatus.PENDING,
      },
      {
        user: stockManager._id,
        amount: 400,
        payment_method: "cash",
        status: WalletRequestStatus.PENDING,
      },
      {
        user: accountManager._id,
        amount: 500,
        payment_method: "cash",
        status: WalletRequestStatus.PENDING,
      },
    ])

    const token = signToken({
      id: admin._id.toString(),
      phone_number: admin.phone_number,
    })
    const request = new NextRequest(
      "http://localhost/api/wallet-topup-request?userType=field-agents",
      { headers: { authorization: `Bearer ${token}` } },
    )
    const response = await GET(request)
    expect(response.status).toBe(200)

    const responseData = await response.json()
    expect(responseData.data).toHaveLength(2)
    expect(responseData.pagination.totalCount).toBe(2)

    // Verify only field-agent requests are returned (amounts 200 and 300)
    const amounts = responseData.data
      .map((r: { amount: number }) => r.amount)
      .sort()
    expect(amounts).toEqual([200, 300])
  })

  it("should combine multiple filters", async () => {
    const admin = await createAdminUser()
    await WalletRequest.insertMany([
      {
        user: admin._id,
        amount: 100,
        payment_method: "cash",
        status: WalletRequestStatus.PENDING,
        createdAt: new Date("2025-01-10"),
      },
      {
        user: admin._id,
        amount: 200,
        payment_method: "mobile_money",
        status: WalletRequestStatus.PENDING,
        createdAt: new Date("2025-01-15"),
      },
      {
        user: admin._id,
        amount: 300,
        payment_method: "mobile_money",
        status: WalletRequestStatus.APPROVED,
        createdAt: new Date("2025-01-20"),
      },
    ])
    const token = signToken({
      id: admin._id.toString(),
      phone_number: admin.phone_number,
    })
    const request = new NextRequest(
      "http://localhost/api/wallet-topup-request?status=pending&paymentMethod=mobile&fromDate=2025-01-12&toDate=2025-01-18",
      { headers: { authorization: `Bearer ${token}` } },
    )
    const response = await GET(request)
    expect(response.status).toBe(200)
    const responseData = await response.json()
    expect(responseData.data).toHaveLength(1)
    const result = responseData.data[0]
    expect(result.amount).toBe(200)
    expect(result.status).toBe("pending")
    expect(result.paymentType).toContain("mobile")
  })
})

