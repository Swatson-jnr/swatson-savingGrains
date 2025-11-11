import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and return JWT tokens
 *     description: Validates user credentials and returns access and refresh tokens
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - passcode
 *             properties:
 *               phone_number:
 *                 type: string
 *                 description: User's phone number
 *                 example: "+233123456789"
 *               passcode:
 *                 type: string
 *                 description: User's 4-digit passcode
 *                 pattern: "^\\d{4}$"
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

interface IUser {
  _id: { toString(): string };
  phone_number: string;
  passcode: string;
  first_name?: string;
  last_name?: string;
  roles?: string[] | string;
  warehouses?: any[];
  assignedCountries?: any[];
  otp?: string;
  otp_expires_at?: Date;
}

/**
 * Helper function to attach CORS headers to a NextResponse
 */
const attachCorsHeaders = (res: NextResponse) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return res;
};

/**
 * Handle preflight OPTIONS requests
 */
export const OPTIONS = async () => {
  const res = NextResponse.json({ message: "OK" });
  return attachCorsHeaders(res);
};

/**
 * Handle POST requests for login
 */
// export const POST = async (req: NextRequest) => {
//   try {
//     const body = await req.json();
//     const phone_number: string | undefined = body.phone_number?.trim();
//     const passcode: string | undefined = body.passcode?.trim();

//     if (!phone_number || !passcode) {
//       return attachCorsHeaders(
//         NextResponse.json(
//           { error: "Phone number and passcode are required" },
//           { status: 400 }
//         )
//       );
//     }

//     await connectDB();

//     // Find user (don't use lean() to get full document)
//     const user = await User.findOne({ phone_number });

//     if (!user) {
//       return attachCorsHeaders(
//         NextResponse.json({ error: "User not found" }, { status: 404 })
//       );
//     }

//     // Compare passcode
//     const isMatch = await bcrypt.compare(passcode, user.passcode);

//     if (!isMatch) {
//       return attachCorsHeaders(
//         NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
//       );
//     }

//     // Generate JWT tokens
//     const access = jwt.sign(
//       {
//         id: user._id.toString(),
//         phone_number: user.phone_number,
//       },
//       process.env.JWT_SECRET!,
//       { expiresIn: "7d" }
//     );

//     const refresh = jwt.sign(
//       {
//         id: user._id.toString(),
//         phone_number: user.phone_number,
//         type: "refresh",
//       },
//       process.env.JWT_SECRET!,
//       { expiresIn: "30d" }
//     );

//     const responseUser = {
//       firstName: user.first_name,
//       lastName: user.last_name,
//       phoneNumber: user.phone_number,
//       roles: Array.isArray(user.roles)
//         ? user.roles.join(",")
//         : user.roles || "",
//       warehouses: user.warehouses || [],
//       assignedCountries: user.assignedCountries || [],
//     };

//     return attachCorsHeaders(
//       NextResponse.json(
//         {
//           tokens: {
//             access,
//             refresh,
//             expiresAt: new Date(
//               Date.now() + 7 * 24 * 60 * 60 * 1000
//             ).toISOString(),
//           },
//           user: responseUser,
//         },
//         { status: 200 }
//       )
//     );
//   } catch (error) {
//     console.error("Login error:", error);
//     return attachCorsHeaders(
//       NextResponse.json({ error: "Internal server error" }, { status: 500 })
//     );
//   }
// };

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const phone_number: string | undefined = body.phone_number?.trim();
    const passcode: string | undefined = body.passcode?.trim();

    if (!phone_number || !passcode) {
      return attachCorsHeaders(
        NextResponse.json(
          { error: "Phone number and passcode are required" },
          { status: 400 }
        )
      );
    }

    await connectDB();

    // Find user
    const user = await User.findOne({ phone_number });

    if (!user) {
      return attachCorsHeaders(
        NextResponse.json({ error: "User not found" }, { status: 404 })
      );
    }

    // Compare passcode
    const isMatch = await bcrypt.compare(passcode, user.passcode);

    if (!isMatch) {
      return attachCorsHeaders(
        NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      );
    }

    // ✅ IMPORTANT: Include roles in the JWT token
    const access = jwt.sign(
      {
        id: user._id.toString(),
        phone_number: user.phone_number,
        roles: user.roles, // ← Add roles to token payload
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const refresh = jwt.sign(
      {
        id: user._id.toString(),
        phone_number: user.phone_number,
        type: "refresh",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    // 🔍 DEBUG: Verify the token immediately after creation
    try {
      const decoded = jwt.verify(access, process.env.JWT_SECRET!);
      console.log("✅ Token verified successfully on creation:", decoded);
    } catch (verifyError) {
      console.error(
        "❌ Token verification failed immediately after creation:",
        verifyError
      );
      // This should never happen, but if it does, something is very wrong
      return attachCorsHeaders(
        NextResponse.json({ error: "Token generation failed" }, { status: 500 })
      );
    }

    const responseUser = {
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      roles: Array.isArray(user.roles)
        ? user.roles.join(",")
        : user.roles || "",
      warehouses: user.warehouses || [],
      assignedCountries: user.assignedCountries || [],
    };

    console.log("Login successful for user:", {
      id: user._id.toString(),
      phone: user.phone_number,
      roles: user.roles,
    });

    return attachCorsHeaders(
      NextResponse.json(
        {
          tokens: {
            access,
            refresh,
            expiresAt: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          user: responseUser,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("Login error:", error);
    return attachCorsHeaders(
      NextResponse.json({ error: "Internal server error" }, { status: 500 })
    );
  }
};
