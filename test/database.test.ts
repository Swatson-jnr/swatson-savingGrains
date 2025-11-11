/// <reference types="jest" />
import User from "@/lib/models/user"
import Wallet from "@/lib/models/wallet"
import WalletRequest from "@/lib/models/walletRequest"
import {
  createTestUser,
  createTestWallet,
  createAppWallet,
  createAdminUser,
} from "./factories"

describe("Database Schema Tests", () => {
  // Clean up after each test
  afterEach(async () => {
    try {
      await User.deleteMany({})
      await WalletRequest.deleteMany({})
      await Wallet.deleteMany({})
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  describe("User Model - walletBalance field", () => {
    it("should create user with default walletBalance of 0", async () => {
      const user = await createTestUser()
      expect(user.walletBalance).toBe(0)
    })

    it("should allow setting custom walletBalance", async () => {
      const user = await createTestUser({ walletBalance: 500 })
      expect(user.walletBalance).toBe(500)
    })

    it("should not allow negative walletBalance", async () => {
      const user = new User({
        first_name: "Test",
        last_name: "User",
        email: `test-${Date.now()}@example.com`,
        phone_number: `+233501${String(Date.now()).slice(-6)}`,
        passcode: "5678",
        walletBalance: -100,
      })

      try {
        await user.validate()
        fail("Should have thrown validation error")
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it("should increment walletBalance correctly", async () => {
      const user = await createTestUser({ walletBalance: 100 })

      const updated = await User.findByIdAndUpdate(
        user._id,
        { $inc: { walletBalance: 250 } },
        { new: true },
      )

      expect(updated?.walletBalance).toBe(350)
    })

    it("should decrement walletBalance correctly", async () => {
      const user = await createTestUser({ walletBalance: 500 })

      const updated = await User.findByIdAndUpdate(
        user._id,
        { $inc: { walletBalance: -200 } },
        { new: true },
      )

      expect(updated?.walletBalance).toBe(300)
    })

    it("should persist walletBalance across reads", async () => {
      const user = await createTestUser({ walletBalance: 750 })

      const fetched = await User.findById(user._id)
      expect(fetched?.walletBalance).toBe(750)
    })
  })

  describe("Wallet Model - System Wallets", () => {
    it("should create app wallet with system flag", async () => {
      const wallet = await createAppWallet(10000)
      expect(wallet.name).toBe("app")
      expect(wallet.system).toBe(true)
      expect(wallet.balance).toBe(10000)
    })

    it("should create multiple system wallets", async () => {
      const appWallet = await createAppWallet(5000)
      const cashWallet = await createTestWallet({
        name: "cash",
        system: true,
        balance: 2000,
      })

      expect(appWallet.name).toBe("app")
      expect(cashWallet.name).toBe("cash")
      expect(appWallet.system).toBe(true)
      expect(cashWallet.system).toBe(true)
    })

    it("should query system wallets correctly", async () => {
      await createAppWallet(5000)
      await createTestWallet({
        name: "cash",
        system: true,
        balance: 1000,
      })

      const systemWallets = await Wallet.find({ system: true })
      expect(systemWallets.length).toBeGreaterThanOrEqual(2)
      expect(systemWallets.every((w) => w.system)).toBe(true)
    })

    it("should increment wallet balance atomically", async () => {
      const wallet = await createAppWallet(1000)

      const updated = await Wallet.findByIdAndUpdate(
        wallet._id,
        { $inc: { balance: 500 } },
        { new: true },
      )

      expect(updated?.balance).toBe(1500)
    })

    it("should decrement wallet balance atomically", async () => {
      const wallet = await createAppWallet(1000)

      const updated = await Wallet.findByIdAndUpdate(
        wallet._id,
        { $inc: { balance: -300 } },
        { new: true },
      )

      expect(updated?.balance).toBe(700)
    })
  })

  describe("WalletRequest Model", () => {
    it("should create wallet request with pending status", async () => {
      const user = await createTestUser()
      const request = await WalletRequest.create({
        user: user._id,
        amount: 1000,
        status: "pending",
        payment_method: "mobile_money",
        reason: "Test request",
      })

      expect(request.status).toBe("pending")
      expect(request.amount).toBe(1000)
      expect(request.user.toString()).toBe(user._id.toString())
    })

    it("should update request status to approved", async () => {
      const user = await createTestUser()
      const request = await WalletRequest.create({
        user: user._id,
        amount: 500,
        status: "pending",
        payment_method: "mobile_money",
        reason: "Test",
      })

      const updated = await WalletRequest.findByIdAndUpdate(
        request._id,
        { status: "approved" },
        { new: true },
      )

      expect(updated?.status).toBe("approved")
    })

    it("should track reviewed_by and reviewed_at", async () => {
      const user = await createTestUser()
      const admin = await createAdminUser()
      const request = await WalletRequest.create({
        user: user._id,
        amount: 500,
        status: "pending",
        payment_method: "mobile_money",
        reason: "Test",
      })

      const now = new Date()
      const updated = await WalletRequest.findByIdAndUpdate(
        request._id,
        {
          status: "approved",
          reviewed_by: admin._id,
          reviewed_at: now,
        },
        { new: true },
      )

      expect(updated?.reviewed_by?.toString()).toBe(admin._id.toString())
      expect(updated?.reviewed_at).toBeDefined()
    })

    it("should support declined status", async () => {
      const user = await createTestUser()
      const request = await WalletRequest.create({
        user: user._id,
        amount: 500,
        status: "pending",
        payment_method: "mobile_money",
        reason: "Test",
      })

      const updated = await WalletRequest.findByIdAndUpdate(
        request._id,
        {
          status: "declined",
        },
        { new: true },
      )

      expect(updated?.status).toBe("declined")
    })

    it("should track created_at timestamp", async () => {
      const user = await createTestUser()
      const beforeCreation = new Date()

      const request = await WalletRequest.create({
        user: user._id,
        amount: 500,
        status: "pending",
        payment_method: "mobile_money",
        reason: "Test",
      })

      expect(request.createdAt).toBeDefined()
      expect(request.createdAt!.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      )
    })
  })

  describe("Data Integrity", () => {
    it("should maintain referential integrity for user in WalletRequest", async () => {
      const user = await createTestUser()
      const request = await WalletRequest.create({
        user: user._id,
        amount: 500,
        payment_method: "mobile_money",
        reason: "Test",
      })

      const fetched = await WalletRequest.findById(request._id)
      expect(fetched?.user.toString()).toBe(user._id.toString())
    })

    it("should handle multiple wallet requests per user", async () => {
      const user = await createTestUser()

      const req1 = await WalletRequest.create({
        user: user._id,
        amount: 200,
        status: "pending",
        payment_method: "mobile_money",
        reason: "Test 1",
      })

      const req2 = await WalletRequest.create({
        user: user._id,
        amount: 300,
        status: "pending",
        payment_method: "mobile_money",
        reason: "Test 2",
      })

      const requests = await WalletRequest.find({ user: user._id })
      expect(requests.length).toBe(2)
      expect(requests.map((r) => r._id.toString())).toContain(
        req1._id.toString(),
      )
      expect(requests.map((r) => r._id.toString())).toContain(
        req2._id.toString(),
      )
    })
  })
})

