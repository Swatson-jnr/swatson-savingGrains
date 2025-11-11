/**
 * Integration tests for PUT /api/user/fcm-token
 * Task 0.19: Add fcm_token field to User model
 */

import { PUT } from "@/app/api/user/fcm-token/route"
import { signToken } from "@/lib/auth"
import User from "@/lib/models/user"
import { createFieldAgentUser } from "@/test/factories"
import { NextRequest } from "next/server"

describe("PUT /api/user/fcm-token - Task 0.19 FCM Token Management", () => {
  it("should have fcm_token as null by default on user creation", async () => {
    const user = await createFieldAgentUser()
    expect(user.fcm_token).toBeNull()
  });

  describe("✅ TEST 1: Successful FCM token update", () => {
    it("should update fcm_token for authenticated user", async () => {
      // Setup: Create user
      const user = await createFieldAgentUser()
      const token = signToken({
        id: user._id.toString(),
        phone_number: user.phone_number,
      })

      // Execute: Update FCM token
      const fcmToken = "test-fcm-token-12345"
      const req = new NextRequest("http://localhost:3000/api/user/fcm-token", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fcm_token: fcmToken }),
      })
      const response = await PUT(req)

      // Assert: 200 OK
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.message).toBe("FCM token updated successfully")
      expect(data.user.fcm_token).toBe(fcmToken)

      // Verify in database
      const updatedUser = await User.findById(user._id)
      expect(updatedUser?.fcm_token).toBe(fcmToken)
    })

    it("should trim whitespace from fcm_token", async () => {
      const user = await createFieldAgentUser()
      const token = signToken({
        id: user._id.toString(),
        phone_number: user.phone_number,
      })

      const fcmToken = "  test-fcm-token-with-spaces  "
      const req = new NextRequest("http://localhost:3000/api/user/fcm-token", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fcm_token: fcmToken }),
      })
      const response = await PUT(req)

      expect(response.status).toBe(200)
      const updatedUser = await User.findById(user._id)
      expect(updatedUser?.fcm_token).toBe("test-fcm-token-with-spaces")
    })

    it("should allow updating fcm_token multiple times", async () => {
      const user = await createFieldAgentUser()
      const token = signToken({
        id: user._id.toString(),
        phone_number: user.phone_number,
      })

      // First update
      const fcmToken1 = "first-token"
      const req1 = new NextRequest("http://localhost:3000/api/user/fcm-token", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fcm_token: fcmToken1 }),
      })
      await PUT(req1)

      // Second update
      const fcmToken2 = "second-token"
      const req2 = new NextRequest("http://localhost:3000/api/user/fcm-token", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fcm_token: fcmToken2 }),
      })
      const response2 = await PUT(req2)

      expect(response2.status).toBe(200)
      const updatedUser = await User.findById(user._id)
      expect(updatedUser?.fcm_token).toBe(fcmToken2)
    })
  })

  describe("✅ TEST 2: Authentication required", () => {
    it("should return 401 when not authenticated", async () => {
      const req = new NextRequest("http://localhost:3000/api/user/fcm-token", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fcm_token: "test-token" }),
      })
      const response = await PUT(req)

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe("Unauthorized")
    })

    it("should return 401 with invalid token", async () => {
      const req = new NextRequest("http://localhost:3000/api/user/fcm-token", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer invalid-token",
        },
        body: JSON.stringify({ fcm_token: "test-token" }),
      })
      const response = await PUT(req)

      expect(response.status).toBe(401)
    })
  })

  describe("✅ TEST 3: Validation errors", () => {
    it("should return 400 when fcm_token is missing", async () => {
      const user = await createFieldAgentUser()
      const token = signToken({
        id: user._id.toString(),
        phone_number: user.phone_number,
      })

      const req = new NextRequest("http://localhost:3000/api/user/fcm-token", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })
      const response = await PUT(req)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe("fcm_token must be a non-empty string")
    })

    it("should return 400 when fcm_token is empty string", async () => {
      const user = await createFieldAgentUser()
      const token = signToken({
        id: user._id.toString(),
        phone_number: user.phone_number,
      })

      const req = new NextRequest("http://localhost:3000/api/user/fcm-token", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fcm_token: "" }),
      })
      const response = await PUT(req)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe("fcm_token must be a non-empty string")
    })

    it("should return 400 when fcm_token is only whitespace", async () => {
      const user = await createFieldAgentUser()
      const token = signToken({
        id: user._id.toString(),
        phone_number: user.phone_number,
      })

      const req = new NextRequest("http://localhost:3000/api/user/fcm-token", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fcm_token: "   " }),
      })
      const response = await PUT(req)

      expect(response.status).toBe(400)
    })

    it("should return 400 when fcm_token is not a string", async () => {
      const user = await createFieldAgentUser()
      const token = signToken({
        id: user._id.toString(),
        phone_number: user.phone_number,
      })

      const req = new NextRequest("http://localhost:3000/api/user/fcm-token", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fcm_token: 12345 }),
      })
      const response = await PUT(req)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe("fcm_token must be a non-empty string")
    })
  })

  describe("✅ TEST 4: User model field", () => {
    it("should persist fcm_token in database", async () => {
      const user = await createFieldAgentUser()
      user.fcm_token = "test-token-persistence"
      await user.save()

      const fetchedUser = await User.findById(user._id)
      expect(fetchedUser?.fcm_token).toBe("test-token-persistence")
    })

    it("should update and retrieve fcm_token via API", async () => {
      const user = await createFieldAgentUser()
      const token = signToken({
        id: user._id.toString(),
        phone_number: user.phone_number,
      })

      // Update FCM token via PUT endpoint
      const fcmToken = "api-end-to-end-token"
      const req = new NextRequest("http://localhost:3000/api/user/fcm-token", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fcm_token: fcmToken }),
      })
      const response = await PUT(req)
      expect(response.status).toBe(200)

      // Retrieve user from database and verify token
      const updatedUser = await User.findById(user._id)
      expect(updatedUser?.fcm_token).toBe(fcmToken)
    })
  })
})

