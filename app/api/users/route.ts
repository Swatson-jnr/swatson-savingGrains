import connectDB from "@/lib/db";
import { authenticate } from "@/lib/middleware/authMiddleware";
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users in the system
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       500:
 *         description: Internal server error
 */

export const GET = async (req: NextRequest) => {
  try {
    const auth = await authenticate(req);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    await connectDB();

    const userId = auth.user?.id;
    if (!userId)
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });

    const user = await User.findById(userId).select("-passcode").lean();
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
};

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user account with the provided information
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - phone_number
 *               - passcode
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: User's first name
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 description: User's last name
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (must be unique)
 *                 example: "john.doe@example.com"
 *               phone_number:
 *                 type: string
 *                 description: User's phone number (must be unique)
 *                 example: "+233123456789"
 *               passcode:
 *                 type: string
 *                 description: User's 4-digit passcode (will be hashed)
 *                 example: "1234"
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional array of user roles
 *                 example: ["field-agent"]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request - missing required fields
 *       409:
 *         description: Conflict - user already exists
 *       500:
 *         description: Internal server error
 */
// export const POST = async (request: NextRequest) => {
//   try {
//     const { first_name, last_name, email, phone_number, passcode, roles } =
//       await request.json();

//     // Validate required fields
//     if (!first_name || !last_name || !email || !phone_number || !passcode) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Trim inputs
//     const trimmedPhoneNumber = phone_number.trim();
//     const trimmedEmail = email.trim().toLowerCase();
//     const trimmedPasscode = passcode.trim();

//     await connectDB();

//     // Check if user already exists
//     const existingUser = await User.findOne({
//       $or: [{ email: trimmedEmail }, { phone_number: trimmedPhoneNumber }],
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 409 }
//       );
//     }

//     // Hash passcode
//     const hashedPasscode = await bcrypt.hash(trimmedPasscode, 12);

//     // Create new user
//     const newUser = await User.create({
//       first_name: first_name.trim(),
//       last_name: last_name.trim(),
//       email: trimmedEmail,
//       phone_number: trimmedPhoneNumber,
//       passcode: hashedPasscode,
//       roles: roles || ["field-agent"],
//       system: false,
//       walletBalance: 0,
//     });

//     // Return user without passcode
//     const userResponse = newUser.toObject();
//     delete userResponse.passcode;

//     return NextResponse.json(userResponse, { status: 201 });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return NextResponse.json(
//       { error: "Failed to create user" },
//       { status: 500 }
//     );
//   }
// };

export const POST = async (request: NextRequest) => {
  try {
    const { first_name, last_name, email, phone_number, passcode, roles } =
      await request.json();

    if (!first_name || !last_name || !email || !phone_number || !passcode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Trim inputs
    const trimmedPhoneNumber = phone_number.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPasscode = passcode.trim();

    // Validate passcode format (4 digits)
    if (!/^\d{4}$/.test(trimmedPasscode)) {
      return NextResponse.json(
        { error: "Passcode must be exactly 4 digits" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: trimmedEmail }, { phone_number: trimmedPhoneNumber }],
    });

    if (existingUser) {
      const conflictField =
        existingUser.email === trimmedEmail ? "email" : "phone number";
      return NextResponse.json(
        { error: `User with this ${conflictField} already exists` },
        { status: 409 }
      );
    }

    // Hash passcode with proper salt rounds
    const hashedPasscode = await bcrypt.hash(trimmedPasscode, 12);

    // Validate roles if provided
    const validRoles = [
      "super-admin",
      "admin",
      "backoffice-admin",
      "account-manager",
      "paymaster",
      "stock-manager",
      "field-agent",
    ];

    const userRoles = roles || ["field-agent"];
    const invalidRoles = userRoles.filter(
      (role: string) => !validRoles.includes(role)
    );

    if (invalidRoles.length > 0) {
      return NextResponse.json(
        { error: `Invalid roles: ${invalidRoles.join(", ")}` },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await User.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: trimmedEmail,
      phone_number: trimmedPhoneNumber,
      passcode: hashedPasscode,
      roles: userRoles,
      system: false,
      walletBalance: 0,
    });

    // Return user without passcode
    const userResponse = newUser.toObject();
    delete userResponse.passcode;

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: "Validation failed", details: messages },
        { status: 400 }
      );
    }

    // Handle duplicate key errors (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `User with this ${field} already exists` },
        { status: 409 }
      );
    }

    // Handle other errors with more details
    return NextResponse.json(
      {
        error: "Failed to create user",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
};
