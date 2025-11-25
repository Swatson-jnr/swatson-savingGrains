import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import StockMovement from "@/lib/models/stock-movement";
import Warehouse from "@/lib/models/warehouse";

// Type for warehouse stock items
interface IStockItem {
  grainType: string;
  quantity: number;
  measurementType: "kg" | "bags";
  pricePerUnit: number;
}

// POST verify PIN and approve stock movement
export async function POST(request: Request): Promise<NextResponse> {
  try {
    await connectDB();

    // Parse body
    const body = (await request.json()) as { movementId: string; pin: string };
    const { movementId, pin } = body;

    if (!movementId || !pin) {
      return NextResponse.json(
        { success: false, error: "Movement ID and PIN are required" },
        { status: 400 }
      );
    }

    // Extract JWT from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];

    // Verify JWT and extract user ID
    let userId: string;
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "") as {
        id: string;
      };
      userId = payload.id;
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Verify PIN
    const isPinValid = await bcrypt.compare(pin, user.passcode);
    if (!isPinValid) {
      return NextResponse.json(
        { success: false, error: "Invalid PIN" },
        { status: 401 }
      );
    }

    // Fetch stock movement
    const movement = await StockMovement.findById(movementId);
    if (!movement) {
      return NextResponse.json(
        { success: false, error: "Movement not found" },
        { status: 404 }
      );
    }

    if (movement.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot approve movement. Current status: ${movement.status}`,
        },
        { status: 400 }
      );
    }

    // Determine if user is admin
    const isAdmin =
      user.roles?.includes("admin") || user.roles?.includes("super-admin");

    // If user is not admin, they must match authorizedBy
    if (!isAdmin && movement.authorizedBy.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to approve this movement" },
        { status: 403 }
      );
    }

    // Fetch warehouses
    const [sourceWarehouse, destinationWarehouse] = await Promise.all([
      Warehouse.findById(movement.sourceWarehouse),
      Warehouse.findById(movement.destinationWarehouse),
    ]);

    if (!sourceWarehouse || !destinationWarehouse) {
      return NextResponse.json(
        { success: false, error: "Warehouse not found" },
        { status: 404 }
      );
    }

    const sourceStock = sourceWarehouse.currentStock as IStockItem[];
    const destStock = destinationWarehouse.currentStock as IStockItem[];

    // Deduct stock from source
    const sourceIndex = sourceStock.findIndex(
      (item) =>
        item.grainType === movement.grainType &&
        item.measurementType === movement.measurementType
    );

    if (
      sourceIndex === -1 ||
      sourceStock[sourceIndex].quantity < movement.quantity
    ) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock in source warehouse" },
        { status: 400 }
      );
    }

    sourceStock[sourceIndex].quantity -= movement.quantity;
    if (sourceStock[sourceIndex].quantity <= 0)
      sourceStock.splice(sourceIndex, 1);

    // Add stock to destination
    const destIndex = destStock.findIndex(
      (item) =>
        item.grainType === movement.grainType &&
        item.measurementType === movement.measurementType
    );

    if (destIndex !== -1) {
      destStock[destIndex].quantity += movement.quantity;
      destStock[destIndex].pricePerUnit = movement.pricePerUnit;
    } else {
      destStock.push({
        grainType: movement.grainType,
        measurementType: movement.measurementType,
        quantity: movement.quantity,
        pricePerUnit: movement.pricePerUnit,
      });
    }

    // Update movement
    movement.status = "approved";
    movement.movementDate = new Date();
    if (!isAdmin) movement.authorizedBy = user._id; // only set authorizedBy for non-admins

    // Save changes
    await Promise.all([
      sourceWarehouse.save(),
      destinationWarehouse.save(),
      movement.save(),
    ]);

    await movement.populate([
      { path: "sourceWarehouse", select: "name location" },
      { path: "destinationWarehouse", select: "name location" },
      { path: "authorizedBy", select: "first_name last_name email roles" },
    ]);

    return NextResponse.json({
      success: true,
      data: movement,
      message: isAdmin
        ? "Stock movement auto-approved by admin"
        : "Stock movement approved",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
