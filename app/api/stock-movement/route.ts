import connectDB from "@/lib/db";
import { authenticate } from "@/lib/middleware/authMiddleware";
import StockMovement from "@/lib/models/stock-movement";
import stockMovement from "@/lib/models/stock-movement";
import User from "@/lib/models/user";
import jwt from "jsonwebtoken";
import Warehouse from "@/lib/models/warehouse";

import { NextRequest, NextResponse } from "next/server";

// Types
interface RouteParams {
  params: {
    id: string;
  };
}

interface StockItem {
  grainType: string;
  measurementType: string;
  quantity: number;
  pricePerUnit: number;
}

// GET all stock movements with optional filters
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") ?? undefined;
    const sourceWarehouseId = searchParams.get("sourceWarehouse") ?? undefined;
    const destinationWarehouseId =
      searchParams.get("destinationWarehouse") ?? undefined;
    const grainType = searchParams.get("grainType") ?? undefined;

    const startDateString = searchParams.get("startDate");
    const endDateString = searchParams.get("endDate");

    const startDate = startDateString ? new Date(startDateString) : undefined;
    const endDate = endDateString ? new Date(endDateString) : undefined;

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const skip = (page - 1) * limit;

    // Build typed query object
    const query: Record<string, any> = {};

    if (status) query.status = status;
    if (sourceWarehouseId) query.sourceWarehouse = sourceWarehouseId;
    if (destinationWarehouseId)
      query.destinationWarehouse = destinationWarehouseId;
    if (grainType) query.grainType = grainType;

    if (startDate || endDate) {
      query.movementDate = {};
      if (startDate) query.movementDate.$gte = startDate;
      if (endDate) query.movementDate.$lte = endDate;
    }

    const [movements, total] = await Promise.all([
      stockMovement
        .find(query)
        .populate("sourceWarehouse", "name location")
        .populate("destinationWarehouse", "name location")
        .populate("authorizedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      stockMovement.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: movements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}


// Type for stock items in warehouses
interface IStockItem {
  grainType: string;
  quantity: number;
  measurementType: "kg" | "bags";
  pricePerUnit: number;
}

// Type for the decoded JWT payload
interface IJwtPayload {
  id: string;
}

// Type for user document we need
interface IUser {
  _id: string;
  roles?: string[];
  first_name?: string;
  last_name?: string;
  email?: string;
  passcode?: string;
}

// POST create stock movement
export async function POST(request: Request): Promise<NextResponse> {
  try {
    await connectDB();

    // Extract Authorization token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT and get userId
    let userId: string;
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || ""
      ) as IJwtPayload;
      userId = payload.id;
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Fetch user with explicit type
    const user = (await User.findById(userId).lean()) as IUser | null;
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = (await request.json()) as {
      sourceWarehouseId: string;
      destinationWarehouseId: string;
      grainType: string;
      quantity: number;
      measurementType: "kg" | "bags";
      pricePerUnit: number;
      notes?: string;
    };

    const {
      sourceWarehouseId,
      destinationWarehouseId,
      grainType,
      quantity,
      measurementType,
      pricePerUnit,
      notes,
    } = body;

    // Validate required fields
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
        {
          success: false,
          error: "Source and destination warehouses cannot be the same",
        },
        { status: 400 }
      );
    }

    // Fetch warehouses
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

    // Check stock availability
    const sourceStock = sourceWarehouse.currentStock as IStockItem[];
    const stockItem = sourceStock.find(
      (item) =>
        item.grainType === grainType && item.measurementType === measurementType
    );

    if (!stockItem) {
      return NextResponse.json(
        {
          success: false,
          error: `No ${grainType} stock with measurement ${measurementType} in source warehouse`,
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

    // ✅ Determine initial status based on role
    const isAdmin =
      user.roles?.includes("admin") || user.roles?.includes("super-admin");
    const status = isAdmin ? "approved" : "pending";

    // Create movement
    const movement = await StockMovement.create({
      sourceWarehouse: sourceWarehouseId,
      destinationWarehouse: destinationWarehouseId,
      grainType,
      measurementType,
      quantity,
      pricePerUnit,
      totalValue,
      authorizedBy: user._id,
      status,
      notes: notes || "",
      movementDate: new Date(),
    });

    // Auto-update stock if admin
    if (isAdmin) {
      // Remove from source
      stockItem.quantity -= quantity;
      if (stockItem.quantity <= 0) {
        const index = sourceStock.findIndex(
          (item) =>
            item.grainType === grainType &&
            item.measurementType === measurementType
        );
        sourceStock.splice(index, 1);
      }

      // Add to destination
      const destStock = destinationWarehouse.currentStock as IStockItem[];
      const destIndex = destStock.findIndex(
        (item) =>
          item.grainType === grainType &&
          item.measurementType === measurementType
      );
      if (destIndex !== -1) {
        destStock[destIndex].quantity += quantity;
        destStock[destIndex].pricePerUnit = pricePerUnit;
      } else {
        destStock.push({ grainType, quantity, measurementType, pricePerUnit });
      }

      await Promise.all([sourceWarehouse.save(), destinationWarehouse.save()]);
    }

    await movement.populate([
      { path: "sourceWarehouse", select: "name location" },
      { path: "destinationWarehouse", select: "name location" },
      { path: "authorizedBy", select: "first_name last_name email roles" },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: movement,
        message: isAdmin
          ? "Stock movement created and approved automatically"
          : "Stock movement created (pending approval)",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
