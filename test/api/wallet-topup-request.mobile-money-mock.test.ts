/**
 * Test suite for mobile_money mock implementation (Task 0.15)
 *
 * Verifies that mobile_money payments are mocked in development/preview environments
 * without external API calls. In production, actual MTN mobile_money API should be called
 * (to be implemented in Phase 2).
 *
 * Environment behavior:
 * - Development/Preview: Mock processing (no external API calls)
 * - Production: Actual MTN mobile_money API (Phase 2 implementation)
 */

import { NextRequest } from "next/server"
import { POST as CreateRequest } from "@/app/api/wallet-topup-request/route"
import { PUT } from "@/app/api/wallet-topup-request/[id]/route"
import { signToken } from "@/lib/auth"
import {
  createAdminUser,
  createFieldAgentUser,
  createAppWallet,
} from "../factories"
import User from "@/lib/models/user"
import WalletRequest from "@/lib/models/walletRequest"
import Wallet from "@/lib/models/wallet"
import logger from "@/lib/utils/logger"

describe("mobile_money Mock - Task 0.15", () => {
  let loggerInfoSpy: jest.SpyInstance
  let loggerWarnSpy: jest.SpyInstance

  beforeEach(async () => {
    await User.deleteMany({})
    await WalletRequest.deleteMany({})
    await Wallet.deleteMany({})

    // Spy on logger methods to verify logging
    loggerInfoSpy = jest.spyOn(logger, "info").mockImplementation()
    loggerWarnSpy = jest.spyOn(logger, "warn").mockImplementation()
  })

  afterEach(() => {
    loggerInfoSpy.mockRestore()
    loggerWarnSpy.mockRestore()
  })

  it("should successfully process mobile_money payment without external API call", async () => {
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
          amount: 100,
          reason: "mobile_money mock test",
        }),
      },
    )
    const createResponse = await CreateRequest(createReq)
    const createData = await createResponse.json()
    const requestId = createData.walletRequest._id

    // Approve with mobile_money - this should trigger the mock
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

    // Assert: Approval should succeed
    expect(approveResponse.status).toBe(200)
    const approveData = await approveResponse.json()
    expect(approveData.status).toBe("approved")
    expect(approveData.payment_method).toBe("mobile_money")
  })

  it("should log mobile_money mock processing with correct details", async () => {
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
          amount: 150,
          reason: "Test logging",
        }),
      },
    )
    const createResponse = await CreateRequest(createReq)
    const createData = await createResponse.json()
    const requestId = createData.walletRequest._id

    // Approve with mobile_money
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
          phone_number: "+233509876543",
        }),
      },
    )
    await PUT(approveReq, {
      params: Promise.resolve({ id: requestId }),
    })

    // Assert: Verify logging occurred with logger.info (dev/preview environment)
    expect(loggerInfoSpy).toHaveBeenCalledWith(
      "mobile_money payment processed (mock)",
      expect.objectContaining({
        requestId: requestId,
        paymentMethod: "mobile_money",
        provider: "MTN",
        phoneNumber: "+233509876543",
        amount: 150,
        status: "success",
        environment: expect.any(String),
        note: expect.stringContaining("Mock payment - no external API call"),
      }),
    )
  })

  /**
   * This test checks for external API calls by filtering fetch calls.
   * Note: This only detects calls made using the global fetch API.
   * If the implementation uses other HTTP clients (e.g., axios, node-fetch, native http/https modules),
   * those calls will not be detected by this test. Consider mocking those libraries as well if used,
   * or update the implementation to use fetch for all outbound HTTP requests.
   */
  it("should not make any external API calls during mobile_money processing", async () => {
    const regularUser = await createFieldAgentUser()
    const adminUser = await createAdminUser()
    await createAppWallet(1000)

    // Mock fetch to detect any external API calls
    const fetchSpy = jest.spyOn(global, "fetch")

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
        body: JSON.stringify({
          amount: 200,
          reason: "No API call test",
        }),
      },
    )
    const createResponse = await CreateRequest(createReq)
    const createData = await createResponse.json()
    const requestId = createData.walletRequest._id

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
          phone_number: "+233500000001",
        }),
      },
    )
    await PUT(approveReq, {
      params: Promise.resolve({ id: requestId }),
    })

    // Assert: No external API calls were made
    // Note: This checks that fetch was not called with external URLs
    // (Some internal Firebase/database calls might use fetch, but we're
    // specifically checking that no MTN mobile_money API was called)
    const externalCalls = fetchSpy.mock.calls.filter((call) => {
      const url = call[0]?.toString() || ""
      // Check for external payment provider URLs
      return (
        url.includes("mtn") ||
        url.includes("mobile-money") ||
        url.includes("payment-gateway")
      )
    })
    expect(externalCalls).toHaveLength(0)

    fetchSpy.mockRestore()
  })

  it("should handle mobile_money for different providers", async () => {
    const regularUser = await createFieldAgentUser()
    const adminUser = await createAdminUser()
    await createAppWallet(2000)

    const providers = ["MTN", "Vodafone", "AirtelTigo"]

    for (const provider of providers) {
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
          body: JSON.stringify({
            amount: 50,
            reason: `Test ${provider}`,
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Approve with provider
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
            provider: provider,
            phone_number: "+233501234567",
          }),
        },
      )
      const approveResponse = await PUT(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // Assert: All providers should work (mocked)
      expect(approveResponse.status).toBe(200)
      const data = await approveResponse.json()
      expect(data.provider).toBe(provider)
      expect(data.status).toBe("approved")
    }

    // Verify all 3 logged with logger.info
    const mobileLogCalls = loggerInfoSpy.mock.calls.filter((call) =>
      call[0]?.includes("mobile_money payment processed (mock)"),
    )
    expect(mobileLogCalls.length).toBeGreaterThanOrEqual(3)
  })

  it("should use mock in development/test environments", async () => {
    // Verify we're in test/development mode
    expect(process.env.NODE_ENV).not.toBe("production")

    const regularUser = await createFieldAgentUser()
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
        body: JSON.stringify({
          amount: 75,
          reason: "Environment test",
        }),
      },
    )
    const createResponse = await CreateRequest(createReq)
    const createData = await createResponse.json()
    const requestId = createData.walletRequest._id

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
          phone_number: "+233501111111",
        }),
      },
    )
    await PUT(approveReq, {
      params: Promise.resolve({ id: requestId }),
    })

    // Verify mock logging was used (not production)
    const mockLogCalls = loggerInfoSpy.mock.calls.filter((call) =>
      call[0]?.includes("mobile_money payment processed (mock)"),
    )
    expect(mockLogCalls.length).toBeGreaterThan(0)

    // Verify the log includes environment info
    const lastMockLog = mockLogCalls[mockLogCalls.length - 1]
    expect(lastMockLog[1]).toMatchObject({
      environment: expect.any(String),
      note: expect.stringContaining("Mock payment"),
    })
  })

  it("should indicate production API requirement in production environment", async () => {
    // Temporarily set production environment
    const originalEnv = process.env.NODE_ENV
    jest.replaceProperty(process.env, "NODE_ENV", "production")

    const regularUser = await createFieldAgentUser()
    const adminUser = await createAdminUser()
    await createAppWallet(1000)

    try {
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
          body: JSON.stringify({
            amount: 125,
            reason: "Production env test",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Approve with mobile_money
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
            phone_number: "+233502222222",
          }),
        },
      )
      const approveResponse = await PUT(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })

      // In production, mobile_money approval should be blocked until Phase 2
      expect(approveResponse.status).toBe(501)
      const errorData = await approveResponse.json()
      expect(errorData.error).toContain(
        "mobile_money top-up approval is not supported in production",
      )

      // Verify production warning logging was used (not mock)
      const productionWarnCalls = loggerWarnSpy.mock.calls.filter(
        (call) =>
          call[0] ===
            "Production mobile_money approval blocked - MTN API not yet integrated" &&
          call[1]?.note?.includes("Production environment") &&
          call[1]?.note?.includes("MTN mobile_money API"),
      )
      expect(productionWarnCalls.length).toBeGreaterThan(0)

      // Check the log object for expected fields
      const lastProductionLog =
        productionWarnCalls[productionWarnCalls.length - 1]
      expect(lastProductionLog[1]).toMatchObject({
        requestId: expect.any(String),
        paymentMethod: "mobile_money",
        provider: "MTN",
        phoneNumber: "+233502222222",
        amount: 125,
        note: expect.stringContaining("Production environment"),
      })
      expect(lastProductionLog[1].note).toContain("MTN mobile_money API")
    } finally {
      // Restore original environment
      jest.replaceProperty(process.env, "NODE_ENV", originalEnv)
    }
  })
})

