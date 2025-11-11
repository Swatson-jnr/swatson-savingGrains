/**
 * PUT /api/user/fcm-token
 * Update authenticated user's FCM token for push notifications
 * Task 0.19: Add fcm_token field to User model
 */

import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/middleware/authMiddleware";
import User from "@/lib/models/user";
import { logger } from "@/lib/utils/logger";

export async function PUT(req: NextRequest) {
  try {
    // ✅ Authenticate user properly
    const auth = await authenticate(req);

    if (auth.error || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: auth.status || 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { fcm_token } = body;

    // Validate fcm_token
    if (
      !fcm_token ||
      typeof fcm_token !== "string" ||
      fcm_token.trim() === ""
    ) {
      logger.warn("Invalid FCM token provided", {
        userId: auth.user.id,
        tokenProvided: !!fcm_token,
      });
      return NextResponse.json(
        { error: "fcm_token must be a non-empty string" },
        { status: 400 }
      );
    }

    // Update user's fcm_token
    const updatedUser = await User.findByIdAndUpdate(
      auth.user.id,
      { fcm_token: fcm_token.trim() },
      { new: true }
    );

    if (!updatedUser) {
      logger.error("User not found when updating FCM token", {
        userId: auth.user.id,
      });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    logger.info("FCM token updated successfully", {
      userId: auth.user.id,
      tokenLength: fcm_token.trim().length,
    });

    return NextResponse.json({
      message: "FCM token updated successfully",
      user: {
        id: updatedUser._id,
        fcm_token: updatedUser.fcm_token,
      },
    });
  } catch (error) {
    logger.error("Error updating FCM token", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
