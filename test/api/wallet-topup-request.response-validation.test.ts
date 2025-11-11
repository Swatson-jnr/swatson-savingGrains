/**
 * Response Validation Tests for Wallet Top-up Request API
 *
 * These tests verify that the validateResponseData middleware correctly validates
 * API responses before sending them to clients. This ensures data integrity and
 * catches issues where the database returns unexpected data.
 */

import { describe, it, expect } from "@jest/globals"
import { NextResponse } from "next/server"
import { validateResponseData } from "../../lib/middleware/validateSchema"
import {
  WalletRequestResponseSchema,
  TransformedWalletRequestSchema,
  PaginationSchema,
  ListWalletRequestsResponseSchema,
  SingleWalletRequestResponseSchema,
  ConfirmReceiptResponseSchema,
} from "../../lib/schemas/wallet-response.schemas"

describe("Response Validation Middleware", () => {
  describe("WalletRequestResponseSchema - Raw Database Documents", () => {
    it("should validate valid wallet request document", () => {
      const validDoc = {
        _id: "507f1f77bcf86cd799439011",
        user: "507f1f77bcf86cd799439012",
        amount: 100,
        payment_method: "mobile_money",
        provider: "MTN",
        phone_number: "0712345678",
        reason: "Business supplies",
        status: "pending",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      }

      const result = validateResponseData(
        validDoc,
        WalletRequestResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data._id).toBe("507f1f77bcf86cd799439011")
        expect(result.data.user).toBe("507f1f77bcf86cd799439012")
        expect(result.data.amount).toBe(100)
        expect(result.data.status).toBe("pending")
        expect(result.data.createdAt).toBe("2024-01-15T10:30:00.000Z")
      }
    })

    it("should transform ObjectId to string", () => {
      const docWithObjectId = {
        _id: { toString: () => "507f1f77bcf86cd799439011" },
        user: { toString: () => "507f1f77bcf86cd799439012" },
        amount: 100,
        payment_method: "mobile_money",
        provider: "MTN",
        phone_number: "0712345678",
        reason: "Business supplies",
        status: "pending",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      }

      const result = validateResponseData(
        docWithObjectId,
        WalletRequestResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(typeof result.data._id).toBe("string")
        expect(typeof result.data.user).toBe("string")
      }
    })

    it("should normalize status to lowercase", () => {
      const docWithUppercaseStatus = {
        _id: "507f1f77bcf86cd799439011",
        user: "507f1f77bcf86cd799439012",
        amount: 100,
        payment_method: "mobile_money",
        provider: "MTN",
        phone_number: "0712345678",
        reason: "Business supplies",
        status: "PENDING",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      }

      const result = validateResponseData(
        docWithUppercaseStatus,
        WalletRequestResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe("pending")
      }
    })

    it("should handle invalid ObjectId format", () => {
      const docWithInvalidObjectId = {
        _id: "invalid-objectid-format", // Not a valid 24-char hex string
        user: "not-valid-either",
        amount: 100,
        payment_method: "mobile_money",
        provider: "MTN",
        phone_number: "0712345678",
        reason: "Business supplies",
        status: "pending",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      }

      const result = validateResponseData(
        docWithInvalidObjectId,
        WalletRequestResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      // Schema transforms any value to string, so even invalid ObjectIds are accepted
      // This is by design - the schema is lenient to handle various ObjectId representations
      expect(result.success).toBe(true)
      if (result.success) {
        expect(typeof result.data._id).toBe("string")
        expect(result.data._id).toBe("invalid-objectid-format")
        expect(typeof result.data.user).toBe("string")
        expect(result.data.user).toBe("not-valid-either")
      }
    })

    it("should fail with negative amount", () => {
      const invalidDoc = {
        _id: "507f1f77bcf86cd799439011",
        user: "507f1f77bcf86cd799439012",
        amount: -100, // Invalid: negative
        payment_method: "mobile_money",
        provider: "MTN",
        phone_number: "0712345678",
        reason: "Business supplies",
        status: "pending",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      }

      const result = validateResponseData(
        invalidDoc,
        WalletRequestResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response).toBeInstanceOf(NextResponse)
        expect(result.response.status).toBe(500)
      }
    })

    it("should fail with invalid status", () => {
      const invalidDoc = {
        _id: "507f1f77bcf86cd799439011",
        user: "507f1f77bcf86cd799439012",
        amount: 100,
        payment_method: "mobile_money",
        provider: "MTN",
        phone_number: "0712345678",
        reason: "Business supplies",
        status: "invalid_status", // Invalid
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      }

      const result = validateResponseData(
        invalidDoc,
        WalletRequestResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response.status).toBe(500)
      }
    })

    it("should fail with missing required fields", () => {
      const invalidDoc = {
        _id: "507f1f77bcf86cd799439011",
        // Missing user, amount, status, etc.
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      }

      const result = validateResponseData(
        invalidDoc,
        WalletRequestResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response.status).toBe(500)
      }
    })
  })

  describe("TransformedWalletRequestSchema - Frontend Format", () => {
    it("should validate valid transformed request", () => {
      const validTransformed = {
        id: "507f1f77bcf86cd799439011",
        label: "#WTR-001",
        requestedDate: "2024-01-15T10:30:00.000Z",
        user: "507f1f77bcf86cd799439012",
        requesterName: "John Doe",
        amount: 100,
        status: "pending",
        currency: "UGX",
        paymentType: "mobile_money",
        reason: "Business supplies",
      }

      const result = validateResponseData(
        validTransformed,
        TransformedWalletRequestSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe("507f1f77bcf86cd799439011")
        expect(result.data.label).toBe("#WTR-001")
        expect(result.data.amount).toBe(100)
      }
    })

    it("should accept optional approvedDate field", () => {
      const transformedWithApproval = {
        id: "507f1f77bcf86cd799439011",
        label: "#WTR-001",
        requestedDate: "2024-01-15T10:30:00.000Z",
        user: "507f1f77bcf86cd799439012",
        requesterName: "John Doe",
        amount: 100,
        status: "approved",
        currency: "UGX",
        paymentType: "mobile_money",
        reason: "Business supplies",
        approvedDate: "2024-01-15T11:00:00.000Z",
      }

      const result = validateResponseData(
        transformedWithApproval,
        TransformedWalletRequestSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.approvedDate).toBe("2024-01-15T11:00:00.000Z")
      }
    })

    it("should fail with wrong field types", () => {
      const invalidTransformed = {
        id: 123, // Should be string
        label: "#WTR-001",
        requestedDate: "2024-01-15T10:30:00.000Z",
        user: "507f1f77bcf86cd799439012",
        requesterName: "John Doe",
        amount: "100", // Should be number
        status: "pending",
        currency: "UGX",
        paymentType: "mobile_money",
        reason: "Business supplies",
      }

      const result = validateResponseData(
        invalidTransformed,
        TransformedWalletRequestSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(false)
    })
  })

  describe("PaginationSchema", () => {
    it("should validate valid pagination object", () => {
      const validPagination = {
        page: 1,
        limit: 10,
        totalCount: 50,
        totalPages: 5,
        hasNextPage: true,
        hasPrevPage: false,
      }

      const result = validateResponseData(validPagination, PaginationSchema, {
        endpoint: "/test",
        method: "GET",
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.totalPages).toBe(5)
        expect(result.data.hasNextPage).toBe(true)
      }
    })

    it("should fail with negative page number", () => {
      const invalidPagination = {
        page: -1, // Invalid
        limit: 10,
        totalCount: 50,
        totalPages: 5,
        hasNextPage: true,
        hasPrevPage: false,
      }

      const result = validateResponseData(invalidPagination, PaginationSchema, {
        endpoint: "/test",
        method: "GET",
      })

      expect(result.success).toBe(false)
    })

    it("should fail with limit exceeding 100", () => {
      const invalidPagination = {
        page: 1,
        limit: 150, // Invalid: max 100
        totalCount: 50,
        totalPages: 5,
        hasNextPage: true,
        hasPrevPage: false,
      }

      const result = validateResponseData(invalidPagination, PaginationSchema, {
        endpoint: "/test",
        method: "GET",
      })

      expect(result.success).toBe(false)
    })

    it("should fail with missing required fields", () => {
      const invalidPagination = {
        page: 1,
        // Missing limit, totalCount, etc.
      }

      const result = validateResponseData(invalidPagination, PaginationSchema, {
        endpoint: "/test",
        method: "GET",
      })

      expect(result.success).toBe(false)
    })
  })

  describe("ListWalletRequestsResponseSchema - Paginated Lists", () => {
    it("should validate valid list response with multiple items", () => {
      const validListResponse = {
        data: [
          {
            id: "507f1f77bcf86cd799439011",
            label: "#WTR-001",
            requestedDate: "2024-01-15T10:30:00.000Z",
            user: "507f1f77bcf86cd799439012",
            requesterName: "John Doe",
            amount: 100,
            status: "pending",
            currency: "UGX",
            paymentType: "mobile_money",
            reason: "Business supplies",
          },
          {
            id: "507f1f77bcf86cd799439013",
            label: "#WTR-002",
            requestedDate: "2024-01-16T10:30:00.000Z",
            user: "507f1f77bcf86cd799439014",
            requesterName: "Jane Smith",
            amount: 200,
            status: "approved",
            currency: "UGX",
            paymentType: "bank_transfer",
            reason: "Inventory purchase",
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          totalCount: 2,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }

      const result = validateResponseData(
        validListResponse,
        ListWalletRequestsResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.data.length).toBe(2)
        expect(result.data.pagination.totalCount).toBe(2)
      }
    })

    it("should validate empty list response", () => {
      const emptyListResponse = {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          totalCount: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }

      const result = validateResponseData(
        emptyListResponse,
        ListWalletRequestsResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.data.length).toBe(0)
      }
    })

    it("should fail with invalid item in array", () => {
      const listWithInvalidItem = {
        data: [
          {
            id: "507f1f77bcf86cd799439011",
            label: "#WTR-001",
            requestedDate: "2024-01-15T10:30:00.000Z",
            user: "507f1f77bcf86cd799439012",
            requesterName: "John Doe",
            amount: -100, // Invalid: negative
            status: "pending",
            currency: "UGX",
            paymentType: "mobile_money",
            reason: "Business supplies",
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          totalCount: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }

      const result = validateResponseData(
        listWithInvalidItem,
        ListWalletRequestsResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(false)
    })

    it("should fail with invalid pagination object", () => {
      const listWithInvalidPagination = {
        data: [
          {
            id: "507f1f77bcf86cd799439011",
            label: "#WTR-001",
            requestedDate: "2024-01-15T10:30:00.000Z",
            user: "507f1f77bcf86cd799439012",
            requesterName: "John Doe",
            amount: 100,
            status: "pending",
            currency: "UGX",
            paymentType: "mobile_money",
            reason: "Business supplies",
          },
        ],
        pagination: {
          page: -1, // Invalid
          limit: 10,
          totalCount: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }

      const result = validateResponseData(
        listWithInvalidPagination,
        ListWalletRequestsResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(false)
    })
  })

  describe("SingleWalletRequestResponseSchema - POST/PUT Responses", () => {
    it("should validate response without note", () => {
      const responseWithoutNote = {
        walletRequest: {
          _id: "507f1f77bcf86cd799439011",
          user: "507f1f77bcf86cd799439012",
          amount: 100,
          payment_method: "mobile_money",
          provider: "MTN",
          phone_number: "0712345678",
          reason: "Business supplies",
          status: "pending",
          createdAt: new Date("2024-01-15T10:30:00Z"),
          updatedAt: new Date("2024-01-15T10:30:00Z"),
        },
      }

      const result = validateResponseData(
        responseWithoutNote,
        SingleWalletRequestResponseSchema,
        { endpoint: "/test", method: "POST" },
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.walletRequest._id).toBe("507f1f77bcf86cd799439011")
        expect(result.data.note).toBeUndefined()
      }
    })

    it("should validate response with note", () => {
      const responseWithNote = {
        walletRequest: {
          _id: "507f1f77bcf86cd799439011",
          user: "507f1f77bcf86cd799439012",
          amount: 100,
          payment_method: "mobile_money",
          provider: "MTN",
          phone_number: "0712345678",
          reason: "Business supplies",
          status: "approved",
          reviewed_by: "507f1f77bcf86cd799439015",
          reviewed_at: new Date("2024-01-15T11:00:00Z"),
          createdAt: new Date("2024-01-15T10:30:00Z"),
          updatedAt: new Date("2024-01-15T11:00:00Z"),
        },
        note: "Automatically approved for privileged user",
      }

      const result = validateResponseData(
        responseWithNote,
        SingleWalletRequestResponseSchema,
        { endpoint: "/test", method: "POST" },
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.note).toBe(
          "Automatically approved for privileged user",
        )
      }
    })

    it("should fail with invalid walletRequest", () => {
      const responseWithInvalidRequest = {
        walletRequest: {
          _id: "507f1f77bcf86cd799439011",
          // Missing required fields
        },
      }

      const result = validateResponseData(
        responseWithInvalidRequest,
        SingleWalletRequestResponseSchema,
        { endpoint: "/test", method: "POST" },
      )

      expect(result.success).toBe(false)
    })
  })

  describe("ConfirmReceiptResponseSchema", () => {
    it("should validate response without message", () => {
      const responseWithoutMessage = {
        walletRequest: {
          _id: "507f1f77bcf86cd799439011",
          user: "507f1f77bcf86cd799439012",
          amount: 100,
          payment_method: "mobile_money",
          provider: "MTN",
          phone_number: "0712345678",
          reason: "Business supplies",
          status: "approved",
          confirmed_at: new Date("2024-01-15T12:00:00Z"),
          createdAt: new Date("2024-01-15T10:30:00Z"),
          updatedAt: new Date("2024-01-15T12:00:00Z"),
        },
      }

      const result = validateResponseData(
        responseWithoutMessage,
        ConfirmReceiptResponseSchema,
        { endpoint: "/test", method: "PUT" },
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.walletRequest.confirmed_at).toBeDefined()
        expect(result.data.message).toBeUndefined()
      }
    })

    it("should validate response with message", () => {
      const responseWithMessage = {
        walletRequest: {
          _id: "507f1f77bcf86cd799439011",
          user: "507f1f77bcf86cd799439012",
          amount: 100,
          payment_method: "mobile_money",
          provider: "MTN",
          phone_number: "0712345678",
          reason: "Business supplies",
          status: "approved",
          confirmed_at: new Date("2024-01-15T12:00:00Z"),
          createdAt: new Date("2024-01-15T10:30:00Z"),
          updatedAt: new Date("2024-01-15T12:00:00Z"),
        },
        message: "Receipt confirmed successfully",
      }

      const result = validateResponseData(
        responseWithMessage,
        ConfirmReceiptResponseSchema,
        { endpoint: "/test", method: "PUT" },
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.message).toBe("Receipt confirmed successfully")
      }
    })
  })

  describe("Error Handling and Logging", () => {
    it("should return 500 status on validation failure", () => {
      const invalidData = {
        // Completely invalid data
        foo: "bar",
      }

      const result = validateResponseData(
        invalidData,
        WalletRequestResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response).toBeInstanceOf(NextResponse)
        expect(result.response.status).toBe(500)
      }
    })

    it("should return generic error message (no sensitive data)", async () => {
      const invalidData = {
        foo: "bar",
      }

      const result = validateResponseData(
        invalidData,
        WalletRequestResponseSchema,
        { endpoint: "/test", method: "GET" },
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        const body = await result.response.json()
        expect(body.error).toBe(
          "Internal server error: response data validation failed. Please contact support.",
        )
        // Should NOT contain validation details in response
        expect(body.errors).toBeUndefined()
      }
    })

    it("should work without optional context parameter", () => {
      const invalidData = {
        foo: "bar",
      }

      const result = validateResponseData(
        invalidData,
        WalletRequestResponseSchema,
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response.status).toBe(500)
      }
    })
  })
})

