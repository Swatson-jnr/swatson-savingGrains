/**
 * Test suite for wallet request validation (Task 0.17)
 *
 * Tests validation for:
 * - Amount validation (required, positive)
 * - Payment method validation
 * - Ghana phone number format validation
 * - Bank name validation
 * - Descriptive error messages
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
import {
  isValidGhanaPhoneNumber,
  isValidPaymentMethod,
  isValidGhanaBank,
  isValidMobileMoneyProvider,
} from "@/lib/utils/validation"

describe("Wallet Request Validation - Task 0.17", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await WalletRequest.deleteMany({})
    await Wallet.deleteMany({})
  })

  describe("Amount Validation", () => {
    it("should return 400 when amount is missing", async () => {
      const user = await createFieldAgentUser()
      const token = signToken({
        id: user._id.toString(),
        phone_number: user.phone_number,
      })

      const req = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: "Test without amount",
          }),
        },
      )

      const response = await CreateRequest(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Amount must be a positive number")
    })

    it("should return 400 when amount is zero", async () => {
      const user = await createFieldAgentUser()
      const token = signToken({
        id: user._id.toString(),
        phone_number: user.phone_number,
      })

      const req = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: 0,
            reason: "Test with zero amount",
          }),
        },
      )

      const response = await CreateRequest(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Amount must be a positive number")
    })

    it("should return 400 when amount is negative", async () => {
      const user = await createFieldAgentUser()
      const token = signToken({
        id: user._id.toString(),
        phone_number: user.phone_number,
      })

      const req = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: -50,
            reason: "Test with negative amount",
          }),
        },
      )

      const response = await CreateRequest(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Amount must be a positive number")
    })

    it("should return 400 when amount is not a number", async () => {
      const user = await createFieldAgentUser()
      const token = signToken({
        id: user._id.toString(),
        phone_number: user.phone_number,
      })

      const req = new NextRequest(
        "http://localhost:3000/api/wallet-topup-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: "not a number",
            reason: "Test with string amount",
          }),
        },
      )

      const response = await CreateRequest(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Amount must be a positive number")
    })
  })

  describe("mobile_money Validation", () => {
    it("should return 400 when provider is missing for mobile_money", async () => {
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
            reason: "Test",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Try to approve without provider
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
            phone_number: "+233501234567",
            // Missing provider
          }),
        },
      )
      const approveResponse = await PUT(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })
      const approveData = await approveResponse.json()

      expect(approveResponse.status).toBe(400)
      expect(approveData.error).toBe(
        "Provider is required for mobile_money payment method",
      )
    })

    it("should return 400 when phone_number is missing for mobile_money", async () => {
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
            reason: "Test",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Try to approve without phone_number
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
            // Missing phone_number
          }),
        },
      )
      const approveResponse = await PUT(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })
      const approveData = await approveResponse.json()

      expect(approveResponse.status).toBe(400)
      expect(approveData.error).toBe(
        "Phone number is required for mobile_money payment method",
      )
    })
  })

  describe("bank_transfer Validation", () => {
    it("should return 400 when bank_name is missing for bank_transfer", async () => {
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
            reason: "Test",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Try to approve without bank_name
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
            branch_name: "Accra Main",
            // Missing bank_name
          }),
        },
      )
      const approveResponse = await PUT(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })
      const approveData = await approveResponse.json()

      expect(approveResponse.status).toBe(400)
      expect(approveData.error).toBe(
        "Bank name is required for bank_transfer payment method",
      )
    })

    it("should return 400 when branch_name is missing for bank_transfer", async () => {
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
            reason: "Test",
          }),
        },
      )
      const createResponse = await CreateRequest(createReq)
      const createData = await createResponse.json()
      const requestId = createData.walletRequest._id

      // Try to approve without branch_name
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
            bank_name: "GCB Bank",
            // Missing branch_name
          }),
        },
      )
      const approveResponse = await PUT(approveReq, {
        params: Promise.resolve({ id: requestId }),
      })
      const approveData = await approveResponse.json()

      expect(approveResponse.status).toBe(400)
      expect(approveData.error).toBe(
        "Branch name is required for bank_transfer payment method",
      )
    })
  })

  describe("Phone Number Format Validation", () => {
    it("should accept valid Ghana phone number starting with 233", () => {
      expect(isValidGhanaPhoneNumber("233501234567")).toBe(true)
      expect(isValidGhanaPhoneNumber("233241234567")).toBe(true)
      expect(isValidGhanaPhoneNumber("233551234567")).toBe(true)
    })

    it("should accept valid Ghana phone number starting with +233", () => {
      expect(isValidGhanaPhoneNumber("+233501234567")).toBe(true)
      expect(isValidGhanaPhoneNumber("+233241234567")).toBe(true)
    })

    it("should accept valid Ghana phone number starting with 0", () => {
      expect(isValidGhanaPhoneNumber("0501234567")).toBe(true)
      expect(isValidGhanaPhoneNumber("0241234567")).toBe(true)
      expect(isValidGhanaPhoneNumber("0551234567")).toBe(true)
    })

    it("should reject invalid phone number formats", () => {
      expect(isValidGhanaPhoneNumber("+1234567890")).toBe(false) // US format
      expect(isValidGhanaPhoneNumber("123")).toBe(false) // Too short
      expect(isValidGhanaPhoneNumber("234501234567")).toBe(false) // Wrong country code
      expect(isValidGhanaPhoneNumber("23350123456")).toBe(false) // Too short
      expect(isValidGhanaPhoneNumber("2335012345678")).toBe(false) // Too long
      expect(isValidGhanaPhoneNumber("")).toBe(false) // Empty
    })
  })

  describe("Payment Method Validation", () => {
    it("should accept valid payment methods", () => {
      expect(isValidPaymentMethod("mobile_money")).toBe(true)
      expect(isValidPaymentMethod("bank_transfer")).toBe(true)
      expect(isValidPaymentMethod("cash")).toBe(true)
    })

    it("should reject invalid payment methods", () => {
      expect(isValidPaymentMethod("Credit Card")).toBe(false)
      expect(isValidPaymentMethod("PayPal")).toBe(false)
      expect(isValidPaymentMethod("mobile money")).toBe(false) // Case sensitive
      expect(isValidPaymentMethod("")).toBe(false)
    })
  })

  describe("Bank Name Validation", () => {
    it("should accept valid Ghana bank names", () => {
      expect(isValidGhanaBank("GCB Bank")).toBe(true)
      expect(isValidGhanaBank("Ecobank Ghana")).toBe(true)
      expect(isValidGhanaBank("Access Bank Ghana")).toBe(true)
      expect(isValidGhanaBank("Absa Bank Ghana")).toBe(true)
    })

    it("should accept bank names case-insensitively", () => {
      expect(isValidGhanaBank("gcb bank")).toBe(true)
      expect(isValidGhanaBank("GCB BANK")).toBe(true)
      expect(isValidGhanaBank("eCoBank Ghana")).toBe(true)
    })

    it("should reject invalid bank names", () => {
      expect(isValidGhanaBank("Bank of America")).toBe(false)
      expect(isValidGhanaBank("Chase Bank")).toBe(false)
      expect(isValidGhanaBank("")).toBe(false)
    })
  })

  describe("mobile_money Provider Validation", () => {
    it("should accept valid mobile_money providers", () => {
      expect(isValidMobileMoneyProvider("MTN")).toBe(true)
      expect(isValidMobileMoneyProvider("Vodafone")).toBe(true)
      expect(isValidMobileMoneyProvider("AirtelTigo")).toBe(true)
    })

    it("should reject invalid mobile_money providers", () => {
      expect(isValidMobileMoneyProvider("Orange")).toBe(false)
      expect(isValidMobileMoneyProvider("mtn")).toBe(false) // Case sensitive
      expect(isValidMobileMoneyProvider("")).toBe(false)
    })
  })
})

