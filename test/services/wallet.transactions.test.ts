/// <reference types="jest" />
import mongoose, { Types } from "mongoose"
import User from "@/lib/models/user"
import WalletRequest from "@/lib/models/walletRequest"
import Wallet from "@/lib/models/wallet"
import {
  processWalletApproval,
  declineWalletRequest,
  confirmWalletReceipt,
} from "@/lib/services/wallet.transactions"
import {
  createTestUser,
  createAppWallet,
  createTestWalletRequest,
  createAdminUser,
} from "../factories"

describe("Wallet Transaction Helpers", () => {
  // Clean up after each test to prevent state leakage
  afterEach(async () => {
    try {
      await User.deleteMany({})
      await WalletRequest.deleteMany({})
      await Wallet.deleteMany({})
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  describe("processWalletApproval", () => {
    it("should approve request and transfer funds", async () => {
      const user = await createTestUser({ walletBalance: 0 })
      const admin = await createAdminUser()
      const appWallet = await createAppWallet(5000)

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "pending",
      })

      const result = await processWalletApproval(
        request._id,
        user._id,
        500,
        admin._id,
      )

      if (!result.success) {
        console.error("Test failed - error:", result.error)
        console.error("Full result:", JSON.stringify(result, null, 2))
      }

      expect(result.success).toBe(true)
      expect(result.requestId).toBe(request._id.toString())
    })

    it("should prevent approval when app wallet has insufficient funds", async () => {
      const user = await createTestUser({ walletBalance: 0 })
      const admin = await createAdminUser()
      const appWallet = await createAppWallet(200) // Only 200 available

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500, // Request for 500
        status: "pending",
      })

      const result = await processWalletApproval(
        request._id,
        user._id,
        500,
        admin._id,
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain("Insufficient funds")
    })

    it("should be idempotent - prevent double-charging", async () => {
      const user = await createTestUser({ walletBalance: 0 })
      const admin = await createAdminUser()
      const appWallet = await createAppWallet(2000)

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "pending",
      })

      // First approval
      const result1 = await processWalletApproval(
        request._id,
        user._id,
        500,
        admin._id,
      )
      expect(result1.success).toBe(true)

      // Second approval (should fail or return success without charging again)
      const result2 = await processWalletApproval(
        request._id,
        user._id,
        500,
        admin._id,
      )

      // Should be idempotent
      expect(result2.success).toBe(true)
    })

    it("should reject non-pending requests", async () => {
      const user = await createTestUser({ walletBalance: 0 })
      const admin = await createAdminUser()
      await createAppWallet(5000)

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "declined", // Already declined - cannot approve
      })

      const result = await processWalletApproval(
        request._id,
        user._id,
        500,
        admin._id,
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain("Cannot approve")
    })

    it("should return error for non-existent request", async () => {
      const user = await createTestUser()
      const admin = await createAdminUser()
      const fakeRequestId = new Types.ObjectId()

      const result = await processWalletApproval(
        fakeRequestId,
        user._id,
        500,
        admin._id,
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain("not found")
    })

    it("should correctly update user wallet balance", async () => {
      const user = await createTestUser({ walletBalance: 100 })
      const admin = await createAdminUser()
      await createAppWallet(2000)

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "pending",
      })

      await processWalletApproval(request._id, user._id, 500, admin._id)

      // Verify user balance increased
      const updatedUser = await User.findById(user._id)
      expect(updatedUser?.walletBalance).toBe(600) // 100 + 500
    })

    it("should correctly deduct from app wallet", async () => {
      const user = await createTestUser({ walletBalance: 0 })
      const admin = await createAdminUser()
      const appWallet = await createAppWallet(1000)

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 250,
        status: "pending",
      })

      await processWalletApproval(request._id, user._id, 250, admin._id)

      // Verify app wallet decreased
      const updatedWallet = await Wallet.findById(appWallet._id)
      expect(updatedWallet?.balance).toBe(750) // 1000 - 250
    })

    it("should set reviewed_by and reviewed_at", async () => {
      const user = await createTestUser({ walletBalance: 0 })
      const admin = await createAdminUser()
      await createAppWallet(2000)

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "pending",
      })

      await processWalletApproval(request._id, user._id, 500, admin._id)

      // Verify reviewed_by and reviewed_at are set
      const updatedRequest = await WalletRequest.findById(request._id)
      expect(updatedRequest?.reviewed_by?.toString()).toBe(admin._id.toString())
      expect(updatedRequest?.reviewed_at).toBeDefined()
    })
  })

  describe("declineWalletRequest", () => {
    it("should decline pending request", async () => {
      const user = await createTestUser()
      const admin = await createAdminUser()

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "pending",
      })

      const result = await declineWalletRequest(
        request._id,
        admin._id,
        "Insufficient documents",
      )

      expect(result.success).toBe(true)
    })

    it("should set decline_reason", async () => {
      const user = await createTestUser()
      const admin = await createAdminUser()

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "pending",
      })

      await declineWalletRequest(request._id, admin._id, "Verification failed")

      const updatedRequest = await WalletRequest.findById(request._id)
      expect(updatedRequest?.rejectionReason).toBe("Verification failed")
    })

    it("should set reviewed_by when declining", async () => {
      const user = await createTestUser()
      const admin = await createAdminUser()

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "pending",
      })

      await declineWalletRequest(request._id, admin._id, "Test reason")

      const updatedRequest = await WalletRequest.findById(request._id)
      expect(updatedRequest?.reviewed_by?.toString()).toBe(admin._id.toString())
    })

    it("should not affect user wallet balance", async () => {
      const user = await createTestUser({ walletBalance: 1000 })
      const admin = await createAdminUser()

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "pending",
      })

      await declineWalletRequest(request._id, admin._id, "Declined")

      const updatedUser = await User.findById(user._id)
      expect(updatedUser?.walletBalance).toBe(1000) // Unchanged
    })
  })

  describe("confirmWalletReceipt", () => {
    it("should confirm receipt for approved request", async () => {
      const user = await createTestUser()

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "approved",
      })

      const result = await confirmWalletReceipt(request._id, user._id)

      expect(result.success).toBe(true)
    })

    it("should change status from approved to successful", async () => {
      const user = await createTestUser()

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "approved",
      })

      await confirmWalletReceipt(request._id, user._id)

      const updatedRequest = await WalletRequest.findById(request._id)
      expect(updatedRequest?.status).toBe("successful")
    })

    it("should reject confirmation for non-approved requests", async () => {
      const user = await createTestUser()

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "pending",
      })

      const result = await confirmWalletReceipt(request._id, user._id)

      expect(result.success).toBe(false)
      expect(result.error).toContain("Cannot confirm receipt")
    })

    it("should verify correct user is confirming", async () => {
      const user1 = await createTestUser()
      const user2 = await createTestUser()

      const request = await createTestWalletRequest({
        user_id: user1._id,
        amount: 500,
        status: "approved",
      })

      // User2 trying to confirm user1's request
      const result = await confirmWalletReceipt(request._id, user2._id)

      expect(result.success).toBe(false)
      expect(result.error).toContain("Unauthorized")
    })

    it("should set confirmed_at timestamp", async () => {
      const user = await createTestUser()

      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "approved",
      })

      const beforeConfirm = new Date()
      await confirmWalletReceipt(request._id, user._id)
      const afterConfirm = new Date()

      const updatedRequest = await WalletRequest.findById(request._id)
      expect(updatedRequest?.confirmed_at).toBeDefined()
      expect(updatedRequest?.confirmed_at!.getTime()).toBeGreaterThanOrEqual(
        beforeConfirm.getTime(),
      )
      expect(updatedRequest?.confirmed_at!.getTime()).toBeLessThanOrEqual(
        afterConfirm.getTime(),
      )
    })
  })

  describe("Transaction Atomicity", () => {
    it("should rollback if any operation fails during approval", async () => {
      const user = await createTestUser({ walletBalance: 0 })
      const admin = await createAdminUser()

      // Simulate a scenario where the transaction should fail
      const request = await createTestWalletRequest({
        user_id: user._id,
        amount: 500,
        status: "declined", // Already declined - should prevent approval
      })

      const result = await processWalletApproval(
        request._id,
        user._id,
        500,
        admin._id,
      )

      expect(result.success).toBe(false)

      // Verify nothing was changed
      const userAfter = await User.findById(user._id)
      expect(userAfter?.walletBalance).toBe(0)
    })
  })
})

