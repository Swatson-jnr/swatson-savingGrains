/**
 * Phase 0b: Query Parameter Validation Tests
 * Tests for GET /api/wallet-topup-request query parameter validation using Zod
 */

import { NextRequest } from "next/server"
import { GET } from "@/app/api/wallet-topup-request/route"
import { createAdminUser } from "../factories"
import { signToken } from "@/lib/auth"

describe("Phase 0b: Query Parameter Validation", () => {
  let adminToken: string

  // Setup: Create admin user and token before each test (database is cleaned between tests)
  beforeEach(async () => {
    const admin = await createAdminUser()
    adminToken = signToken({
      id: admin._id.toString(),
      phone_number: "+233501234567",
    })
  })

  /**
   * Helper function to create authenticated GET request
   * @param queryString - Query parameters to append to URL (e.g., "?page=1&limit=10")
   */
  const createAuthenticatedRequest = (queryString = "") => {
    return new NextRequest(
      `http://localhost:3000/api/wallet-topup-request${queryString}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    )
  }

  describe("Pagination Parameters", () => {
    it("should accept valid page and limit", async () => {
      const request = createAuthenticatedRequest("?page=2&limit=20")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination).toBeDefined()
      expect(data.pagination.page).toBe(2)
      expect(data.pagination.limit).toBe(20)
    })

    it("should reject page=0 (must be positive)", async () => {
      const request = createAuthenticatedRequest("?page=0")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/Page must be a positive integer/i)
    })

    it("should reject negative page", async () => {
      const request = createAuthenticatedRequest("?page=-1")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/Page must be a positive integer/i)
    })

    it("should reject limit exceeding 100", async () => {
      const request = createAuthenticatedRequest("?limit=101")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/Limit cannot exceed 100/i)
    })

    it("should reject non-numeric page value", async () => {
      const request = createAuthenticatedRequest("?page=abc")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/Page must be a valid number/i)
    })

    it("should reject non-numeric limit value", async () => {
      const request = createAuthenticatedRequest("?limit=xyz")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/Limit must be a valid number/i)
    })

    it("should use default values when page/limit not provided", async () => {
      const request = createAuthenticatedRequest("")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBe(10)
    })
  })

  describe("Sort Parameters", () => {
    it("should accept valid sortBy=createdAt", async () => {
      const request = createAuthenticatedRequest("?sortBy=createdAt")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should accept valid sortBy=amount", async () => {
      const request = createAuthenticatedRequest("?sortBy=amount")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should reject invalid sortBy value", async () => {
      const request = createAuthenticatedRequest("?sortBy=invalidField")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })

    it("should accept sortOrder=asc", async () => {
      const request = createAuthenticatedRequest("?sortOrder=asc")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should accept sortOrder=desc", async () => {
      const request = createAuthenticatedRequest("?sortOrder=desc")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should reject invalid sortOrder", async () => {
      const request = createAuthenticatedRequest("?sortOrder=invalid")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })
  })

  describe("Status Filter", () => {
    it("should accept valid status=pending", async () => {
      const request = createAuthenticatedRequest("?status=pending")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should accept all valid status values", async () => {
      const statuses = ["pending", "approved", "declined", "successful"]

      for (const status of statuses) {
        const request = createAuthenticatedRequest(`?status=${status}`)
        const response = await GET(request)
        expect(response.status).toBe(200)
      }
    })

    it("should reject invalid status value", async () => {
      const request = createAuthenticatedRequest("?status=invalid")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })

    it("should accept title case status value (case-insensitive)", async () => {
      const request = createAuthenticatedRequest("?status=Pending")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should accept mixed case status value", async () => {
      const request = createAuthenticatedRequest("?status=APPROVED")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })
  })

  describe("Date Range Filters", () => {
    it("should accept valid fromDate", async () => {
      const request = createAuthenticatedRequest("?fromDate=2025-01-01")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should accept valid toDate", async () => {
      const request = createAuthenticatedRequest("?toDate=2025-12-31")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should accept valid date range", async () => {
      const request = createAuthenticatedRequest(
        "?fromDate=2025-01-01&toDate=2025-12-31",
      )

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should reject invalid fromDate format", async () => {
      const request = createAuthenticatedRequest("?fromDate=invalid-date")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/Invalid fromDate format/i)
    })

    it("should reject invalid toDate format", async () => {
      const request = createAuthenticatedRequest("?toDate=invalid-date")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/Invalid toDate format/i)
    })

    it("should reject fromDate > toDate", async () => {
      const request = createAuthenticatedRequest(
        "?fromDate=2025-12-31&toDate=2025-01-01",
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/fromDate cannot be greater than toDate/i)
    })
  })

  describe("User Type Filter", () => {
    it("should accept userType=myself", async () => {
      const request = createAuthenticatedRequest("?userType=myself")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should accept userType=all", async () => {
      const request = createAuthenticatedRequest("?userType=all")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should accept userType=field-agents", async () => {
      const request = createAuthenticatedRequest("?userType=field-agents")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should reject invalid userType", async () => {
      const request = createAuthenticatedRequest("?userType=invalid")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })
  })

  describe("Payment Method Filter", () => {
    it("should accept valid paymentMethod", async () => {
      const request = createAuthenticatedRequest("?paymentMethod=Cash")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it("should accept payment method with partial match", async () => {
      const request = createAuthenticatedRequest("?paymentMethod=Mobile")

      const response = await GET(request)

      expect(response.status).toBe(200)
    })
  })

  describe("Strict Mode - Reject Unknown Parameters", () => {
    it("should reject unknown query parameters", async () => {
      const request = createAuthenticatedRequest("?unknownParam=value")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })

    it("should reject extra parameters alongside valid ones", async () => {
      const request = createAuthenticatedRequest("?page=1&extraParam=value")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })
  })

  describe("Multiple Validation Errors", () => {
    it("should return 'Validation failed' with details for multiple errors", async () => {
      const request = createAuthenticatedRequest(
        "?page=-1&limit=200&status=invalid",
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(data.details).toBeDefined()
      expect(Array.isArray(data.details)).toBe(true)
      expect(data.details.length).toBeGreaterThan(1)
    })
  })
})

