import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/middleware/authMiddleware";
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";

// Valid roles in the system
const VALID_ROLES = [
  "super-admin",
  "admin",
  "backoffice-admin",
  "account-manager",
  "paymaster",
  "stock-manager",
  "field-agent",
];

/* ============================================================
   GET /api/users/:id
   ============================================================ */
export async function GET(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;

    const auth = await authenticate(req);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    await connectDB();

    const user = await User.findById(id).select("-passcode").lean();

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
}

/* ============================================================
   PUT /api/users/:id  (Update user)
   ============================================================ */
export async function PUT(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;

    const auth = await authenticate(req);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    await connectDB();
    const data = await req.json();

    const updateData: any = {};

    // OPTIONAL fields: update only the ones provided
    if (data.first_name) updateData.first_name = data.first_name.trim();
    if (data.last_name) updateData.last_name = data.last_name.trim();
    if (data.email) updateData.email = data.email.trim().toLowerCase();
    if (data.phone_number) updateData.phone_number = data.phone_number.trim();

    // Passcode update (must be 4 digits)
    if (data.passcode) {
      if (!/^\d{4}$/.test(data.passcode)) {
        return NextResponse.json(
          { error: "Passcode must be 4 digits" },
          { status: 400 }
        );
      }
      updateData.passcode = await bcrypt.hash(data.passcode, 12);
    }

    // ROLE validation
    if (data.roles) {
      const invalid = data.roles.filter(
        (role: string) => !VALID_ROLES.includes(role)
      );
      if (invalid.length > 0) {
        return NextResponse.json(
          { error: `Invalid roles: ${invalid.join(", ")}` },
          { status: 400 }
        );
      }
      updateData.roles = data.roles;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .select("-passcode")
      .lean();

    if (!updatedUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user:", error);

    // Duplicate key errors (email or phone)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `User with this ${field} already exists` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update user",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/* ============================================================
   DELETE /api/users/:id  (Delete user)
   ============================================================ */
export async function DELETE(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;

    const auth = await authenticate(req);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    await connectDB();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
