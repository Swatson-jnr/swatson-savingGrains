import connectDB from "@/lib/db";
import { authenticate } from "@/lib/middleware/authMiddleware";
import Warehouse from "@/lib/models/warehouse";
import StockMovement from "@/lib/models/stock-movement";
import User from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";

// Types
interface StockItem {
  grainType: string;
  measurementType: string;
  quantity: number;
  pricePerUnit: number;
  notes?: string;
}

/**
 * GET — Fetch warehouse stock
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Fetching warehouse with ID:", id);

    const warehouse = await Warehouse.findById(id);

    if (!warehouse) {
      console.log("Warehouse not found for ID:", id);
      return NextResponse.json(
        { success: false, error: "Warehouse not found" },
        { status: 404 }
      );
    }

    console.log("Warehouse found:", warehouse);
    return NextResponse.json({
      success: true,
      data: warehouse.currentStock,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    console.error("GET /stock error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/**
 * POST — Add stock manually
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectDB();

    const auth = await authenticate(request);
    if (auth.error)
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );

    const userId = auth.user?.id;
    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );

    if (!user.roles?.includes("admin") && !user.roles?.includes("stock-manager")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: insufficient role" },
        { status: 403 }
      );
    }

    const body: StockItem & {
      sourceWarehouseId: string;
      destinationWarehouseId: string;
    } = await request.json();

    const {
      sourceWarehouseId,
      destinationWarehouseId,
      grainType,
      quantity,
      measurementType,
      pricePerUnit,
      notes,
    } = body;

    if (
      !sourceWarehouseId ||
      !destinationWarehouseId ||
      !grainType ||
      !quantity ||
      !measurementType ||
      !pricePerUnit
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (sourceWarehouseId === destinationWarehouseId) {
      return NextResponse.json(
        { success: false, error: "Warehouses cannot be the same" },
        { status: 400 }
      );
    }

    const [sourceWarehouse, destinationWarehouse] = await Promise.all([
      Warehouse.findById(sourceWarehouseId),
      Warehouse.findById(destinationWarehouseId),
    ]);

    if (!sourceWarehouse || !destinationWarehouse) {
      return NextResponse.json(
        { success: false, error: "Warehouse not found" },
        { status: 404 }
      );
    }

    const stockItem = sourceWarehouse.currentStock.find(
      (item: any) =>
        item.grainType === grainType && item.measurementType === measurementType
    );

    if (!stockItem) {
      return NextResponse.json(
        {
          success: false,
          error: `No ${grainType} stock found with measurement ${measurementType}`,
        },
        { status: 400 }
      );
    }

    if (stockItem.quantity < quantity) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient stock. Available: ${stockItem.quantity}, Requested: ${quantity}`,
        },
        { status: 400 }
      );
    }

    const totalValue = quantity * pricePerUnit;

    const movement = await StockMovement.create({
      sourceWarehouse: sourceWarehouseId,
      destinationWarehouse: destinationWarehouseId,
      grainType,
      measurementType,
      quantity,
      pricePerUnit,
      totalValue,
      authorizedBy: userId,
      status: "pending",
      notes: notes || "",
    });

    await movement.populate([
      { path: "sourceWarehouse", select: "name location" },
      { path: "destinationWarehouse", select: "name location" },
      { path: "authorizedBy", select: "first_name last_name email roles" },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: movement,
        message: "Stock movement created successfully (pending authorization)",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /stock error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE — Remove specific stock
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Fetching warehouse with ID:", id);

    const { searchParams } = new URL(request.url);
    const grainType = searchParams.get("grainType");
    const measurementType = searchParams.get("measurementType");

    if (!grainType || !measurementType) {
      return NextResponse.json(
        {
          success: false,
          error: "grainType and measurementType are required",
        },
        { status: 400 }
      );
    }

    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      console.log("Warehouse not found for ID:", id);
      return NextResponse.json(
        { success: false, error: "Warehouse not found" },
        { status: 404 }
      );
    }

    const index = warehouse.currentStock.findIndex(
      (item: any) =>
        item.grainType === grainType && item.measurementType === measurementType
    );

    if (index === -1) {
      console.log(
        "Stock item not found for deletion:",
        grainType,
        measurementType
      );
      return NextResponse.json(
        { success: false, error: "Stock item not found" },
        { status: 404 }
      );
    }

    warehouse.currentStock.splice(index, 1);
    await warehouse.save();
    console.log("Stock item removed successfully.");

    return NextResponse.json({
      success: true,
      message: "Stock item removed successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    console.error("DELETE /stock error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
