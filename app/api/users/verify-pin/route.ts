import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/middleware/authMiddleware";
import User from "@/lib/models/user";

/**
 * @swagger
 * /api/users/verify-pin:
 *   post:
 *     summary: Verify user's 4-digit passcode
 *     description: Validates the provided passcode against the authenticated user's stored hashed passcode
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passcode
 *             properties:
 *               passcode:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: PIN verified successfully
 *       400:
 *         description: Missing or invalid passcode
 *       401:
 *         description: Incorrect passcode
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

export const POST = async (req: NextRequest) => {
  try {
    // Authenticate request
    const auth = await authenticate(req);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    const userId = auth.user?.id;
    if (!userId)
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });

    const { passcode } = await req.json();

    if (!passcode)
      return NextResponse.json(
        { error: "Passcode is required" },
        { status: 400 }
      );

    // Validate passcode format
    if (!/^\d{4}$/.test(passcode)) {
      return NextResponse.json(
        { error: "Passcode must be exactly 4 digits" },
        { status: 400 }
      );
    }

    await connectDB();

    // Pull user with hashed passcode
    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Verify hashed passcode
    const isMatch = await bcrypt.compare(passcode, user.passcode);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid passcode" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Passcode verified successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("PIN verification failed:", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
